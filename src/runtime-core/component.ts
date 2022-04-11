export function createComponentInsrance(vnode) {
  const component = {
    vnode,
    type: vnode.type
  }
  return component
}
export function setupCpmponent(instance) {
  setupStatefulComponent(instance)
}
export function setupStatefulComponent(instance) {
  const Component = instance.type
  const setup = Component
  if (setup) {
    const setupResult = setup()
    
    handleSetupResult(instance, setupResult)
  }
}
export function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult
  }
  finishComponentSetup(instance)
}
export function finishComponentSetup(instance) {
  const Component = instance.type
  if (!Component.render) {
    instance.render = Component.render
  }
}