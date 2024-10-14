// 定义状态机的状态
const State = {
  initial: 1, // 初始状态
  tagOpen: 2, // 标签开始状态
  tagName: 3, // 标签名称
  text: 4, // 文本状态
  tagEnd: 5, // 结束标签状态
  tagEndName: 6, // 结束标签名称状态
}

// 判断是否是字母
function isAlpha(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'z')
}

// template -> tokens
export default function tokenize(str) {
  let currentState = State.initial
  const tokens = []
  const chars = []
  while (str) {
    const char = str[0]
    switch (currentState) {
      case State.initial:
        if (char === '<') {
          // 切换为标签开始状态
          currentState = State.tagOpen
          // 开始消费str
          str = str.slice(1)
        }
        else if (isAlpha(char)) {
          // 遇到字母切换为文本状态
          currentState = State.text
          // 缓存当前字符
          chars.push(char)
          str = str.slice(1)
        }
        break
      case State.tagOpen:
        // 要么遇到字母，要么遇到标签结束
        if (isAlpha(char)) {
          // 切换到标签名称状态
          currentState = State.tagName
          chars.push(char)
          str = str.slice(1)
        }
        else if (char === '/') {
          // 切换到标签结束状态
          currentState = State.tagEnd
          str = str.slice(1)
        }
        break
      case State.tagName:
        if (isAlpha(char)) {
          // 遇到字母还是标签名称，状态保持不变
          chars.push(char)
          str = str.slice(1)
        }
        else if (char === '>') {
          // 切换初始状态，标签名称已经读取完成
          currentState = State.initial
          tokens.push({
            type: 'tag',
            name: chars.join(''),
          })
          // 清空chars
          chars.length = 0
          str = str.slice(1)
        }
        break
      case State.text:
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        }
        else if (char === '<') {
          currentState = State.tagOpen
          // 存储文本内容
          tokens.push({
            type: 'text',
            content: chars.join(''),
          })
          chars.length = 0
          str = str.slice(1)
        }
        break
      case State.tagEnd:
        if (isAlpha(char)) {
          currentState = State.tagEndName
          chars.push(char)
          str = str.slice(1)
        }
        break
      case State.tagEndName: {
        if (isAlpha(char)) {
          chars.push(char)
          str = str.slice(1)
        }
        else if (char === '>') {
          currentState = State.initial
          tokens.push({
            type: 'tagEnd',
            name: chars.join(''),
          })
          chars.length = 0
          str = str.slice(1)
        }
      }
    }
  }

  return tokens
}
