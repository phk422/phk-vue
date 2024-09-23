import { effect, reactive } from '../index.js'

const map = reactive(new Map([
  ['key', 1],
  ['key2', 2],
]))

effect(() => {
  for (const val of map.keys()) {
    console.log(val)
  }
})

console.log('---')
map.set('key3', 3)
map.set('key3', 2) // 这个不应该触发响应式
