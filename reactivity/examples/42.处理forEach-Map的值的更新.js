import { effect, reactive } from '../index.js'

const map = reactive(new Map([
  ['key', 1],
]))

effect(() => {
  map.forEach((value, key) => {
    console.log(value, key)
  })
})

map.set('key', 2) // 此时并不会触发
