import { effect } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()
const MyComponent = {
  name: 'MyComponent',

  setup(props, { emit }) {
    return function () {
      return {
        type: 'button',
        props: {
          onClick: (e) => {
            console.log('click', e)
            // 发出事件
            emit('click', e)
          },
        },
        children: `这是一个按钮`,
      }
    }
  },
}

function onClick(e) {
  console.log('myComponent onClick', e)
}

effect(() => {
  render({ type: MyComponent, props: { onClick } }, document.getElementById('app'))
})
