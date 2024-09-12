export let activeEffect = null
export function effect(fn) {
  activeEffect = fn
  fn()
  activeEffect = null
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
}

export function trigger(target, key) {
  const depsMap = bucket.get(target)
  if (depsMap) {
    const deps = depsMap.get(key)
    if (deps) {
      deps.forEach(effectFn => effectFn())
    }
  }
}
