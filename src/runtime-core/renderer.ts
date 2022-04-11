import { createComponentInsrance, setupCpmponent } from "./component"

export function render(vnode, containter) {
  patch(vnode, containter)
}

function patch(vnode, containter) {
  // 去处理组件
  // 判断是不是element
  processComponents(vnode, containter)
}

function processComponents(vnode, containter) {
  mountComponent(vnode, containter)
}

function mountComponent(vnode, containter) {
  const instance = createComponentInsrance(vnode)

  setupCpmponent(instance)
  setupRenderEffect(instance, containter)
}
function setupRenderEffect(instance, containter) {
  const sbuTree = instance.render()
  
  patch(sbuTree, containter)
}

