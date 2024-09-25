import { normalizeClass } from './utils.js'

// 片段
export const Fragment = Symbol()

function shouldSetAsProps(el, key) {
  // 只读的属性处理 需要使用setAttribute设置
  if (key === 'form' && el.tagName === 'INPUT')
    return false
  return key in el
}

export const rendererOptions = {
  createElement(tag) {
    return document.createElement(tag)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  insert: (child, parent, anchor = null) => {
    parent.insertBefore(child, anchor)
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
}

export function createRenderer(options = rendererOptions) {
  const { createElement, setElementText, insert, patchProps } = options

  // 挂载操作
  function mountElement(vnode, container) {
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
    insert(el, container)
  }

  // 卸载操作
  function unmount(vnode) {
    // 如果卸载的是片段，需遍历子节点依次卸载
    if (vnode.type === Fragment) {
      vnode.children.forEach(c => unmount(c))
      return
    }
    const el = vnode.el
    const parent = el.parentNode
    if (parent)
      parent.removeChild(el)
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

  function patch(n1, n2, container) {
    // 如果n1存在，对比n1与n2的类型
    if (n1 && n1.type !== n2.type) {
      // 直接卸载n1
      unmount(n1)
      n1 = null
    }

    const { type } = n2
    if (typeof type === 'string') {
      if (!n1) {
        // 挂载
        mountElement(n2, container)
      }
      else {
        patchElement(n1, n2)
      }
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
    else if (typeof type === 'object') {
      console.log('处理组件类型')
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
  return { render }
}
