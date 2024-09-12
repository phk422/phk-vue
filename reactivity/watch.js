import { effect } from './effect.js'

export function watch(source, cb) {
  const effectFn = effect(source, {
    scheduler: () => {
      const newVal = effectFn()
      cb(newVal)
    },
  })
}
