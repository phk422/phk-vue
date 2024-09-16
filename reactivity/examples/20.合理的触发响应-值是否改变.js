import { effect, reactive } from '../index.js'

const obj = reactive({ value: 1 })

effect(() => {
  console.log(obj.value)
})

obj.value++
// eslint-disable-next-line no-self-assign
obj.value = obj.value // 这个不应该触发副作用
