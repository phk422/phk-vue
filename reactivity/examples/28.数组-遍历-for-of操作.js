import { effect, reactive } from '../index.js'

const arr = reactive([0, 1])

effect(() => {
  console.log('effect')
  for (const item of arr) {
    console.log(item)
  }
})

arr[1] = 2
arr.length = 1
