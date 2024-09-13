import { reactive, watch } from '../index.js'

const state = reactive({
  count: 0,
})

watch(() => state.count, (newVal, oldVal) => {
  console.log(newVal, oldVal)
}, {
  immediate: true,
})

setTimeout(() => {
  state.count++
}, 1000)
