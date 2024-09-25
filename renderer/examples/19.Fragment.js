import { effect } from '../../reactivity/index.js'
import { createRenderer, Fragment } from '../index.js'

const { render } = createRenderer()

effect(() => {
  render({
    type: 'ul',
    children: [
      {
        type: Fragment,
        children: [
          { type: 'li', children: '1' },
          { type: 'li', children: '2' },
          { type: 'li', children: '3' },
        ],
      },
    ],
  }, document.getElementById('app'))
})
