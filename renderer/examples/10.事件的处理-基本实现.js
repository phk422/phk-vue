import { effect, shallowRef } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

const vnode = shallowRef({
  type: 'button',
  children: '按钮1',
  props: {
    onClick(e) {
      console.log('按钮点击了：', e)
    },
  },
})

effect(() => {
  render(vnode.value, document.getElementById('app'))
})
