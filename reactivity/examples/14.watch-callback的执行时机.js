import { reactive, watch } from '../index.js'

const state = reactive({
  count: 0,
})

watch(() => state.count, (newVal, oldVal) => {
  console.log(newVal, oldVal)
}, {
  flush: 'post', // 'sync' | 'pre' | 'post'
})

/**
 * sync: 表示会同步执行
 * post: 表示放在微队列中执行（组件更新后）
 * pre: 表示在微队列中执行（组件更新前）
 * 这里暂时先讨论post与sync
 * vue源码默认是pre即在组件更新前
 */

setTimeout(() => {
  state.count++
  state.count++
  console.log('结束了~') // 指定post先输出'结束了~'
  state.count++
}, 1000)
