import { createRenderer, ref } from '../../../vue/index.js'
import Teleport from '../Teleport.js'

const { render } = createRenderer()

const App = {
  name: 'App',
  setup() {
    const showH3 = ref(true)
    const toggle = () => showH3.value = !showH3.value
    return () => {
      return {
        type: 'div',
        children: [
          {
            type: 'button',
            props: {
              onClick: toggle,
            },
            children: '切换',
          },

          {
            type: Teleport,
            props: { to: 'body' },
            children: [
              { type: 'h2', children: '我将渲染到body上h2', key: 1 },
              showH3.value ? { type: 'h3', children: '我将渲染到body上h3', key: 2 } : { type: 'span', children: 'none', key: 2 },
            ],
          },
        ],
      }
    }
  },
}

render({
  type: App,
}, document.getElementById('app'))
