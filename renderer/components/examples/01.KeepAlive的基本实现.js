import { createRenderer, effect, onMounted, onUnmounted, ref } from '../../../vue/index.js'
import KeepAlive from '../KeepAlive.js'

const { render } = createRenderer()

const Cpn1 = {
  name: 'Cpn1',
  setup() {
    onMounted(() => {
      console.log('Cpn1 onMounted')
    })

    onUnmounted(() => {
      console.log('Cpn1 onUnmounted') // 不会执行
    })
    return () => ({
      type: 'h1',
      children: '我是Cpn1',
    })
  },
}

const Cpn2 = {
  name: 'Cpn2',
  setup() {
    onMounted(() => {
      console.log('Cpn2 onMounted')
    })
    return () => ({
      type: 'h1',
      children: '我是Cpn2',
    })
  },
}

const toggle = ref(true)

setInterval(() => {
  toggle.value = !toggle.value
}, 2000)

effect(() => {
  render({
    type: KeepAlive,
    children: {
      default() {
        return toggle.value ? { type: Cpn1 } : { type: Cpn2 }
      },
    },
  }, document.getElementById('app'))
})
