import { effect } from '../../reactivity/index.js'
import { createRenderer, Fragment } from '../index.js'

const { render } = createRenderer()
const MyComponent = {
  name: 'MyComponent',

  setup(props, { slots }) {
    return function () {
      console.log(this.$slots === slots) // true
      return {
        type: Fragment,
        children: [
          slots.header(),
          slots.default(),
          slots.footer('footer'),
          { type: 'h4', children: 'other' },
        ],
      }
    }
  },
}

effect(() => {
  render({ type: MyComponent, children: {
    // 默认插槽
    default() {
      return { type: 'h2', children: 'Slot Body' }
    },
    // 具名插槽
    header() {
      return { type: 'h1', children: 'Slot Header' }
    },
    // 携带参数
    footer(text) {
      return { type: 'h3', children: text }
    },
  } }, document.getElementById('app'))
})
