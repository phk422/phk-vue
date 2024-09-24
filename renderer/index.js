import { normalizeClass } from './utils.js'

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
    if (key === 'class') {
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
    const el = vnode.el
    const parent = el.parentNode
    if (parent)
      parent.removeChild(el)
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
        console.log('TODO patchElement')
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
