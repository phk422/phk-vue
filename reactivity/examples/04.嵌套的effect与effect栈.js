import { effect, reactive } from '../index.js'

const obj = reactive({
  foo: 1,
  bar: 'bar',
})

effect(() => {
  effect(() => {
    console.log(obj.bar, 'effectFn2')
  })
  console.log(obj.foo, 'effectFn1')
})

setTimeout(() => {
  obj.foo++ // 这里不应该执行effectFn2
}, 1000)
