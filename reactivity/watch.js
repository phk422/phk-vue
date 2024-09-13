import { effect } from './effect.js'
import { flushJob, jobQueue } from './scheduler.js'

// 对对象的每个属性都读取，触发依赖的收集
function traverse(value, seen = new Set()) {
  if (typeof value !== 'object' || value === null || seen.has(value)) {
    return value
  }
  seen.add(value)
  for (const key in value) {
    traverse(value[key], seen)
  }
  return value
}

export function watch(source, cb, { immediate = false, flush } = {}) {
  let getter
  if (typeof source === 'function') {
    getter = source
  }
  else {
    getter = () => traverse(source)
  }
  let oldValue
  let clean

  const onCleanup = (fn) => {
    clean = fn
  }
  const job = () => {
    clean && clean()
    const newVal = effectFn()
    cb(newVal, oldValue, onCleanup)
    oldValue = newVal
  }
  const effectFn = effect(getter, {
    lazy: true,
    scheduler: () => {
      if (flush === 'post') {
        jobQueue.add(job)
        flushJob()
      }
      else {
        // sync
        job()
      }
    },
  })
  if (immediate) {
    job()
  }
  else {
    oldValue = effectFn()
  }
}
