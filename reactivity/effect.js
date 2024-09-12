export let activeEffect = null
export function effect(fn) {
  activeEffect = fn
  fn()
  activeEffect = null
}

const bucket = new Set()

export function track() {
  if (!activeEffect)
    return
  bucket.add(activeEffect)
}

export function trigger() {
  bucket.forEach(fn => fn())
}
