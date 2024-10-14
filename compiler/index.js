import { parse } from './parser.js'
import { dump, transform } from './transform.js'

const ast = parse('<div><p>Hello</p><p>Vue</p></div>')

// log
dump(ast)

console.log('-------------------')

transform(ast)

dump(ast)
