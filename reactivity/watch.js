import { effect } from './effect.js'

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

export function watch(source, cb) {
  let getter
  if (typeof source === 'function') {
    getter = source
  }
  else {
    getter = () => traverse(source)
  }
  const effectFn = effect(getter, {
    scheduler: () => {
      const newVal = effectFn()
      cb(newVal)
    },
  })
}
