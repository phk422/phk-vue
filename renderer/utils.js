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
