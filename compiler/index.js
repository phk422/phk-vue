import { generate } from './generate.js'
import { parse } from './parser.js'
import { transform } from './transform.js'

export function compiler(template) {
  // 将模板转换为模板ast
  const ast = parse(template)
  // 将模板ast转换为jsAst
  transform(ast)
  // 生成代码
  const code = generate(ast.jsNode)

  return code
}
