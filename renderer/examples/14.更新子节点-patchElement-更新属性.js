import { effect, shallowRef } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

const vnode = shallowRef({
  type: 'button',
  children: '按钮',
  props: {
    id: 'foo',
    class: 'bar',
    onClick() {
      console.log('update-props')
      vnode.value = {
        type: 'button',
        children: '新按钮',
        props: {
          id: 'new-foo',
        },
      }
    },
  },
})

effect(() => {
  render(vnode.value, document.getElementById('app'))
})
