export function createVNode(type, props = null, children = null) {
  if (typeof type === 'object' && type.type)
    return type
  return {
    type,
    props,
    children: typeof children === 'number' ? String(children) : children,
  }
}

export function h(type, propsOrChildren, children) {
  const l = arguments.length
  if (l === 2) {
    if (!Array.isArray(propsOrChildren) && typeof propsOrChildren === 'object') {
      return createVNode(type, propsOrChildren)
    }
    else {
      return createVNode(type, null, propsOrChildren)
    }
  }
  else if (l === 3) {
    return createVNode(type, propsOrChildren, children)
  }
  return createVNode(type, propsOrChildren, children)
}
