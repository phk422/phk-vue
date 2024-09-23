import { arrayInstrumentations } from './arrayInstrumentations.js'
import { ITERATE_KEY, TriggerType } from './constants.js'
import { track, trigger } from './effect.js'
import { hasChanged, hasOwn, isObject } from './utils.js'

export const reactiveMap = new WeakMap()

export function reactive(target) {
  const existProxy = reactiveMap.get(target)
  if (existProxy)
    return existProxy
  const proxyObj = createReactive(target, false)
  reactiveMap.set(target, proxyObj)
  return proxyObj
}

export function shallowReactive(target) {
  return createReactive(target, true)
}

export function readonly(target) {
  return createReactive(target, false, true)
}

export function shallowReadonly(target) {
  return createReactive(target, true, true)
}

function createMutableInstrumentations(isShallow = false, isReadonly = false) {
  function createIterableMethod(method) {
    return function () {
      const target = this.raw
      const isPair = method === 'entries' || method === Symbol.iterator
      const itr = target[method]()
      if (!isReadonly) {
        track(target, ITERATE_KEY)
      }
      return {
        // 迭代器协议
        next() {
          const { done, value } = itr.next()
          return {
            value: isPair
              ? (value ? [wrap(value[0]), wrap(value[1])] : value)
              : wrap(value),
            done,
          }
        },
        // 可迭代协议
        [Symbol.iterator]() {
          return this
        },
      }
    }
  }
  const wrap = value => !isShallow && isObject(value) ? reactive(value) : value
  return {
    [Symbol.iterator]: createIterableMethod(Symbol.iterator),
    entries: createIterableMethod('entries'),
    values: createIterableMethod('values'),
    add(key) {
      if (isReadonly) {
        console.warn(`'${key}' is readonly`)
        return true
      }
      const target = this.raw // 这里的this指向代理对象
      const hadKey = target.has(key)
      const result = target.add(key)
      // 优化：如果已经存在了就u需要触发副作用的执行了
      if (!hadKey) {
        trigger(target, key, TriggerType.ADD)
      }
      return result
    },
    delete(key) {
      if (isReadonly) {
        console.warn(`'${key}' is readonly`)
        return true
      }
      const target = this.raw
      const result = target.delete(key)
      if (result) {
        trigger(target, key, TriggerType.DELETE)
      }
      return result
    },
    get(key) {
      const target = this.raw
      const hadKey = target.has(key)
      if (!isReadonly) {
        track(target, key)
      }
      if (hadKey) {
        const res = target.get(key)
        if (!isShallow && isObject(res)) {
          return isReadonly ? readonly(res) : reactive(res)
        }
        return res
      }
    },
    set(key, value) {
      if (isReadonly) {
        console.warn(`'${key}' is readonly`)
        return this
      }
      const target = this.raw
      const hadKey = target.has(key)
      const oldValue = target.get(key)
      // 不能把响应式数据设置到原始数据上，会造成数据污染
      const rawValue = value.raw || value
      target.set(key, rawValue)
      if (!hadKey) {
        trigger(target, key, TriggerType.ADD)
      }
      else if (hasChanged(value, oldValue)) {
        trigger(target, key, TriggerType.SET)
      }
      return this
    },
    forEach(callback, thisArg) {
      const target = this.raw
      track(target, ITERATE_KEY)
      target.forEach((value, key) => {
        callback.call(thisArg, wrap(value), wrap(key), this)
      })
    },
  }
}

function createMutableHandlers(isShallow = false, isReadonly = false) {
  return {
    get(target, key, receiver) {
      if (key === 'raw') {
        return target
      }
      if (Array.isArray(target) && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver) // 返回重写的方法
      }
      if (!isReadonly && typeof key !== 'symbol') {
        track(target, key)
      }
      const value = Reflect.get(target, key, receiver)
      if (!isShallow && typeof value === 'object' && value !== null) {
        return isReadonly ? readonly(value) : reactive(value)
      }
      return value
    },
  }
}
function createMutableCollectionHandlers(isShallow = false, isReadonly = false) {
  return {
    get(target, key) {
      if (key === 'raw') {
        return target
      }
      if (key === 'size') {
        track(target, ITERATE_KEY)
        return Reflect.get(target, key, target)
      }
      return createMutableInstrumentations(isShallow, isReadonly)[key]
    },
  }
}

function createReactive(target, isShallow = false, isReadonly = false) {
  const handles = (target instanceof Set || target instanceof Map)
    ? createMutableCollectionHandlers(isShallow, isReadonly)
    : createMutableHandlers(isShallow, isReadonly)
  return new Proxy(target, {
    ...handles,
    set(target, key, newVal, receiver) {
      if (isReadonly) {
        console.warn(`'${key}' is readonly`)
        return true
      }
      const oldValue = target[key]

      const type = Array.isArray(target)
        ? (Number(key) < target.length ? TriggerType.SET : TriggerType.ADD)
        : (hasOwn(target, key) ? TriggerType.SET : TriggerType.ADD)

      const res = Reflect.set(target, key, newVal, receiver)
      // 只有当 receiver是 target 的代理对象时才触发更新, 解决原型链的问题
      if (target === receiver.raw && hasChanged(newVal, oldValue)) {
        trigger(target, key, type, newVal)
      }
      return res
    },
    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },
    ownKeys(target) {
      track(target, Array.isArray(target) ? 'length' : ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
    deleteProperty(target, key) {
      if (isReadonly) {
        console.warn(`'${key}' is readonly`)
        return true
      }
      const hadKey = hasOwn(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (hadKey && res) {
        trigger(target, key, TriggerType.DELETE)
      }
      return res
    },
  })
}
