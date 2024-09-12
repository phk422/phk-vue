import { effect, reactive } from '../index.js'

const app = document.querySelector('#app')

const obj = reactive({
  ok: true,
  okMessage: 'ok',
})

effect(() => {
  console.log('effect run')
  app.innerHTML = `
    <h3>${obj.ok ? obj.okMessage : 'not'}</h3>
  `
})

setTimeout(() => {
  obj.ok = false
  obj.okMessage = 'okk' // 这里不应该触发副作用
}, 2000)
