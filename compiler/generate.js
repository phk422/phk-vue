export function generate(node) {
  const context = {
    currentIndent: 0, // 当前缩进
    code: '', // 存储生成的代码
    push(code) { // 用以拼接代码的方法
      context.code += code
    },
    newLine() {
      context.code += `\n${'  '.repeat(this.currentIndent)}`
    },
    // 缩进
    indent() {
      context.currentIndent++
      context.newLine()
    },
    // 取消缩进
    deIndent() {
      context.currentIndent--
      context.newLine()
    },
  }

  genNode(node, context)
  return context.code
}

function genNode(node, context) {
  switch (node.type) {
    case 'FunctionDecl':
      genFunctionDecl(node, context)
      break
    case 'ArrayExpression':
      genArrayExpression(node, context)
      break
    case 'ReturnStatement':
      genReturnStatement(node, context)
      break
    case 'StringLiteral':
      genStringLiteral(node, context)
      break
    case 'CallExpression':
      genCallExpression(node, context)
      break
  }
}

// 生成函数
function genFunctionDecl(node, context) {
  const { push, indent, deIndent } = context
  push(`function ${node.id.name}`)
  push('(')
  // 生成函数参数
  genNodeList(node, context)
  push(')')
  push('{')
  // 缩进
  indent()
  // 生成函数体的代码
  node.body.forEach(n => genNode(n, context))
  deIndent()
  push('}')
}

// 生成-> 1, 2, 3
function genNodeList(nodes, context) {
  const { push } = context
  for (let i = 0; i < nodes.length; i++) {
    genNode(nodes[i], context)
    if (i < nodes.length - 1) {
      push(', ')
    }
  }
}

// 生成数组 [1, 2 , 3]
function genArrayExpression(node, context) {
  const { push } = context
  push('[')
  genNodeList(node.elements, context)
  push(']')
}

// 生成return xxx
function genReturnStatement(node, context) {
  const { push } = context
  push('return ')
  genNode(node.return, context)
}

// 生成字符串字面量
function genStringLiteral(node, context) {
  const { push } = context
  push(`'${node.value}'`)
}

// 生成函数的调用
function genCallExpression(node, context) {
  const { push } = context

  push(`${node.callee.name}(`)
  // 生成调用参数代码
  genNodeList(node.arguments, context)
  push(')')
}
