import { effect } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()
const MyComponent = {
  name: 'MyComponent',
  props: {
    title: 'This is a title',
  },

  render() {
    return {
      type: 'h2',
      children: `${this.title} ${this.foo}`,
    }
  },

  setup() {
    return {
      foo: 'setup!',
    }
  },
}

effect(() => {
  render({ type: MyComponent, props: { class: 'foo', title: 'Hello' } }, document.getElementById('app'))
})
