import { effect, shallowRef } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

const vnode = shallowRef({
  type: 'button',
  children: '按钮1',
  props: {
    onClick(e) {
      console.log('Click：', e)
    },
    onMouseenter(e) {
      console.log('Mouseenter', e)
    },
  },
})

effect(() => {
  render(vnode.value, document.getElementById('app'))
})
