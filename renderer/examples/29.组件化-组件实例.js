import { effect } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()
let flag = true
const MyComponent = {
  name: 'MyComponent',
  data() {
    return {
      foo: 1,
    }
  },
  render() {
    flag && setTimeout(() => {
      flag = false
      this.foo++
      this.foo++ // 应该触发一次renderer
    }, 1000)
    return {
      type: 'h2',
      children: `MyComponent: ${this.foo}`,
    }
  },
}

effect(() => {
  render({ type: MyComponent }, document.getElementById('app'))
})
