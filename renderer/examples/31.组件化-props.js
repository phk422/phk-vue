import { effect, ref } from '../../reactivity/index.js'
import { createRenderer } from '../index.js'

const { render } = createRenderer()
const MyComponent = {
  name: 'MyComponent',
  props: {
    date: 'This is a date',
  },
  data() {
    return {
      foo: 1,
    }
  },
  render() {
    return {
      type: 'h2',
      children: `${this.date} --- ${this.foo}`,
    }
  },
}

const date = ref(new Date().toISOString())
// 模拟修改
setInterval(() => {
  date.value = new Date().toISOString()
}, 1000)
effect(() => {
  render({ type: MyComponent, props: { class: 'foo', date: date.value } }, document.getElementById('app'))
})
