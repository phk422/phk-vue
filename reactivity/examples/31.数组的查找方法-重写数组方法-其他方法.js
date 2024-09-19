import { effect, reactive } from '../index.js'

const obj = { foo: 1 }
const arr = reactive([obj])

// indexOf, lastIndexOf
effect(() => {
  console.log(arr.indexOf(obj)) // 应该输出true
  console.log(arr.lastIndexOf(1))
})

setTimeout(() => {
  arr[1] = 1
}, 1000)
