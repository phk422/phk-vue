import { effect } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

effect(() => {
  render({
    type: 'button',
    props: {
      id: 'foo',
      disabled: '', // 应该禁用
    },
    children: '按钮',
  }, document.getElementById('app'))
})
