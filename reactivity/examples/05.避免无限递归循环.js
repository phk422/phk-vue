import { effect, reactive } from '../index.js'

const obj = reactive({ foo: 0 })

effect(() => {
  console.log('effect')
  obj.foo = obj.foo + 1 // Maximum call stack size exceeded
})
