const Transition = {
  name: 'Transition',
  props: {
    name: String,
  },
  setup(props, { slots }) {
    return () => {
      const innerVNode = slots.default()
      if (!innerVNode)
        return null
      // 为当前vnode注册动画相关的事件
      innerVNode.transition = {
        beforeEnter(el) {
          // 设置初始状态
          el.classList.add('enter-from')
          el.classList.add('enter-active')
        },
        enter(el) {
          nextFrame(() => {
            el.classList.remove('enter-from')
            el.classList.add('enter-to')
            // 监听动画结束移除相关属性
            el.addEventListener('transitionend', () => {
              el.classList.remove('enter-to')
              el.classList.remove('enter-active')
            })
          })
        },
        leave(el, performRemove) {
          // 设置初始状态
          el.classList.add('leave-from')
          el.classList.add('leave-active')
          // reflow 使初始状态生效
          // eslint-disable-next-line no-unused-expressions
          document.body.offsetHeight
          // 下一帧切换状态
          nextFrame(() => {
            el.classList.remove('leave-from')
            el.classList.add('leave-to')
            el.addEventListener('transitionend', () => {
              el.classList.remove('leave-to')
              el.classList.remove('leave-active')
              // 卸载
              performRemove()
            })
          })
        },
      }
      return innerVNode
    }
  },
}

function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb)
  })
}

export default Transition
