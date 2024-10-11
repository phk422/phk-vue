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
            const onEnd = (e) => {
              if (e.target === el) {
                el.removeEventListener('transitionend', onEnd)
                el.classList.remove('enter-to')
                el.classList.remove('enter-active')
              }
            }
            // 监听动画结束移除相关属性
            el.addEventListener('transitionend', onEnd)
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
            const onEnd = (e) => {
              if (e.target === el) {
                el.removeEventListener('transitionend', onEnd)
                el.classList.remove('leave-to')
                el.classList.remove('leave-active')
                // 卸载
                performRemove()
              }
            }
            el.addEventListener('transitionend', onEnd) // 注意：可能会被调用多次，每个动画的执行，如位移+透明度，会调用两次;解决方案：在第一次调用后移除事件
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
