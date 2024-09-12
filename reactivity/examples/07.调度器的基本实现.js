import { effect, flushJob, jobQueue, reactive } from '../index.js'

const app = document.querySelector('#app')

const obj = reactive({ foo: 0 })

effect(() => {
  console.log('render')
  app.innerHTML = `
    <h2>${obj.foo}</h2>
  `
}, {
  scheduler(effectFn) {
    jobQueue.add(effectFn)
    flushJob()
  },
})

// 让render只执行一次
setTimeout(() => {
  obj.foo++
  obj.foo++
  obj.foo++
}, 1000)
