import { effect, ref } from '../index.js'

const count = ref(0)

effect(() => {
  console.log(count.value)
})

count.value++
console.log(count)
