import { reactive } from './reactive.js'

export function ref(value) {
  return reactive({
    value,
  })
}
