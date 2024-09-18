import { effect, reactive } from '../index.js'

const arr = reactive([0, 1])

effect(() => {
  for (const index in arr) {
    console.log(index)
  }
})

arr.length = 1
arr[1] = 1
