var Fragment = Symbol("Fragment");
var Text = Symbol("Text");
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
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
        if (typeof children === "object") {
            vnode.shapeFlag |= 16 /* SLOT_CHILDREN */;
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
        ? 1 /* ELEMENT */
        : 2 /* STATEFUL_COMPONENT */;
}
function createTextVNode(text) {
    return createVNode(Text, {}, text);
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

function renderSlots(slots, name, props) {
    var slot = slots[name];
    if (slot) {
        if (typeof slot === "function") {
            return createVNode(Fragment, {}, slot(props));
        }
    }
    // return createVNode("div", {}, slot)
}

var extend = Object.assign;
var isObject = function (value) {
    return value !== null && typeof value === "object";
};
var hasOwn = function (val, key) {
    return Object.prototype.hasOwnProperty.call(val, key);
};
var camelize = function (str) {
    return str.replace(/-(\w)/g, function (_, c) {
        return c ? c.toUpperCase() : " ";
    });
};
var capotalize = function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
var toHandlerkey = function (str) {
    return str ? "on" + capotalize(str) : "";
};

var targetMap = new Map();
function trigger(target, key) {
    var depsMap = targetMap.get(target);
    var dep = depsMap.get(key);
    triggerEffects(dep);
}
function triggerEffects(dep) {
    for (var _i = 0, dep_1 = dep; _i < dep_1.length; _i++) {
        var effect_1 = dep_1[_i];
        if (effect_1.scheduler) {
            effect_1.scheduler();
        }
        else {
            effect_1.run();
        }
    }
}

var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var readonlySet = createSetter(true);
var shallowReadonlyGet = createGetter(true, true);
// const shallowReadonlySet = createGetter(true, true)
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        if (key === "__v_isReactive" /* IS_REACTIVE */)
            return !isReadonly;
        if (key === "__v_isReadonly" /* IS_READONLY */)
            return isReadonly;
        var res = Reflect.get(target, key);
        if (shallow)
            return res;
        // 看看res 是不是 Object
        if (isObject(res))
            return isReadonly ? readonly(res) : reactive(res);
        return res;
    };
}
function createSetter(isReadonly) {
    if (isReadonly === void 0) { isReadonly = false; }
    return function set(target, key, value) {
        // TODO 触发依赖
        if (!isReadonly) {
            var res = Reflect.set(target, key, value);
            trigger(target, key);
            return res;
        }
        else {
            console.warn("key: '".concat(key, "' set faild ,because 'target' is readonly"), target);
            return true;
        }
    };
}
var reactiveHandlers = {
    get: get,
    set: set,
};
var readonlyHandlers = {
    get: readonlyGet,
    set: readonlySet,
};
var shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet,
    // set: shallowReadonlySet
});

function reactive(raw) {
    return createReactiveObject(raw, reactiveHandlers);
}
function readonly(raw) {
    return createReactiveObject(raw, readonlyHandlers);
}
function shallowReadonly(raw) {
    return createReactiveObject(raw, shallowReadonlyHandlers);
}
function createReactiveObject(target, baseHandlers) {
    if (!isObject(target)) {
        console.warn("target ".concat(target, "\u5FC5\u987B\u662F\u4E00\u4E2A\u5BF9\u8C61"));
        return target;
    }
    return new Proxy(target, baseHandlers);
}

function emit(instance, event) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    console.log(instance);
    console.log(event);
    console.log(args);
    // instance.props -> event
    var props = instance.props;
    // TPP
    // 先去写一个特定的行为 -》 重构成通用的行为F
    // add ->  Add
    // add-foo -> addFoo
    var HandlerName = toHandlerkey(camelize(event));
    var handler = props[HandlerName];
    handler && handler(args);
}

function initProps(instance, rawProps) {
    // console.log(instance, rawProps);
    instance.props = rawProps || {};
    // attrs
}

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    $slots: function (i) { return i.slots; }
};
var PublicInstanceProxyHandlers = {
    get: function (_a, key) {
        var instance = _a._;
        // console.log(target, key);
        // setupState 
        // 拿出 setup 返回的数据
        // console.log(setupState);
        // 加入到代理
        var setupState = instance.setupState, props = instance.props;
        if (key in setupState) {
            // console.log(setupState, key);
            return setupState[key];
        }
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
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

function initSlots(instance, children) {
    var vnode = instance.vnode;
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */)
        normalizeSlotValues(children, instance.slots);
}
function normalizeSlotValues(children, slots) {
    var _loop_1 = function (key) {
        var value = children[key];
        slots[key] = function (props) { return normalizeSlotValue(value(props)); };
    };
    // const slots = {}
    for (var key in children) {
        _loop_1(key);
    }
}
function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
}

function createComponentInstance(vnode, parent) {
    var component = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        slots: {},
        provides: parent ? parent.provides : {},
        parent: parent,
        emit: function () { }
    };
    // component.emit = emit as any
    // console.log(component);
    component.emit = emit.bind(null, component);
    // console.log(component);
    // 返回组件实例
    // return component instance
    return component;
}
function setupComponent(instance) {
    // TODO
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
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
        setCurrentInstance(instance);
        // 得到返回的 object
        var setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        setCurrentInstance(null);
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
var currentInsatance = null;
function getCurrentInstance() {
    return currentInsatance;
}
function setCurrentInstance(instance) {
    currentInsatance = instance;
}

function provide(key, value) {
    console.log('provide: ', key, value);
    // 存
    // key value 
    var currentInsatance = getCurrentInstance();
    if (currentInsatance) {
        var provides = currentInsatance.provides;
        var parentProvides = currentInsatance.parent.provides;
        if (provides === parentProvides) {
            provides = currentInsatance.provides = Object.create(parentProvides);
        }
        provides[key] = value;
    }
}
function inject(key, defaultValue) {
    // 取
    var currentInsatance = getCurrentInstance();
    if (currentInsatance) {
        var parentProvides = currentInsatance.parent.provides;
        if (key in parentProvides) {
            return parentProvides[key];
        }
        else if (defaultValue) {
            if (typeof defaultValue === "function") {
                return defaultValue();
            }
            return defaultValue;
        }
    }
}

// import { render } from "./renderer";
function createAppAPI(render) {
    return function createApp(rootComponent) {
        return {
            mount: function (rootContainer) {
                var vnode = createVNode(rootComponent);
                render(vnode, rootContainer);
            }
        };
    };
}

function createRenderer(options) {
    var hostCreateElement = options.createElement, hostPatchProp = options.patchProp, hostInsert = options.insert;
    function render(vnode, container) {
        // console.log(vnode, container);
        /**
         * 参数传到 patch函数 中处理
         * 说人话： 多嵌套一层 function 不知道有啥用？ 可能显得高级一些...
         */
        patch(vnode, container, null);
    }
    function patch(vnode, container, parentComponent) {
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
        console.log(vnode);
        var type = vnode.type, shapeFlag = vnode.shapeFlag;
        // console.log(type, shapeFlag);
        // Fragment -> 只渲染children
        switch (type) {
            case Fragment:
                processFragment(vnode, container, parentComponent);
                break;
            case Text:
                processText(vnode, container);
                break;
            default:
                if (shapeFlag & 1 /* ELEMENT */) {
                    // handle Element container
                    // 处理 Elememt容器
                    processElement(vnode, container, parentComponent);
                }
                else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
                    // handle component
                    // 处理组件 
                    processComponent(vnode, container, parentComponent);
                }
        }
        // processElement();
    }
    function processText(vnode, container) {
        var children = vnode.children;
        var textNode = (vnode.el = document.createTextNode(children));
        container.append(textNode);
    }
    function processFragment(vnode, container, parentComponent) {
        // Implement
        mountChildren(vnode, container, parentComponent);
    }
    function processElement(vnode, container, parentComponent) {
        mountElement(vnode, container, parentComponent);
    }
    function mountElement(vnode, container, parentComponent) {
        // const el = document.createElement(vnode.type)
        var el = (vnode.el = hostCreateElement(vnode.type));
        // console.log(el);
        // console.log(vnode.el);
        var children = vnode.children, shapeFlag = vnode.shapeFlag;
        // children
        if (shapeFlag & 4 /* TEXT_CHILDREN */) {
            el.textContent = children;
        }
        else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
            mountChildren(vnode, el, parentComponent);
        }
        // props
        var props = vnode.props;
        for (var key in props) {
            var val = props[key];
            // const isOn = (key: string) => /^on[A-Z]/.test(key)
            // if (isOn(key)) {
            //   // const EventTag = key.substring(0, 2)
            //   // if (EventTag === "on") {
            //   const EventName = key.substring(2).toLowerCase()
            //   el.addEventListener(EventName, val)
            //   // console.log(EventTag, EventName);
            // } else {
            //   el.setAttribute(key, val)
            // }
            hostPatchProp(el, key, val);
        }
        hostInsert(el, container);
    }
    function mountChildren(vnode, container, parentComponent) {
        vnode.children.forEach(function (v) {
            patch(v, container, parentComponent);
        });
    }
    function processComponent(vnode, container, parentComponent) {
        // console.log(vnode, container);
        // 渲染组件
        // render component
        mountComponent(vnode, container, parentComponent);
    }
    function mountComponent(initialVNode, container, parentComponent) {
        // console.log(vnode, container);
        // 创建组件实例
        // create component instance 
        var instance = createComponentInstance(initialVNode, parentComponent);
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
        patch(subTree, container, instance);
        initialVNode.el = subTree.el;
        // console.log(subTree.el);
        // Element -> mount 
    }
    return {
        createApp: createAppAPI(render)
    };
}

function createElement(type) {
    return document.createElement(type);
}
function patchProp(el, key, val) {
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
function insert(el, parent) {
    parent.append(el);
}
var renderer = createRenderer({
    createElement: createElement,
    patchProp: patchProp,
    insert: insert
});
function createApp() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return renderer.createApp.apply(renderer, args);
}

export { createApp, createRenderer, createTextVNode, getCurrentInstance, h, inject, provide, renderSlots };
