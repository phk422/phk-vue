import { effect, reactive } from '../index.js'

const setProxy = reactive(new Set([0, 1]))

effect(() => {
  // 34.代理Set-delete.js:6 Uncaught TypeError: Method Set.prototype.delete called on incompatible receiver
  console.log(setProxy.delete(1))
  console.log(setProxy)
})
