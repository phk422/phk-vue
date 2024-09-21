export const hasOwn = (target, key) => Object.prototype.hasOwnProperty.call(target, key)

export const hasChanged = (value, oldValue) => !Object.is(value, oldValue)

export const isObject = value => value !== null && typeof value === 'object'
