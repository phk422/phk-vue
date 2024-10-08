export default {
  name: 'ErrorComponent',
  props: {
    error: '',
  },
  setup(props) {
    return () => {
      return {
        type: 'h2',
        props: {
          style: 'color:red;',
        },
        children: `组件加载错误或超时：${props.error}`,
      }
    }
  },
}
