import { effect, ref } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const count = ref(0)

const { render } = createRenderer()
effect(() => {
  render({
    type: 'h2',
    children: `${count.value}`,
  }, document.getElementById('app'))
})
