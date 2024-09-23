/* eslint-disable no-unused-vars */
import { effect, proxyRefs, reactive, toRef, toRefs } from '../index.js'

const app = document.getElementById('app')

const obj = reactive({ count: 0, foo: 'foo' })

// 这就是我们在模板里面不用.value的基本原理
const newObj = proxyRefs({ ...toRefs(obj) })

effect(() => {
  // 假设这里是模板内容，每次用value去访问，导致增加用户的心智负担
  app.innerHTML = `
    <h2>${newObj.count}</h2>
  `
})

setInterval(() => {
  // obj.count++
  // 也可以直接用count进行修改
  newObj.count++
}, 1000)
