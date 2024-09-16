// eslint-disable-next-line no-unused-vars
import { effect, reactive, shallowReactive } from '../index.js'

// const obj = reactive({ foo: { bar: 1 }, count: 0 })
const obj = shallowReactive({ foo: { bar: 1 }, count: 0 })

effect(() => {
  console.log(obj.foo.bar)
})

obj.foo.bar++
