import { getCurrentInstance } from '../../vue/index.js'

const KeepAlive = {
  __isKeepAlive: true, // 标识为KeepAlive组件对象
  setup(props, { slots }) {
    // 缓存组件的容器
    const cache = new Map()
    // 当前组件实例
    const instance = getCurrentInstance()
    // 移动方法，和创建一个临时缓存容器的方法
    const { move, createElement } = instance.keepAliveCtx
    const storageContainer = createElement('div')
    instance.activate = (vnode, container, anchor) => {
      move(vnode, container, anchor)
    }
    instance.deactivate = (vnode) => {
      move(vnode, storageContainer)
    }

    return () => {
      // 要缓存的组件的vnode
      const rawVNode = slots.default()
      // 如果不是一个组件直接返回渲染，只能是缓存组件
      if (typeof rawVNode.type !== 'object') {
        return rawVNode
      }
      // 获取缓存的组件
      const cachedVNode = cache.get(rawVNode.type)
      if (cachedVNode) {
        // 激活组件
        rawVNode.component = cachedVNode.component
        rawVNode.keptAlive = true
      }
      else {
        // 加入缓存
        cache.set(rawVNode.type, rawVNode)
      }

      rawVNode.shouldKeepAlive = true // 加上一个标记避免被真的卸载
      rawVNode.keepAliveInstance = instance // 添加组件实例，方便在渲染器中使用

      return rawVNode
    }
  },
}

export default KeepAlive
