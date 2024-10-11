import { createRenderer, Fragment, ref } from '../../../vue/index.js'
import Transition from '../Transition.js'

const { render } = createRenderer()

const App = {
  name: 'App',
  setup() {
    const show = ref(true)
    function toggle() {
      show.value = !show.value
    }
    return () => {
      return {
        type: Fragment,
        children: [
          {
            type: 'button',
            children: 'toggle',
            props: {
              onClick: toggle,
            },
          },
          {
            type: Transition,
            children: {
              default() {
                return show.value && { type: 'h2', props: { class: 'box' }, children: 'Hello' }
              },
            },
          },
        ],
      }
    }
  },
}

render({
  type: App,
}, document.getElementById('app'))
