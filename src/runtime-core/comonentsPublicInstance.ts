const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}
export const PublicInstanceProxyHandlers = {
  get: ({ _: instance }, key) => {
    // console.log(target, key);
    // setupState 
    // 拿出 setup 返回的数据
    // console.log(setupState);
    // 加入到代理
    const { setupState } = instance
    if (key in setupState) {
      // console.log(setupState, key);
      return setupState[key]
    }
    const publicGetter = publicPropertiesMap[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
    // key -> $el
    // if (key === '$el') {
    //   return instance.vnode.el
    // }
  }
}