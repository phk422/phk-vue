import { ReactiveFlags } from './constants.js'
import { reactive, shallowReactive } from './reactive.js'

export function ref(value) {
  return createRef(value)
}

export function shallowRef(value) {
  return createRef(value, true)
}

export function createRef(value, shallow = false) {
  const wrapper = {
    value,
  }
  // 不可枚举且不可写的属性 __v_isRef，它的值为 true，代表这个对象是一个 ref，而非普通对象。
  Object.defineProperty(wrapper, ReactiveFlags.IS_REF, {
    value: true,
  })
  return shallow ? shallowReactive(wrapper) : reactive(wrapper)
}

export function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key]
    },
    // 允许设置值
    set value(newValue) {
      obj[key] = newValue
    },
  }
  // 标记为ref对象
  Object.defineProperty(wrapper, ReactiveFlags.IS_REF, {
    value: true,
  })
  return wrapper
}

export function toRefs(obj) {
  const result = {}
  for (const key in obj) {
    result[key] = toRef(obj, key)
  }
  return result
}

export function proxyRefs(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver)
      return result[ReactiveFlags.IS_REF] ? result.value : result
    },
    set(target, key, newValue, receiver) {
      const value = target[key]
      if (value[ReactiveFlags.IS_REF]) {
        value.value = newValue
        return true
      }
      return Reflect.set(target, key, newValue, receiver)
    },
  })
}
