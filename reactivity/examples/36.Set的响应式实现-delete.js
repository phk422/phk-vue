import { effect, reactive } from '../index.js'

const setProxy = reactive(new Set([0, 1]))

effect(() => {
  console.log(setProxy.size)
})

setProxy.delete(0) // 应该触发响应式操作
setProxy.delete(2) // 不应该触发响应式操作
