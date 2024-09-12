import { computed, effect, reactive } from '../index.js'

const app = document.querySelector('#app')

const obj = reactive({ count: 1 })

const doubleCount = computed(() => {
  console.log('computed')
  return obj.count * 2
})

effect(() => {
  app.innerHTML = `
    <div>doubleCount: ${doubleCount.value}</div>
    <div>doubleCount: ${doubleCount.value}</div>
  `
})

setTimeout(() => {
  obj.count++
}, 2000)
