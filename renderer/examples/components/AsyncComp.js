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
