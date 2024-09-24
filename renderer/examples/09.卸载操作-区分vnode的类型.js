import { effect, shallowRef } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

const vnode = shallowRef({
  type: 'button',
  children: '按钮',
})

effect(() => {
  render(vnode.value, document.getElementById('app'))
})

setTimeout(() => {
  // 两秒后更新虚拟dom p标签
  vnode.value = {
    type: 'p',
    children: '这是新节点p，且类型不再是button了',
  }
}, 2000)
