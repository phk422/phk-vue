import { effect, reactive } from '../index.js'

const setProxy = reactive(new Set([0]))

effect(() => {
  console.log(setProxy.size)
})

setProxy.add(1) // 应该触发响应式操作
setProxy.add(1) // 不应该触发响应式操作
