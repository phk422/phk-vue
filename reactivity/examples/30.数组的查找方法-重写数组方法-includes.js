import { effect, reactive } from '../index.js'

const obj = { foo: 1 }
const arr = reactive([obj])

effect(() => {
  console.log(arr.includes(obj)) // 应该输出true
  console.log(arr.includes(arr[0]))
})
