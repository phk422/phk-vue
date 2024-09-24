import { effect, ref } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

const flag = ref(false)
// TODO
effect(() => {
  render({
    type: 'div',
    props: flag.value
      ? {
          onClick: () => {
            console.log('parent clicked')
          },
        }
      : {},
    children: [
      {
        type: 'button',
        children: '子元素',
        props: {
          onClick: () => {
            console.log('btn clicked')
            flag.value = true
          },
        },
      },
    ],
  }, document.getElementById('app'))
})
