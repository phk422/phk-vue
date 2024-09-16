import { effect, reactive } from '../index.js'

const arr = reactive([0])

effect(() => {
  console.log(arr[0])
})

arr.length = 0 // 应该触发副作用
