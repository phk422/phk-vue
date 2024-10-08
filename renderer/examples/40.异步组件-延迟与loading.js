import { createRenderer, defineAsyncComponent, Fragment } from '../../vue/index.js'
import { getComp } from './components/AsyncComp.js'
import LoadingComponent from './components/LoadingComponent.js'

const { render } = createRenderer()
const App = {
  name: 'App',

  setup() {
    const AsyncComp = defineAsyncComponent({
      loader: getComp,
      // 延迟200毫秒展示Loading组件
      delay: 200,
      loadingComponent: LoadingComponent,
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
