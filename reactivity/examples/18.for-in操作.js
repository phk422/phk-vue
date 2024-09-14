import { effect, reactive } from '../index.js'

const obj = reactive({ foo: 1, bar: 'hello' })

effect(() => {
  for (const key in obj) {
    console.log(key)
  }
})

setTimeout(() => {
  obj.foo++
}, 1000)
