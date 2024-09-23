import { effect, ref } from '../../reactivity/index.js'

function renderer(domString, container) {
  container.innerHTML = domString
}

const count = ref(0)

effect(() => {
  renderer(`<h2>${count.value}</h2>`, document.getElementById('app'))
})

setInterval(() => {
  count.value++
}, 1000)
