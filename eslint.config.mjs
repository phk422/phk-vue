// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: {
    html: true,
    css: true,
  },
  rules: {
    'no-console': 'off',
    'import/no-mutable-exports': 'off',
  },
})
