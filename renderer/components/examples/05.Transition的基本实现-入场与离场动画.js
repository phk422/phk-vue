import { createRenderer, ref } from '../../../vue/index.js'
import Transition from '../Transition.js'

const { render } = createRenderer()

const App = {
  name: 'App',
  setup() {
    const show = ref(true)
    function onLeave() {
      show.value = false
    }
    return () => {
      return {
        type: Transition,
        children: {
          default() {
            return show.value
              ? { type: 'h2', props: { class: 'box', onClick: onLeave }, children: '点我试试离场' }
              : null
          },
        },
      }
    }
  },
}

render({
  type: App,
}, document.getElementById('app'))
