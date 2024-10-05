import { effect } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()

const MyComponent = {
  name: 'MyComponent',
  data() {
    return {
      foo: 1,
    }
  },
  render() {
    return {
      type: 'h2',
      children: `MyComponent: ${this.foo}`,
    }
  },
}

effect(() => {
  render({ type: MyComponent }, document.getElementById('app'))
})
