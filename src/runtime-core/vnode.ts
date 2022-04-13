export function createVNode(type, props?, children?) {
  // 创建 并且 返回一个虚拟dom
  // 说人话：
  const vnode = {
    type,
    props,
    children,
    el: null
  };
  // console.log(vnode);
  // console.log(type.render);
  // console.log(props);
  // console.log(children);
  return vnode;
}
