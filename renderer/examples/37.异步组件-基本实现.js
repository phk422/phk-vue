import { createRenderer, defineAsyncComponent, Fragment } from '../../vue/index.js'
import { getComp } from './components/AsyncComp.js'

const { render } = createRenderer()
const App = {
  name: 'App',

  setup() {
    const HelloWorld = defineAsyncComponent(() => import('./components/HelloWorld.js').then(c => c.default))
    const AsyncComp = defineAsyncComponent(getComp)
    return function () {
      return {
        type: Fragment,
        children: [
          { type: HelloWorld },
          { type: AsyncComp },
        ],
      }
    }
  },
}

render({ type: App }, document.getElementById('app'))
