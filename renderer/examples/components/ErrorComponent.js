export default {
  name: 'ErrorComponent',
  setup() {
    return () => {
      return {
        type: 'h2',
        props: {
          style: 'color:red;',
        },
        children: '组件加载错误或超时',
      }
    }
  },
}
