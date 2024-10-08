import { onUnmounted, ref, Text } from '../vue/index.js'

export function defineAsyncComponent(options) {
  if (typeof options === 'function') {
    options = {
      loader: options,
    }
  }

  const { loader, onError: userOnError } = options
  // 存储异步加载的组件
  let InnerComp = null
  let retries = 0
  const load = () => {
    return loader().catch((err) => {
      if (userOnError) {
        return new Promise((resolve, reject) => {
          const retry = () => {
            retries++
            resolve(load())
          }
          const fail = () => reject(err)
          userOnError(err, retry, fail, retries + 1)
        })
      }
      else {
        throw err
      }
    })
  }
  return {
    name: 'AsyncComponentWrapper',
    setup() {
      const loaded = ref(false)
      const loading = ref(false)
      // error
      const error = ref(null)
      let timer = null
      if (options.timeout) {
        timer = setTimeout(() => {
          error.value = `Async component timed out after ${options.timeout}ms.`
        }, options.timeout)
      }
      let loadingTimer = null
      if (options.delay) {
        loadingTimer = setTimeout(() => {
          loading.value = true
        }, options.delay)
      }
      // 需要清理定时器
      onUnmounted(() => clearTimeout(timer))
      load().then((c) => {
        InnerComp = c
        loaded.value = true
        loading.value = false
        clearTimeout(loadingTimer)
      }).catch((e) => {
        error.value = e
        loading.value = false
        clearTimeout(loadingTimer)
      })
      // 占位组件
      const placeholder = { type: Text, children: '' }
      return () => {
        if (loaded.value) {
          return { type: InnerComp }
        }
        else if (error.value && options.errorComponent) {
          return { type: options.errorComponent, props: { error: error.value } } // 将error传递给用户，可以自己处理错误
        }
        else if (loading.value && options.loadingComponent) {
          return { type: options.loadingComponent }
        }
        return placeholder
      }
    },
  }
}
