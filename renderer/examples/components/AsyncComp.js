export function getComp() {
  return new Promise(resolve => [
    setTimeout(() => {
      resolve({
        name: 'AsyncComp',
        render() {
          return {
            type: 'h3',
            children: 'AsyncComp',
          }
        },
      })
    }, 2000),
  ])
}

export function getCompErr() {
  return new Promise((resolve, reject) => [
    setTimeout(() => {
      reject(new Error('组件加载失败'))
    }, 500),
  ])
}
