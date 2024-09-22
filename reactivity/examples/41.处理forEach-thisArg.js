import { effect, reactive } from '../index.js'

const key = { foo: 'foo' }
const value = new Set([1, 2])
const map = reactive(new Map([
  [key, value],
]))

effect(() => {
  map.forEach(function () {
    console.log(this)
  }, { foo: 1 })
})
