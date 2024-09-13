import { track, trigger } from './effect.js'

export function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, newVal, receiver) {
      const res = Reflect.set(target, key, newVal, receiver)
      trigger(target, key)
      return res
    },
  })
}
