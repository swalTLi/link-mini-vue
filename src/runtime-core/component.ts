import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentslots";

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: () => { }
  };
  // component.emit = emit as any
  // console.log(component);
  component.emit = emit.bind(null, component) as any
  // console.log(component);

  // 返回组件实例
  // return component instance
  return component;
}

export function setupComponent(instance) {
  // TODO
  initProps(instance, instance.vnode.props)
  initSlots(instance, instance.vnode.children)
  // 设置有状态组件
  // set component which is state
  // Set the status of the component
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  // 得到组件 
  const Component = instance.type;
  // console.log(Component.setup);
  // console.log(instance);

  // ctx
  instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
  // console.log(instance.proxy);

  // console.log(instance.proxy)
  // 拿出 setup 返回值
  // console.log(Component);
  const { setup } = Component;
  // console.log(Component);
  // console.log(setup());

  if (setup) {
    // 得到返回的 object
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    });
    // console.log(setupResult);
    // 把object 挂载 到 实例上  这样实例就可以通过 <this.> 获取 
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance, setupResult: any) {
  // function Object
  // TODO function
  // console.log(typeof setupResult, setupResult);

  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  // 挂载
  // console.log(instance);
  // 完成组件设置
  finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
  const Component = instance.type;
  // console.log(instance.type.render);
  // console.log(Component.render);
  // console.log(instance.render);

  // console.log(Component.render());
  // console.log(instance.render());
  instance.render = Component.render;
  // console.log(instance.render());
  // console.log(Component.render());
}
