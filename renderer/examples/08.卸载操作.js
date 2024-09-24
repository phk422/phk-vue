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
  // 两秒后更新虚拟dom为null，模拟卸载
  vnode.value = null
}, 2000)
