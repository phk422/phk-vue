import { effect, reactive } from '../index.js'

const mapProxy = reactive(new Map([
  ['key', 0],
]))

effect(() => {
  console.log(mapProxy.get('key'))
})

mapProxy.set('key', 1)
mapProxy.set('key', 2)
mapProxy.set('key', 2) // 不应该触发副作用的执行
