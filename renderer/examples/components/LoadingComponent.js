export default {
  name: 'LoadingComponent',
  setup() {
    return () => {
      return {
        type: 'h3',
        children: '组件正在加载中...',
      }
    }
  },
}
