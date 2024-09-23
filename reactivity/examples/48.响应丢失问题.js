/* eslint-disable no-unused-vars */
import { effect, reactive, toRef, toRefs } from '../index.js'

const app = document.getElementById('app')

const obj = reactive({ count: 0, foo: 'foo' })

// 响应式数据丢失
// const newObj = {...obj}
// const newObj = {
//   count: {
//     get value() {
//       return obj.count
//     },
//   },
// }
// const newObj = {
//   count: toRef(obj, 'count'),
//   foo: toRef(obj, 'foo'),
// }

const newObj = { ...toRefs(obj) }

effect(() => {
  app.innerHTML = `
    <h2>${newObj.count.value}</h2>
  `
})

setInterval(() => {
  obj.count++
}, 1000)
