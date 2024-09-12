import { effect, reactive } from '../index.js'

const obj = reactive({ foo: 0 })

// 让effectFn不立即执行
const effectFn = effect(() => {
  console.log('effectFn', obj.foo)
}, {
  lazy: true,
})

// 手动执行
setTimeout(() => {
  effectFn()
}, 2000)
