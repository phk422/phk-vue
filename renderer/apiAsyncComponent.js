import { ref, Text } from '../vue/index.js'

export function defineAsyncComponent(loader) {
  // 存储异步加载的组件
  let InnerComp = null
  return {
    name: 'AsyncComponentWrapper',
    setup() {
      const loaded = ref(false)
      loader().then((c) => {
        InnerComp = c
        loaded.value = true
      })
      return () => {
        return loaded.value ? { type: InnerComp } : { type: Text, children: '' }
      }
    },
  }
}
