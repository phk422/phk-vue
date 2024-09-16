import { effect, reactive } from '../index.js'

const parent = reactive({ name: 'hk' })
const child = reactive({ age: 18 })
Object.setPrototypeOf(child, parent)

effect(() => {
  console.log(child.name) // 这里会触发两次副作用的执行
})

child.name = 'phk'
