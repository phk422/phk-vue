import { reactive, watch } from '../index.js'

const state = reactive({
  count: 0,
  name: 'foo',
})

watch(state, (newVal) => {
  console.log(newVal)
})

setTimeout(() => {
  state.count++
}, 1000)

setTimeout(() => {
  state.name = 'bar'
}, 2000)
