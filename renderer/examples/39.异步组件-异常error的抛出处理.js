import { createRenderer, defineAsyncComponent, Fragment } from '../../vue/index.js'
// eslint-disable-next-line no-unused-vars
import { getComp, getCompErr } from './components/AsyncComp.js'
import ErrorComponent from './components/ErrorComponent.js'

const { render } = createRenderer()
const App = {
  name: 'App',

  setup() {
    const AsyncComp = defineAsyncComponent({
      loader: getCompErr,
      timeout: 1000,
      errorComponent: ErrorComponent,
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
