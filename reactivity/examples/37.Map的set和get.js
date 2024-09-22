import { effect, reactive, readonly } from '../index.js'

const mapProxy = reactive(new Map([
  ['key', 0],
]))

effect(() => {
  console.log(mapProxy.get('key'))
})

mapProxy.set('key', 1)
mapProxy.set('key', 2)
mapProxy.set('key', 2) // 不应该触发副作用的执行

console.log('---readonly---')
const readonlySet = readonly(new Set([0, 1]))

console.log(readonlySet.add(1))
console.log(readonlySet.delete(0))
console.log('---readonly---')
