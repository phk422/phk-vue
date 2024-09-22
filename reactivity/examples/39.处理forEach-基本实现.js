import { effect, reactive } from '../index.js'

const set = reactive(new Set([1, 2]))
effect(() => {
  set.forEach((item, index, set) => {
    console.log('item:', item, 'index:', index, set)
  })
})

console.log('update')
set.add(3)
