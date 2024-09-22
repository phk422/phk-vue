import { effect, reactive } from '../index.js'

const map = new Map()
const mapProxy = reactive(map)
const map2Proxy = reactive(new Map())
mapProxy.set('map2Proxy', map2Proxy)

effect(() => {
  // 通过原始数据访问map
  console.log(map.get('map2Proxy').size)
})
map.get('map2Proxy').set('foo', 1) // 通过原始数据去操作数据不应该触发响应式的更新
console.log(map2Proxy)
