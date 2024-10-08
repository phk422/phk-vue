import { effect } from '../../reactivity/index.js'
import { createRenderer, onMounted } from '../index.js'

const { render } = createRenderer()
const MyComponent = {
  name: 'MyComponent',

  setup() {
    onMounted(() => {
      console.log('onMounted', document.querySelector('h2'))
    })
    return function () {
      return {
        type: 'h2',
        children: '我是一个组件',
      }
    }
  },
}

effect(() => {
  render({ type: MyComponent }, document.getElementById('app'))
})
