export function normalizeClass(value) {
  let res = ''
  if (typeof value === 'string') {
    res = `${value}`
  }
  else if (Array.isArray(value)) {
    for (const i of value) {
      res += `${normalizeClass(i)} `
    }
  }
  else if (typeof value === 'object' && value !== null) {
    for (const key in value) {
      if (value[key]) {
        res += `${key} `
      }
    }
  }
  return res.trim()
}

export function resolveProps(options, propsData) {
  const props = {}
  const attrs = {}
  for (const key in propsData) {
    // 存在于组件定义的才是props
    if (key in options) {
      props[key] = propsData[key]
    }
    else {
      attrs[key] = propsData[key]
    }
  }
  return [props, attrs]
}

export function hasPropsChanged(prevProps, nextProps) {
  const nextKeys = Object.keys(nextProps)
  // 比较新旧props keys是否有变化，有变化说明需要更新
  if (nextKeys.length !== Object.keys(prevProps).length)
    return true

  for (const key of nextKeys) {
    if (prevProps[key] !== nextProps[key])
      return true
  }

  return false
}
