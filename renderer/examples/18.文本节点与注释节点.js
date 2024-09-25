import { effect, shallowRef } from '../../reactivity/index.js'
import { Comment, createRenderer, Text } from '../index.js'

const { render } = createRenderer()

const initProps = {
  type: 'button',
  children: [
    { type: Text, children: '按钮->这是一个文本节点' },
    { type: Comment, children: '这是一段注释' },
  ],
  props: {
    id: 'foo',
    class: 'bar',
    onClick() {
      console.log('update-props')
      vnode.value = {
        type: 'button',
        children: '恢复',
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
