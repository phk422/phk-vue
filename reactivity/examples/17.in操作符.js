import { effect, reactive } from '../index.js'

const obj = reactive({ foo: 1, bar: 'hello' })

effect(() => {
  console.log('foo' in obj)
})

setTimeout(() => {
  obj.foo++
}, 1000)
