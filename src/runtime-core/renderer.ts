import { createComponentInstance, setupComponent } from "./component";
import { ShapeFlags } from "../shared/ShapeFlags";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
  // console.log(vnode, container);
  /**
   * 参数传到 patch函数 中处理
   * 说人话： 多嵌套一层 function 不知道有啥用？ 可能显得高级一些...
   */
  patch(vnode, container);
}

function patch(vnode, container) {
  // console.log(vnode);
  // TODO 判断vnode 是不是一个 element
  // 是 element 那么就应该处理 element
  // if Element ,so shoule to handle Element
  // 思考题： 如何去区分是 element 还是 component 类型呢？
  // Thinking  problem : how to distinguish between Element and component types

  // 因为最外面一层得容器用来渲染根节点，
  // because the Outermost  container is used to render root node
  // string 类型是子节点
  // type string is n son node
  // console.log(vnode);
  const { type, shapeFlag } = vnode
  // console.log(type, shapeFlag);

  // Fragment -> 只渲染children
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // handle Element container
        // 处理 Elememt容器
        processElement(vnode, container)
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        // handle component
        // 处理组件 
        processComponent(vnode, container)
      }
  }

  // processElement();
}

function processText(vnode: any, container: any) {
  const { children } = vnode
  const textNode = (vnode.el = document.createTextNode(children))
  container.append(textNode)
}

function processFragment(vnode: any, container: any) {
  // Implement
  mountChildren(vnode, container)
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  // const el = document.createElement(vnode.type)
  const el = (vnode.el = document.createElement(vnode.type))
  // console.log(el);
  // console.log(vnode.el);

  const { children, shapeFlag } = vnode

  // children
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }

  // props
  const { props } = vnode

  for (const key in props) {
    const val = props[key]
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      // const EventTag = key.substring(0, 2)
      // if (EventTag === "on") {
      const EventName = key.substring(2).toLowerCase()
      el.addEventListener(EventName, val)
      // console.log(EventTag, EventName);
    } else {
      el.setAttribute(key, val)
    }
  }
  container.append(el)
}
function mountChildren(vnode, container) {
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}

function processComponent(vnode: any, container: any) {
  // console.log(vnode, container);
  // 渲染组件
  // render component
  mountComponent(vnode, container);
}

function mountComponent(initialVNode: any, container) {
  // console.log(vnode, container);
  // 创建组件实例
  // create component instance 
  const instance = createComponentInstance(initialVNode);
  // console.log(instance);
  // 初始化组件
  // init component
  setupComponent(instance);
  // console.log(instance.proxy);
  // 初始化 渲染 副作用
  setupRenderEffect(instance, initialVNode, container);
}

function setupRenderEffect(instance: any, initialVNode, container) {
  // console.log(instance)
  // console.log(container)

  const { proxy } = instance

  const subTree = instance.render.call(proxy);
  // console.log(instance.render.call(proxy));
  // console.log(instance.render.bind(proxy)());
  // console.log(instance.render.apply(proxy));/

  patch(subTree, container);
  initialVNode.el = subTree.el
  // console.log(subTree.el);
  // Element -> mount 
}
