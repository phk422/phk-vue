import { onUnmounted, ref, Text } from '../vue/index.js'

export function defineAsyncComponent(options) {
  if (typeof options === 'function') {
    options = {
      loader: options,
    }
  }

  const { loader } = options
  // 存储异步加载的组件
  let InnerComp = null
  return {
    name: 'AsyncComponentWrapper',
    setup() {
      const loaded = ref(false)
      // 判断组件是否超时
      const timeout = ref(false)
      let timer = null
      if (options.timeout) {
        timer = setTimeout(() => {
          timeout.value = true
        }, options.timeout)
      }
      // 需要清理定时器
      onUnmounted(() => clearTimeout(timer))
      loader().then((c) => {
        InnerComp = c
        loaded.value = true
      })
      // 占位组件
      const placeholder = { type: Text, children: '' }
      return () => {
        if (loaded.value)
          return { type: InnerComp }
        else if (timeout.value)
          return options.errorComponent ? { type: options.errorComponent } : placeholder
        return placeholder
      }
    },
  }
}
