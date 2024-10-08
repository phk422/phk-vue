import { createRenderer } from '../../vue/index.js'

const { render } = createRenderer()

function MyFuncComponent(props) {
  return {
    type: 'h2',
    children: `我是一个函数式组件${props.title}`,
  }
}
MyFuncComponent.props = {
  title: String,
}

render({ type: MyFuncComponent, props: { title: 'Hello FunctionCpn' } }, document.getElementById('app'))
