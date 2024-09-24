import { effect, shallowRef } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

const vnode = shallowRef({
  type: 'button',
  children: '按钮',
  props: {
    id: 'foo',
    class: 'bar',
  },
})

effect(() => {
  render(vnode.value, document.getElementById('app'))
})

setTimeout(() => {
  // 两秒后更新虚拟
  vnode.value = {
    type: 'button',
    children: '新按钮',
    props: {
      id: 'new-foo',
    },
  }
}, 2000)
