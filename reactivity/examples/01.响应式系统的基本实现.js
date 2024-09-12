import { effect, reactive } from '../index.js'

const app = document.querySelector('#app')

const obj = reactive({
  msg: 'Hello World!',
})
console.log(obj)
effect(() => {
  app.innerHTML = `
    <h3>${obj.msg}</h3>
  `
})
setTimeout(() => {
  obj.msg = 'Hello Vue!'
}, 2000)
