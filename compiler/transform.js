// 用于打印ast
export function dump(ast, indent = 0) {
  const currentNode = ast
  if (currentNode.type === 'Root') {
    console.log('Root:')
  }
  else if (currentNode.type === 'Element') {
    console.log(`${'-'.repeat(indent)}Element:${currentNode.tag}`)
  }
  else {
    console.log(`${'-'.repeat(indent)}Text:${currentNode.content}`)
  }
  if (ast.children)
    ast.children.forEach(node => dump(node, indent + 2))
}

// ast -> jsAst
export function transform(ast) {
  // 定义一个转换上线文
  const context = {
    currentNode: null, // 当前正在转换的节点
    parent: null, // 当前正在转换的节点的父节点
    childIndex: null, // 当前正在转换的节点在父节点中的索引
    nodeTransforms: [ // 实现转换的解耦工作
      transformText,
      transformElement,
      transformRoot,
    ],
    // 替换当前节点
    replaceNode(newNode) {
      // 替换原来的节点
      context.parent.children[context.childIndex] = newNode
      // 重新设置当前节点
      context.currentNode = newNode
    },
    // 移除当前节点
    removeNode() {
      if (context.parent) {
        context.parent.children.splice(context.childIndex, 1)
        context.currentNode = null
      }
    },
  }
  traverseNode(ast, context)
  return ast
}

// 处理文本节点
function transformText(node) {
  if (node.type !== 'Text')
    return

  // 文本节点就是字符串的字面量
  node.jsNode = createStringLiteral(node.content)
}

// 将tag为p的node转换为h2
function transformElement(node) {
  // 将元素的处理放在退出阶段，保证它的子节点都被处理了
  return () => {
    if (node.type !== 'Element')
      return
    // 创建h函数的调用
    // h函数的 参数
    const args = [
      createStringLiteral(node.tag), // type类型
      // 如果节点有多个，需要创建数组表达式
      node.children.length === 1 ? node.children[0].jsNode : createArrayExpression(node.children.map(c => c.jsNode)),
    ]
    const callExp = createCallExpression('h', args)
    node.jsNode = callExp
  }
}

// 处理根节点
function transformRoot(node) {
  return () => {
    if (node.type !== 'Root')
      return

    // 目前只简单处理讨论只有一个根节点的情况
    const vnodeJsAst = node.children[0].jsNode

    node.jsNode = {
      type: 'FunctionDecl',
      id: createIdentifier('render'),
      params: [],
      body: [
        {
          type: 'ReturnStatement',
          return: vnodeJsAst,
        },
      ],
    }
  }
}

// 深度优先遍历
function traverseNode(ast, context) {
  context.currentNode = ast // 设置当前正在操作的节点
  const transforms = context.nodeTransforms
  // 退出时执行的函数
  const exitFns = []
  for (const transform of transforms) {
    const onExit = transform(context.currentNode, context)
    if (onExit) {
      exitFns.push(onExit)
    }
    // 如果当前节点被移除直接return
    if (!context.currentNode)
      return
  }
  const children = context.currentNode.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      // 设置当前正在转换节点的父节点
      context.parent = context.currentNode
      context.childIndex = i
      traverseNode(children[i], context)
    }
  }

  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

// 用于创建字符串字面量
function createStringLiteral(value) {
  return {
    type: 'StringLiteral',
    value,
  }
}

// 创建标识符
function createIdentifier(name) {
  return {
    type: 'Identifier',
    name,
  }
}

// 创建数组表达式
function createArrayExpression(elements) {
  return {
    type: 'ArrayExpression',
    elements,
  }
}

// 创建函数调用表达式
// callee: 被调用函数的名称,即一个标志符，arguments：调用函数的参数
function createCallExpression(callee, args) {
  return {
    type: 'CallExpression',
    callee: createIdentifier(callee),
    arguments: args,
  }
}
