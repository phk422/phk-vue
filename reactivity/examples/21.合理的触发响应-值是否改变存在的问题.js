import { effect, reactive } from '../index.js'

const obj = reactive({ value: 1 })

effect(() => {
  console.log(obj.value)
})

obj.value = Number.NaN
obj.value = Number.NaN // 这个不应该触发副作用

obj.value = -0
obj.value = +0 // 这个应该触发副作用

/**
 * 1. 在js中，当NaN === NaN时，它的结果是false，因此需要修复这个问题，js中提供了一个方法来对比两个数，
 * 2. +0 === -0，它的结果也是true，实际上它的结果应该是false
 * 使用Object.is可以解决以上两个问题
 */
