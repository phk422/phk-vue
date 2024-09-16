import { ITERATE_KEY, TriggerType } from './constants.js'
import { track, trigger } from './effect.js'
import { hasChanged, hasOwn } from './utils.js'

export function reactive(target) {
  return new Proxy(target, {
    get(target, key, receiver) {
      track(target, key)
      return Reflect.get(target, key, receiver)
    },
    set(target, key, newVal, receiver) {
      const oldValue = target[key]
      const type = hasOwn(target, key) ? TriggerType.SET : TriggerType.ADD
      const res = Reflect.set(target, key, newVal, receiver)
      if (hasChanged(newVal, oldValue)) {
        trigger(target, key, type)
      }
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
    deleteProperty(target, key) {
      const hadKey = hasOwn(target, key)
      const res = Reflect.deleteProperty(target, key)
      if (hadKey && res) {
        trigger(target, key, TriggerType.DELETE)
      }
      return res
    },
  })
}
