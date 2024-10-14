import tokenize from './tokenize.js'

// template -> tokens -> ast
export function parse(str) {
  const tokens = tokenize(str)
  const root = {
    type: 'Root',
    children: [],
  }

  const elementStack = [root]
  while (tokens.length) {
    // 获取栈顶元素
    const parent = elementStack[elementStack.length - 1]
    const token = tokens[0]
    switch (token.type) {
      case 'tag':
      {
        const elementNode = {
          type: 'Element',
          tag: token.name,
          children: [],
        }
        parent.children.push(elementNode)
        elementStack.push(elementNode)
        break
      }
      case 'text':
      {
        const textNode = {
          type: 'Text',
          content: token.content,
        }
        parent.children.push(textNode)
        break
      }
      case 'tagEnd':
        elementStack.pop()
        break
    }
    tokens.shift()
  }

  return root
}
