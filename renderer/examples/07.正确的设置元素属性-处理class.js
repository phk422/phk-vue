import { effect } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

// const className = 'foo bar'
// const className = { foo: true, bar: false }
const className = ['foo', 'bar', { baz: true }]

effect(() => {
  render({
    type: 'button',
    props: {
      class: className,
    },
    children: '按钮',
  }, document.getElementById('app'))
})
