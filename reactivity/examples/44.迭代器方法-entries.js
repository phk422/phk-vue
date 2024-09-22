import { effect, reactive } from '../index.js'

const map = reactive(new Map([
  ['key', 1],
  ['key2', 2],
]))

effect(() => {
  for (const [key, val] of map.entries()) {
    console.log(key, val)
  }
})
