import { effect, reactive } from '../index.js'

const app = document.querySelector('#app')

const obj = reactive({ foo: 0 })

effect(() => {
  console.log('render')
  app.innerHTML = `
    <h2>${obj.foo}</h2>
  `
}, {
  scheduler(effectFn) {
    setTimeout(effectFn)
  },
})

setTimeout(() => {
  // 让副作用都在宏任务重执行
  obj.foo++
  console.log('开始执行')
  obj.foo++
}, 1000)
