'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // console.log(target, key);
        // setupState 
        // 拿出 setup 返回的数据
        // console.log(setupState);
        // 加入到代理
        var setupState = instance.setupState;
        if (key in setupState) {
            // console.log(setupState, key);
            return setupState[key];
        }
        var publicGetter = publicPropertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
        // key -> $el
        // if (key === '$el') {
        //   return instance.vnode.el
        // }
    }
};

function createComponentInstance(vnode) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {}
    };
    // 返回组件实例
    // return component instance
    return component;
}
function setupComponent(instance) {
    // TODO
    // initProps()
    // initSlots()
    // 设置有状态组件
    // set component which is state
    // Set the status of the component
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    // 得到组件 
    var Component = instance.type;
    // console.log(Component.setup);
    // console.log(instance);
    // ctx
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    // console.log(instance.proxy);
    // console.log(instance.proxy)
    // 拿出 setup 返回值
    // console.log(Component);
    var setup = Component.setup;
    // console.log(Component);
    // console.log(setup());
    if (setup) {
        // 得到返回的 object
        var setupResult = setup();
        // console.log(setupResult);
        // 把object 挂载 到 实例上  这样实例就可以通过 <this.> 获取 
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
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
function finishComponentSetup(instance) {
    var Component = instance.type;
    // console.log(instance.type.render);
    // console.log(Component.render);
    // console.log(instance.render);
    // console.log(Component.render());
    // console.log(instance.render());
    instance.render = Component.render;
    // console.log(instance.render());
    // console.log(Component.render());
}

function render(vnode, container) {
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
    var shapeFlag = vnode.shapeFlag;
    // console.log(shapeFlag);
    if (shapeFlag & 1 /* ELEMENT */) {
        // handle Element container
        // 处理 Elememt容器
        processElement(vnode, container);
    }
    else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        // handle component
        // 处理组件 
        processComponent(vnode, container);
    }
    // processElement();
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    // const el = document.createElement(vnode.type)
    var el = (vnode.el = document.createElement(vnode.type));
    // console.log(el);
    // console.log(vnode.el);
    var children = vnode.children, shapeFlag = vnode.shapeFlag;
    // children
    if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
    }
    else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
        mountChildren(vnode, el);
    }
    // props
    var props = vnode.props;
    for (var key in props) {
        var val = props[key];
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            // const EventTag = key.substring(0, 2)
            // if (EventTag === "on") {
            var EventName = key.substring(2).toLowerCase();
            el.addEventListener(EventName, val);
            // console.log(EventTag, EventName);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (v) {
        patch(v, container);
    });
}
function processComponent(vnode, container) {
    // console.log(vnode, container);
    // 渲染组件
    // render component
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    // console.log(vnode, container);
    // 创建组件实例
    // create component instance 
    var instance = createComponentInstance(initialVNode);
    // console.log(instance);
    // 初始化组件
    // init component
    setupComponent(instance);
    // console.log(instance.proxy);
    // 初始化 渲染 副作用
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    // console.log(instance)
    // console.log(container)
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    // console.log(instance.render.call(proxy));
    // console.log(instance.render.bind(proxy)());
    // console.log(instance.render.apply(proxy));/
    patch(subTree, container);
    initialVNode.el = subTree.el;
    // console.log(subTree.el);
    // Element -> mount 
}

function createVNode(type, props, children) {
    // 创建 并且 返回一个虚拟dom
    // 说人话：
    var vnode = {
        type: type,
        props: props,
        children: children,
        shapeFlag: getShapeFlag(type),
        el: null,
    };
    // children 
    if (typeof children === "string") {
        vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    // console.log(vnode);
    // console.log(type.render);
    // console.log(props);
    // console.log(children);
    return vnode;
}
function getShapeFlag(type) {
    return typeof type === "string"
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            var vnode = createVNode(rootComponent);
            // console.log(vnode,rootContainer);
            /**
             * 把 虚拟dom 利用 render 函数渲染到 容器中
             * 说人话就是 利用 js 把 dom 渲染到 div 中
             */
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
