const Teleport = {
  __isTeleport: true,

  props: {
    to: [String, Object],
  },
  process(n1, n2, container, anchor, internals) {
    // 处理渲染的逻辑
    const { patch, patchChildren, querySelector, move } = internals
    if (!n1) {
      // 挂载
      const target = typeof n2.props.to === 'string' ? querySelector(n2.props.to) : n2.props.to
      n2.target = target
      n2.children.forEach(c => patch(null, c, target, anchor))
    }
    else {
      // 更新, 源码中有更多的逻辑对于这target, 这里简单的对其实现
      const target = n2.target = n1.target
      patchChildren(n1, n2, target || container)

      // 如果to属性发生了改变，即target发生改变, 需要移动
      if (n1.props.to !== n2.props.to) {
        const target = n2.target = querySelector(n2.props.to)
        n2.children.forEach(c => move(c, target, anchor))
      }
    }
  },
}

export default Teleport
