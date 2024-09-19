const originIncludesMethod = Array.prototype.includes

export const arrayInstrumentations = {
  includes(...args) {
    // this为代理对象, 先在代理对象上寻找
    let res = originIncludesMethod.apply(this, args)
    if (res === false) {
      // 没找到再在原始对象上寻找
      res = originIncludesMethod.apply(this.raw, args)
    }
    return res
  },
}
