import { effect, queueJob, reactive, shallowReactive, shallowReadonly } from '../reactivity/index.js'
import { hasPropsChanged, normalizeClass, resolveProps } from './utils.js'
import { createVNode } from './vnode.js'

export * from './apiAsyncComponent.js'

export * from './vnode.js'

// 片段
export const Fragment = Symbol()
// 文本节点
export const Text = Symbol()
// 注释节点
export const Comment = Symbol()

function shouldSetAsProps(el, key) {
  // 只读的属性处理 需要使用setAttribute设置
  if (key === 'form' && el.tagName === 'INPUT')
    return false
  return key in el
}

// 生命周期相关
let currentInstance = null
function setCurrentInstance(instance) {
  currentInstance = instance
}
export function getCurrentInstance() {
  return currentInstance
}
export function onMounted(fn) {
  if (currentInstance) {
    currentInstance.mounted.push(fn)
  }
  else {
    console.error('onMounted' + '只能在setup中调用')
  }
}
export function onUnmounted(fn) {
  if (currentInstance) {
    currentInstance.unmounted.push(fn)
  }
  else {
    console.error('onUnmounted' + '只能在setup中调用')
  }
}

export const rendererOptions = {
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore
  // 如果给定的节点已经存在于文档中，insertBefore() 会将其从当前位置移动到新位置。
  insert: (child, parent, anchor = null) => {
    parent.insertBefore(child, anchor)
  },
  createComment(data) {
    return document.createComment(data)
  },
  createText(data) {
    return document.createTextNode(data)
  },
  setText(el, text) {
    el.nodeValue = text
  },
  patchProps(el, key, prevValue, nextValue) {
    // 更高效的处理事件的更改与移除
    if (key.startsWith('on')) {
      const name = key.slice(2).toLowerCase()
      const invoker = el._vei || (el._vei = {})
      let existingInvoker = invoker[name]
      if (nextValue) {
        // patch
        if (existingInvoker) {
          existingInvoker.value = nextValue
        }
        else {
          // add
          existingInvoker = (e) => {
            if (Array.isArray(existingInvoker.value)) {
              existingInvoker.value.forEach(fn => fn(e))
            }
            else {
              existingInvoker.value(e)
            }
          }
          existingInvoker.value = nextValue
          invoker[name] = existingInvoker
          el.addEventListener(name, existingInvoker)
        }
      }
      else if (existingInvoker) {
        // remove
        el.removeEventListener(name, existingInvoker)
      }
    }
    else if (key === 'class') {
      el.className = normalizeClass(nextValue)
    }
    else if (shouldSetAsProps(el, key)) {
      // 获取该 DOM Properties 的类型
      const type = typeof el[key]
      if (type === 'boolean' && nextValue === '') {
        el[key] = true
      }
      else {
        el[key] = nextValue
      }
    }
    else {
      // 如果要设置的属性没有对应的 DOM Properties，则使用 setAttribute 函数设置属性
      el.setAttribute(key, nextValue)
    }
  },
  querySelector(selector) {
    return document.querySelector(selector)
  },
}

export function createRenderer(options = rendererOptions) {
  const { createElement, setElementText, insert, createText, createComment, setText, querySelector, patchProps } = options

  // 挂载操作
  function mountElement(vnode, container, anchor) {
    // 将真实的dom保存到vnode上
    const el = vnode.el = createElement(vnode.type)
    // 处理子节点
    if (typeof vnode.children === 'string') {
      setElementText(el, vnode.children)
    }
    else if (Array.isArray(vnode.children)) {
      // 遍历子节点并挂载子节点
      vnode.children.forEach((child) => {
        patch(null, child, el)
      })
    }

    // 设置属性
    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key])
      }
    }
    // 挂载前
    const needTransition = vnode.transition
    if (needTransition) {
      needTransition.beforeEnter(el)
    }
    insert(el, container, anchor)
    // 挂载后
    if (needTransition) {
      needTransition.enter(el)
    }
  }

  // 卸载操作
  function unmount(vnode) {
    // 如果卸载的是片段，需遍历子节点依次卸载
    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c))
      return
    }
    // 卸载组件
    if (typeof vnode.type === 'object') {
      // 是KeepAlive, 不做真的卸载
      if (vnode.shouldKeepAlive) {
        vnode.keepAliveInstance.deactivate(vnode)
      }
      else {
        unmount(vnode.component.subTree)
        vnode.component.unmounted.forEach(hook => hook())
      }
      return
    }
    const el = vnode.el
    const parent = el.parentNode
    if (parent) {
      const performRemove = () => parent.removeChild(el)
      // 动画支持
      const needTransition = vnode.transition
      if (needTransition) {
        needTransition.leave(el, performRemove)
      }
      else {
        performRemove()
      }
    }
  }

  // eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars
  function patchUnkeyedChildren(n1, n2, container) {
    const oldChildren = n1.children
    const newChildren = n2.children
    const oldLen = oldChildren.length
    const newLen = newChildren.length
    // 获取最小的长度
    const commonLen = Math.min(oldLen, newLen)
    // 逐个patch
    for (let i = 0; i < commonLen; i++) {
      patch(oldChildren[i], newChildren[i], container)
    }
    if (newLen > oldLen) {
      // 新节点多，挂载
      for (let i = commonLen; i < newLen; i++) {
        patch(null, newChildren[i], container)
      }
    }
    else {
      // 旧节点多，卸载
      for (let i = commonLen; i < oldLen; i++) {
        unmount(oldChildren[i])
      }
    }
  }

  function patchKeyedChildren(n1, n2, container) {
    const oldChildren = n1.children
    const newChildren = n2.children
    // 移动，添加操作
    let lastIndex = 0
    for (let i = 0; i < newChildren.length; i++) {
      let find = false
      for (let j = 0; j < oldChildren.length; j++) {
        // 即便是key一样也需要打补丁，因为子节点可能会改变
        if (newChildren[i].key === oldChildren[j].key && newChildren[i].type === oldChildren[j].type) {
          find = true
          patch(oldChildren[j], newChildren[i], container)
          if (lastIndex > j) {
            // 需要移动节点
            // 获取当前新节点的上一个节点
            const prevVNode = newChildren[i - 1]
            // 如果有上一个节点才需要移动
            if (prevVNode) {
              // 获取上一个节点的下一个兄弟节点作为锚点
              const anchor = prevVNode.el.nextSibling
              // 插入到prevVNode元素的后面,也就是锚点的前面
              insert(newChildren[i].el, container, anchor)
            }
          }
          else {
            lastIndex = j
          }
          break
        }
      }
      // 如果没有找到复用的节点说明需要新增
      if (!find) {
        // 获取当前新节点的上一个节点
        const prevVNode = newChildren[i - 1]
        let anchor = null
        if (prevVNode) {
          anchor = prevVNode.el.nextSibling
        }
        else {
          // 说明是第一个节点,将锚点放在第一个
          anchor = container.firstChild
        }
        patch(null, newChildren[i], container, anchor)
      }
    }

    // 移除操作
    for (let i = 0; i < oldChildren.length; i++) {
      const oldVNode = oldChildren[i]
      const has = newChildren.find(c => c.key === oldVNode.key && c.type === oldVNode.type)
      if (!has) {
        // 新节点中没有就移除
        unmount(oldVNode)
      }
    }
  }

  function patchChildren(n1, n2, container) {
    // 判断新子节点的类型
    // 1.新子节点是字符串
    if (typeof n2.children === 'string') {
      // 如果旧子节点是数组需要执行卸载操作
      if (Array.isArray(n1.children)) {
        n1.children.forEach(child => unmount(child))
      }
      setElementText(container, n2.children)
    }
    else if (Array.isArray(n2.children)) {
      // 2. 新子节点是数组
      // 判断旧子节点是否是数组
      if (Array.isArray(n1.children)) {
        // 在源码层面vue通过模版编译是去区分有key还是无key->PatchFlag
        // unkeyed
        // patchUnkeyedChildren(n1, n2, container)
        // 有key的情况
        patchKeyedChildren(n1, n2, container)
      }
      else {
        // 旧子节点可能是文本，或者不存在
        // 清空容器
        setElementText(container, '')
        // 挂载新节点
        n2.children.forEach(child => patch(null, child, container))
      }
    }
    else {
      // 没有新字节点的情况
      if (typeof n1.children === 'string') {
        // 旧子节点是文本直接清空
        setElementText(container, '')
      }
      else if (Array.isArray(n1.children)) {
        // 旧子节点是数组挨个卸载
        n1.children.forEach(child => unmount(child))
      }
    }
  }

  function patchElement(n1, n2) {
    const el = n2.el = n1.el
    const oldProps = n1.props
    const newProps = n2.props
    // 修改现有的属性
    for (const key in newProps) {
      if (newProps[key] !== oldProps[key]) {
        patchProps(el, key, oldProps[key], newProps[key])
      }
    }
    // 移除没有的属性
    for (const key in oldProps) {
      if (!(key in newProps)) {
        patchProps(el, key, oldProps[key], null)
      }
    }
    // 更新子节点
    patchChildren(n1, n2, el)
  }

  function patch(n1, n2, container, anchor = null) {
    // 如果n1存在，对比n1与n2的类型
    if (n1 && n1.type !== n2?.type) {
      // 直接卸载n1
      unmount(n1)
      n1 = null
    }

    if (!n2)
      return

    const { type } = n2
    if (typeof type === 'string') {
      if (!n1) {
        // 挂载
        mountElement(n2, container, anchor)
      }
      else {
        patchElement(n1, n2)
      }
    }
    else if (type === Text) {
      // 文本节点
      processText(n1, n2, container)
    }
    else if (type === Comment) {
      processCommentNode(n1, n2, container)
    }
    else if (type === Fragment) {
      if (!n1) {
        // 旧节点不存在直接挂载新子节点
        n2.children.forEach(c => patch(null, c, container))
      }
      else {
        // 旧节点存在，修改旧子节点
        patchChildren(n1, n2, container)
      }
    }
    else if (typeof type === 'object' || typeof type === 'function') {
      processComponent(n1, n2, container, anchor)
    }
    else {
      console.log('处理其他类型')
    }
  }

  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container)
    }
    else {
      if (container._vnode) {
        unmount(container._vnode)
      }
    }
    container._vnode = vnode
  }

  // 处理文本节点
  function processText(n1, n2, container) {
    if (!n1) {
      const el = n2.el = createText(n2.children)
      insert(el, container)
    }
    else {
      const el = n2.el = n1.el
      setText(el, n2.children)
    }
  }
  // 处理注释节点
  function processCommentNode(n1, n2, container) {
    if (!n1) {
      const el = n2.el = createComment(n2.children)
      insert(el, container)
    }
    else {
      // vue源码中实际上不支持动态的注释，因为这个没什么意义
      n2.el = n1.el
      // setText(n2.el = n1.el, n2.children)
    }
  }
  // 处理组件节点
  function processComponent(n1, n2, container, anchor) {
    // 判断是否是Teleport组件
    if (n2.type.__isTeleport) {
      // 将控制权交给Teleport组件，代码与渲染器解耦，也更利于treeShake
      n2.type.process(n1, n2, container, anchor, {
        // 这里传递一些要用的方法
        patch,
        patchChildren,
        querySelector,
        move(vnode, container, anchor) {
          // 是组件移动组件，元素移动元素
          insert(vnode.component ? vnode.component.subTree.el : vnode.el, container, anchor)
        },
      })
      return
    }
    if (!n1) {
      if (n2.keptAlive) {
        // 激活组件
        n2.keepAliveInstance.activate(n2, container, anchor)
      }
      else {
        mountComponent(n2, container, anchor)
      }
    }
    else {
      // 更新组件
      patchComponent(n1, n2, container)
    }
  }

  function patchComponent(n1, n2) {
    const instance = n2.component = n1.component
    const { props } = instance
    if (hasPropsChanged(n1.props, n2.props)) {
      // 获取新的props
      const [nextProps] = resolveProps(n2.type.props, n2.props)
      // 更新props
      for (const key in nextProps) {
        props[key] = nextProps[key]
      }
      // 删除不存在的key
      for (const key in props) {
        if (!(key in nextProps))
          delete props[key]
      }
    }
  }

  function mountComponent(vnode, container, anchor) {
    let componentOptions = vnode.type
    const isFunctional = typeof vnode.type === 'function'
    // 判断是否是函数式组件
    if (isFunctional) {
      componentOptions = {
        render: vnode.type,
        props: vnode.type.props,
      }
    }

    // 直接将组件的children复制给slots
    const slots = vnode.children || {}

    let { render, props: propsData = {}, data, setup, beforeCreate, created, beforeMount, mounted, beforeUpdate, updated } = componentOptions
    const [props, attrs] = resolveProps(propsData, vnode.props)

    beforeCreate && beforeCreate()

    // 包装为响应式数据
    const state = data ? reactive(data()) : null

    // 定义组件实例
    const instance = {
      // 组件的状态
      state,
      // 组件的props
      props: shallowReactive(props),
      // 组件是否被挂载
      isMounted: false,
      // 组件所渲染的内容
      subTree: null,
      // 组件的插槽
      slots,
      // 用来保存onMounted注册的hooks
      mounted: [],
      unmounted: [],

      keepAliveCtx: null,
    }

    // 是否是KeepAlive组件
    if (vnode.type.__isKeepAlive) {
      instance.keepAliveCtx = {
        move(vnode, container, anchor) {
          insert(vnode.component.subTree.el, container, anchor)
        },
        createElement,
      }
    }

    function emit(event, ...payload) {
      // 从props中获取事件函数
      const eventName = `on${event[0].toUpperCase() + event.slice(1)}`
      const handler = instance.props[eventName]
      if (handler) {
        handler(...payload)
      }
      else {
        console.error(`${eventName}事件不存在`)
      }
    }

    const setupContext = { attrs, emit, slots }
    // 在执行setup之前设置当前的组件实例
    setCurrentInstance(instance)
    const setupResult = setup && setup(shallowReadonly(props), setupContext)
    // 执行完成后重置当前组件实例
    setCurrentInstance(null)
    let setupState = null
    if (typeof setupResult === 'function') {
      if (render)
        console.warn('setup 函数返回渲染函数，render 选项将被忽略')

      render = setupResult
    }
    else {
      setupState = setupResult
    }

    vnode.component = instance

    // 渲染上下文对象，组件实例的代理对象，即使用的this对象
    const renderContext = new Proxy(instance, {
      get(target, key) {
        const { props, state, slots } = target
        // 插槽处理
        if (key === '$slots')
          return slots
        // 读取state
        if (state && key in state) {
          return state[key]
        }
        // 读取props
        else if (key in props) {
          return props[key]
        }
        // 将setup函数的返回值绑定到渲染对象上
        else if (setupState && key in setupState) {
          return setupState[key]
        }
        else {
          console.warn('不存在')
        }
      },
      set(target, key, newValue) {
        const { props, state } = target
        if (key in state) {
          state[key] = newValue
        }
        else if (key in props) {
          console.warn(`Attempting to mutate prop "${key}". Props 
            are readonly.`)
        }
        else {
          console.warn('不存在')
        }
      },
    })

    created && created.call(renderContext)
    // 绑定this为state，并将state作为参数传递给render
    effect(() => {
      const subTree = render.call(renderContext, isFunctional ? shallowReadonly(props) : state)
      if (!instance.isMounted) {
        beforeMount && beforeMount.call(renderContext)
        // 组件的挂载
        patch(null, subTree, container, anchor)
        instance.isMounted = true
        mounted && mounted.call(renderContext)
        instance.mounted.forEach(hook => hook.call(renderContext))
      }
      else {
        beforeUpdate && beforeUpdate.call(renderContext)
        // 组件的更新
        patch(instance.subTree, subTree, container, anchor)
        updated && updated.call(renderContext)
      }
      instance.subTree = subTree
    }, {
      scheduler: queueJob,
    })
  }

  function createApp(rootComponent) {
    const app = {
      _component: rootComponent,
      mount(rootContainer) {
        const vnode = createVNode(rootComponent)
        render(vnode, rootContainer)
      },
    }
    return app
  }
  return { render, createApp }
}
