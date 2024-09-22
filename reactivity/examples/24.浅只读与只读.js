import { effect, shallowReadonly } from '../index.js'

// const obj = reactive({ foo: { bar: 1 }, count: 0 })
// const obj = readonly({ foo: { bar: 1 }, count: 0 })
const obj = shallowReadonly({ foo: { bar: 1 }, count: 0 })

effect(() => {
  console.log(obj.count, obj.foo.bar)
})

obj.count++
obj.foo.bar++
