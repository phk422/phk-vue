import { createRenderer, ref } from '../../../vue/index.js'
import Teleport from '../Teleport.js'

const { render } = createRenderer()

const App = {
  name: 'App',
  setup() {
    const target = ref('body')
    const toggle = () => target.value = target.value === 'body' ? '.target' : 'body'
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
            props: { to: target.value },
            children: [
              { type: 'h2', children: '我将渲染到body上h2', key: 1 },
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
