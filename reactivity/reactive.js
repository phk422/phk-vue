import { ITERATE_KEY } from './constants.js'
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
    has(target, key) {
      track(target, key)
      return Reflect.has(target, key)
    },
    ownKeys(target) {
      track(target, ITERATE_KEY)
      return Reflect.ownKeys(target)
    },
  })
}
