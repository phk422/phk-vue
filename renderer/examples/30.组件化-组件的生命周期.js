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
  beforeCreate() {
    console.log('beforeCreate')
  },
  created() {
    console.log('created', this)
    // 模拟服务器获取数据并更新数据
    setTimeout(() => {
      this.foo++
    }, 1000)
  },
  beforeMount() {
    console.log('beforeMount', this)
  },
  mounted() {
    console.log('mounted', this)
  },
  beforeUpdate() {
    console.log('beforeUpdate', this)
  },
  updated() {
    console.log('updated', this)
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
