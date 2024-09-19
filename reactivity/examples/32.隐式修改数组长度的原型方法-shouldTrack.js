import { effect, reactive } from '../index.js'

const arr = reactive([])

// 两个副作用相互影响: 问题的原因是 push 方法的调用会间接读取 length 属性。所以，只要“屏蔽”对 length 属性的读取，从而避免在它与副作用函数之间建立响应联系
effect(() => {
  console.log('effect')
  arr.push(1)
})
effect(() => {
  arr.push(1)
})
