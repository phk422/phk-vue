import { enableTracking, pauseTracking } from './effect.js'

export const arrayInstrumentations = {
  includes(...args) {
    return searchProxy(this, 'includes', args)
  },
  indexOf(...args) {
    return searchProxy(this, 'indexOf', args)
  },
  lastIndexOf(...args) {
    return searchProxy(this, 'lastIndexOf', args)
  },

  push(...args) {
    return noTracking(this, 'push', args)
  },
  pop() {
    return noTracking(this, 'pop')
  },
  shift() {
    return noTracking(this, 'shift')
  },
  unshift(...args) {
    return noTracking(this, 'unshift', args)
  },
  splice(...args) {
    return noTracking(this, 'splice', args)
  },
}

function searchProxy(self, method, args) {
  const originIncludesMethod = Array.prototype[method]
  // this为代理对象, 先在代理对象上寻找
  let res = originIncludesMethod.apply(self, args)
  if (res === false || res === -1) {
    // 没找到再在原始对象上寻找
    res = originIncludesMethod.apply(self.raw, args)
  }
  return res
}

function noTracking(self, method, args) {
  pauseTracking()
  const originMethod = Array.prototype[method]
  const res = originMethod.apply(self, args)
  enableTracking()
  return res
}
