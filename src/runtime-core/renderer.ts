import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode, container) {

  // TODO 判断vnode 是不是一个 element
  // 是 element 那么就应该处理 element
  // 思考题： 如何去区分是 element 还是 component 类型呢？
  if (typeof vnode.type === "string") {
    processElement(vnode, container)
  } else {
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
      console.log(key);
      val = props[key].join(" ");

    } else {
      val = props[key];
    }
    el.setAttribute(key, val)
  }

  container.append(el)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container) {
  const instance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container) {
  const subTree = instance.render();

  patch(subTree, container);
}
