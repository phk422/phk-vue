import { effect, shallowRef } from '../../reactivity/index.js'
import { createRenderer, Fragment } from '../index.js'

const { render } = createRenderer()

const oldNode = [
  {
    type: Fragment,
    children: [
      { type: 'li', children: '1', key: '1' },
      { type: 'li', children: '2', key: '2' },
      { type: 'li', children: '3', key: '3' },
    ],
  },
]

const newNode = [
  {
    type: Fragment,
    children: [
      { type: 'li', children: '33', key: '3' },
      { type: 'li', children: '2', key: '2' },
      { type: 'li', children: '1', key: '1' },
    ],
  },
]

const children = shallowRef(oldNode)

effect(() => {
  render({
    type: 'ul',
    props: {
      onClick() {
        // updateChildren
        children.value = newNode
      },
    },
    children: children.value,
  }, document.getElementById('app'))
})
