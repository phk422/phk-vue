import { effect, reactive, watch } from '../index.js'

const data = reactive({ value: 0, updateCount: 0 })

function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(++data.value)
    }, 1000)
  })
}

const finalData = reactive({ value: null })
watch(() => data.updateCount, async (newValue, oldVal, onCleanup) => {
  let isExpired = false
  onCleanup(() => {
    isExpired = true
  })
  const data = await fetchData()
  if (!isExpired) {
    finalData.value = data
  }
})

effect(() => {
  console.log(`finalData: ${finalData.value}`)
})

data.updateCount++

setTimeout(() => {
  data.updateCount++
}, 200)
