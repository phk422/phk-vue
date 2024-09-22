import { effect, reactive } from '../index.js'

const map = reactive(new Map([
  ['key1', { foo: 1 }],
  ['key2', 2],
]))

effect(() => {
  // Uncaught TypeError: map is not iterableUncaught TypeError: map is not iterable
  for (const [key, val] of map) {
    console.log(key, val)
    if (val.foo) {
      console.log(val.foo)
    }
  }
})

map.set('key2', 22)
console.log('---')
map.get('key1').foo++
