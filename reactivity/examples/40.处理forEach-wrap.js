import { effect, reactive } from '../index.js'

const key = { foo: 'foo' }
const value = new Set([1, 2])
const map = reactive(new Map([
  [key, value],
]))

effect(() => {
  map.forEach((value, key, map) => {
    console.log(value.size)
    console.log('key: ', key, 'map: ', map)
  })
})

map.get(key).add(3) // 应该触发effect的执行

map.set('key', 2)
