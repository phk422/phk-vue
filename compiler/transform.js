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
      transformElement,
      transformText,
      transformA,
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

// 将tag为p的node转换为h2
function transformElement(node) {
  if (node.type === 'Element' && node.tag === 'p') {
    node.tag = 'h2'
  }
}

// 重复Text类型的文本内容
function transformText(node, context) {
  if (node.type === 'Text') {
    // 将Text转化为元素Element
    context.replaceNode({
      type: 'Element',
      tag: 'span',
    })
    // node.content = node.content.repeat(2)
  }
}

function transformA() {
  console.log('transformA 进入了')
  return () => {
    console.log('transformA 退出了')
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
