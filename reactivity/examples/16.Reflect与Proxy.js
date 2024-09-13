import { effect, reactive } from '../index.js'

const obj = reactive({
  count: 1,
  get doubleCount() {
    // return obj.count * 2 // 这样就可以正确收集了
    return this.count * 2 // 这里this 指向obj并不是代理的对象，这里就需要Reflect，使当前的this是代理对象
  },
})

effect(() => {
  console.log(obj.doubleCount)
})

obj.count++ // 应该触发响应式更新
