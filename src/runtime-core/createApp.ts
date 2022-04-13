import { render } from "./renderer";
import { createVNode } from "./vnode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const vnode = createVNode(rootComponent);
      // console.log(vnode,rootContainer);
      /**
       * 把 虚拟dom 利用 render 函数渲染到 容器中
       * 说人话就是 利用 js 把 dom 渲染到 div 中
       */
      render(vnode, rootContainer);
    },
  };
}
