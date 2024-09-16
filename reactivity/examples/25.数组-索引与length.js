import { effect, reactive } from '../index.js'

const arr = reactive([1])

effect(() => {
  // console.log(arr[0])
  console.log(arr.length)
})

arr[2] = 2
