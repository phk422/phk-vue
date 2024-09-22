import { effect, reactive } from '../index.js'

const map = reactive(new Map([
  ['key', 1],
  ['key2', 2],
]))

effect(() => {
  for (const val of map.values()) {
    console.log(val)
  }
})

console.log('---')
map.set('key3', 3)
