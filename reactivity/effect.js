export let activeEffect = null

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

export function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn)
    activeEffect = effectFn
    fn()
    activeEffect = null
  }
  effectFn.deps = []
  effectFn()
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
  if (depsMap) {
    const effects = depsMap.get(key)
    if (effects) {
      const effectsToRun = new Set(effects)
      effectsToRun.forEach(effectFn => effectFn())
    }
  }
}
