import { createComponentInstance, setupComponent } from "./component";

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
  if (typeof vnode.type === "string") {
    // handle Element container
    // 处理 Elememt容器
    processElement(vnode, container)
  } else {
    // handle component
    // 处理组件 
    processComponent(vnode, container)
  }
  // processElement();
}

function processElement(vnode, container) {
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.type)

  const { children } = vnode

  // children
  if (typeof children === "string") {
    el.textContent = children
  } else if (Array.isArray(children)) {
    children.forEach((v) => {
      patch(v, el);
    });
  }

  // props
  const { props } = vnode

  for (const key in props) {
    let val = ""
    if (key === 'class') {
      // console.log(key);
      val = props[key].join(" ");

    } else {
      val = props[key];
    }
    el.setAttribute(key, val)
  }

  container.append(el)
}

function processComponent(vnode: any, container: any) {
  // console.log(vnode, container);
  // 渲染组件
  // render component
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
  // console.log(vnode, container);
  // 创建组件实例
  // create component instance 
  const instance = createComponentInstance(vnode);
  // console.log(instance);
  // 初始化组件
  // init component
  setupComponent(instance);
  // console.log(instance.proxy);
  // 初始化 渲染 副作用
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container) {
  // console.log(instance)
  // console.log(container)

  const { proxy } = instance

  const subTree = instance.render.call(proxy);
  // console.log(instance.render.call(proxy));
  // console.log(instance.render.bind(proxy)());
  // console.log(instance.render.apply(proxy));/

  patch(subTree, container);
  console.log(subTree, container);
}
