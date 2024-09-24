import { effect, shallowRef } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

const initProps = {
  type: 'button',
  children: '按钮',
  // children: [{  type: 'span', children: '按钮->这是一个span' }],
  props: {
    id: 'foo',
    class: 'bar',
    onClick() {
      console.log('update-props')
      vnode.value = {
        type: 'button',
        // children: '新按钮-点击切换旧按钮',
        children: [{ type: 'span', children: '按钮->这是一个span' }],
        props: {
          id: 'new-foo',
          onClick() {
            vnode.value = { ...initProps }
          },
        },
      }
    },
  },
}

const vnode = shallowRef(initProps)

effect(() => {
  render(vnode.value, document.getElementById('app'))
})
