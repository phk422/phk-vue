import { track, trigger } from './effect.js'

export function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      track()
      return target[key]
    },
    set(target, key, newVal) {
      target[key] = newVal
      trigger()
      return true
    },
  })
}
