import { effect } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

const MyComponent = {
  name: 'MyComponent',
  render() {
    return {
      type: 'h2',
      children: 'MyComponent',
    }
  },
}

effect(() => {
  render({ type: MyComponent }, document.getElementById('app'))
})
