import { arrayInstrumentations } from './arrayInstrumentations.js'
import { ITERATE_KEY, TriggerType } from './constants.js'
import { track, trigger } from './effect.js'
import { hasChanged, hasOwn } from './utils.js'

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

function createReactive(target, isShallow = false, isReadonly = false) {
  const handles = target instanceof Set
    ? createMutableHandlers(isShallow, isReadonly)
    : createMutableCollectionHandlers(isShallow, isReadonly)
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
