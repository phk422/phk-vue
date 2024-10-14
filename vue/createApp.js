import { createRenderer } from './index.js'

const renderer = createRenderer()
export function createApp(...args) {
  const app = renderer.createApp(...args)

  const { mount } = app
  app.mount = (containerOrSelector) => {
    const container = document.querySelector(containerOrSelector)
    const component = app._component
    if (!component.render && !component.template) {
      component.template = container.innerHTML
    }

    mount(container)
  }
  return app
}
