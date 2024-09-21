import { effect, reactive } from '../index.js'

const setProxy = reactive(new Set([0, 1]))

effect(() => {
  // 读取size, 此时会报错：reactive.js:41 Uncaught TypeError: Method get Set.prototype.size called on incompatible receiver #<Set>
  console.log(setProxy.size)
})
