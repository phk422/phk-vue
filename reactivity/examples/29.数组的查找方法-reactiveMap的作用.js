import { effect, reactive } from '../index.js'

/*
const arr = reactive([0])
effect(() => {
  // 调用includes时 内部会访问数组的 length 属性以及数组的索引
  console.log(arr.includes(1))
})

arr.length = 0 // 可以触发
arr[0] = 1 // 可以触发
*/

const obj = { foo: 1 }
const arr = reactive([obj])

effect(() => {
  console.log(arr.includes(arr[0])) // 应该输出true
})
