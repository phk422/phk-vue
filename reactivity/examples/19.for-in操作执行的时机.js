import { effect, reactive } from '../index.js'

const obj = reactive({ foo: 1, bar: 'hello' })

effect(() => {
  for (const key in obj) {
    console.log(key)
  }
})

setTimeout(() => {
  obj.foo++ // 实际上修改不应该触发副作用执行
  obj.baz = 1 // 添加才执行
  delete obj.bar // 删除也执行
}, 1000)
