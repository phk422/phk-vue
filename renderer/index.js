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
}

export function createRenderer(options = rendererOptions) {
  const { createElement, setElementText, insert } = options
  function mountElement(vnode, container) {
    const el = createElement(vnode.type)
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
        // el.setAttribute(key, vnode.props[key])
        el[key] = vnode.props[key]
      }
    }
    insert(el, container)
  }

  function patch(n1, n2, container) {
    if (!n1) {
      // 挂载
      mountElement(n2, container)
    }
    else {
      console.log('打补丁-> TODO')
      // 暂时直接执行
    }
  }

  function render(vnode, container) {
    if (vnode) {
      patch(container._vnode, vnode, container)
    }
    else {
      if (container._vnode) {
        container.innerHTML = ''
      }
    }
    container._vnode = vnode
  }
  return { render }
}
