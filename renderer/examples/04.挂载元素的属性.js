import { effect } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

effect(() => {
  render({
    type: 'ul',
    props: {
      id: 'foo',
    },
    children: [
      {
        type: 'li',
        children: 'Hello Renderer!',
      },
    ],
  }, document.getElementById('app'))
})
