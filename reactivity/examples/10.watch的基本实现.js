import { reactive, watch } from '../index.js'

const state = reactive({
  count: 0,
})

watch(() => state.count, (newVal) => {
  console.log(newVal)
})

setTimeout(() => {
  state.count++
}, 1000)
