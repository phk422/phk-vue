import { ITERATE_KEY } from './constants.js'

export let activeEffect = null
const effectStack = []
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

export function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    effectStack.push(effectFn)
    const res = fn()
    effectStack.pop()
    activeEffect = effectStack[effectStack.length - 1]
    return res
  }
  effectFn.deps = []
  effectFn.options = options
  effectFn.fn = fn // 记录下原始方法，方便调试
  if (!options.lazy) {
    effectFn()
  }
  // 将effectFn返回由外部手动执行
  return effectFn
}

const bucket = new WeakMap()

export function track(target, key) {
  if (!activeEffect)
    return
  let depsMap = bucket.get(target)
  if (!depsMap) {
    bucket.set(target, depsMap = new Map())
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, deps = new Set())
  }
  deps.add(activeEffect)
  activeEffect.deps.push(deps)
}

export function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (!depsMap)
    return
  const effectsToRun = new Set()
  const effects = depsMap.get(key)
  effects && effects.forEach((effectFn) => {
    effectsToRun.add(effectFn)
  })
  const iterateEffects = depsMap.get(ITERATE_KEY)
  iterateEffects && iterateEffects.forEach((effectFn) => {
    effectsToRun.add(effectFn)
  })
  effectsToRun.forEach((effectFn) => {
    if (effectFn !== activeEffect) {
      if (effectFn.options.scheduler) {
        effectFn.options.scheduler(effectFn)
      }
      else {
        effectFn()
      }
    }
  })
}
