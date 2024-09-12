import { effect, reactive } from '../index.js'

const app = document.querySelector('#app')

const obj = reactive({
  msg: 'Hello World!',
})

effect(() => {
  console.log('effect')
  app.innerHTML = `
    <h3>${obj.msg}</h3>
  `
})

setTimeout(() => {
  obj.notExist = 'Hello Vue!' // 不应该触发effect的执行
  obj.msg = 'Hello Vue!'
}, 2000)
