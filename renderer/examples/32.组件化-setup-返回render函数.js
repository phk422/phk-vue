import { effect } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()
const MyComponent = {
  name: 'MyComponent',
  props: {
    title: 'This is a title',
  },

  setup(props) {
    return function () {
      return {
        type: 'h2',
        children: `${this.title} --- ${props.title}`,
      }
    }
  },
}

effect(() => {
  render({ type: MyComponent, props: { class: 'foo', title: 'Hello' } }, document.getElementById('app'))
})
