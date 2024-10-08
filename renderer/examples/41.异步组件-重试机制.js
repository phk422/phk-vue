import { createRenderer, defineAsyncComponent, Fragment } from '../../vue/index.js'
import { getCompErr } from './components/AsyncComp.js'
import LoadingComponent from './components/LoadingComponent.js'

const { render } = createRenderer()
const App = {
  name: 'App',

  setup() {
    const AsyncComp = defineAsyncComponent({
      loader: getCompErr,
      // 延迟200毫秒展示Loading组件
      delay: 200,
      loadingComponent: LoadingComponent,
      // 用户去处理错误
      onError(err, retry, fail, retries) {
        console.log(err, retry, fail, retries)
        console.log(`错误：${err}`)
        if (retries <= 2) {
          console.log('重试')
          retry()
        }
        else {
          setTimeout(() => {
            fail()
          }, 1000)
        }
      },
    })
    return function () {
      return {
        type: Fragment,
        children: [
          { type: AsyncComp },
        ],
      }
    }
  },
}

render({ type: App }, document.getElementById('app'))
