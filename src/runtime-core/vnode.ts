import { ShapeFlags } from "../shared/ShapeFlags";

export const Fragment = Symbol("Fragment")
export const Text = Symbol("Text")
export function createVNode(type, props?, children?) {
  // 创建 并且 返回一个虚拟dom
  // 说人话：
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null,
  };

  // children 
  if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }
  // console.log(vnode);
  // console.log(type.render);
  // console.log(props);
  // console.log(children);
  return vnode;
}

function getShapeFlag(type) {
  return typeof type === "string"
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}
export function createTextVnode(text: string) {
  return createVNode(Text, {}, text)
}