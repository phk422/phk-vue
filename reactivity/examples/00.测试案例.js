import { effect, reactive } from '../index.js'

const setProxy = reactive(new Set([0]))

effect(() => {
  // console.log(setProxy.size)
  // for of
  // for (const value of setProxy) {
  //   console.log(value)
  // }

  // entries
  // for (const [index, value] of setProxy.entries()) {
  //   console.log(index, value)
  // }

  // values
  // for (const v of setProxy.values()) {
  //   console.log(v)
  // }
  // keys
  for (const i of setProxy.keys()) {
    console.log(i)
  }
})

setProxy.add(1)
