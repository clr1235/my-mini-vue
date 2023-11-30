function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null, // 用于后续存储el
    };
    return vnode;
}

var extend = Object.assign;
var isObject = function (val) {
    return val !== null && typeof val === 'object';
};
var hasOwn = function (val, key) { return Object.prototype.hasOwnProperty.call(val, key); };
// 首字母大写
var capitalize = function (str) { return str.charAt(0).toUpperCase() + str.slice(1); };
// - 转 驼峰
var camlize = function (str) { return str.replace(/-(\w)/g, function (_, c) { return c ? c.toUpperCase() : ''; }); };
var toHandlerKey = function (str) { return str ? 'on' + capitalize(str) : ''; };

// 创建bucket，用来收集依赖
var bucket = new WeakMap();
// 触发依赖
function trigger(target, key) {
    // 根据track中的依赖存储方式，取出所有的依赖
    var depsMap = bucket.get(target);
    if (!depsMap)
        return;
    var deps = depsMap.get(key);
    triggerEffects(deps);
}
function triggerEffects(deps) {
    // 循环执行所有的依赖
    var effectsToRun = new Set(deps);
    effectsToRun && effectsToRun.forEach(function (effectFn) {
        if (effectFn.scheduler) {
            effectFn.scheduler();
        }
        else {
            effectFn.run();
        }
    });
}

// 初始化get，后续直接使用get
var get = createGetter();
var set = createSetter();
var readonlyGet = createGetter(true);
var shallowReadonlyGet = createGetter(true, true);
function createGetter(isReadonly, shallow) {
    if (isReadonly === void 0) { isReadonly = false; }
    if (shallow === void 0) { shallow = false; }
    return function get(target, key) {
        // isReactive方法和isReadonly方法的执行结果
        if (key === "__v_isReactive" /* ReactiveFlags.IS_REACTIVE */) {
            return !isReadonly;
        }
        else if (key === "__v_isReadonly" /* ReactiveFlags.IS_READONLY */) {
            return isReadonly;
        }
        // 返回值
        var res = Reflect.get(target, key);
        // 如果是浅层的话，直接返回值
        if (shallow) {
            return res;
        }
        // reactive()，readonly() 支持嵌套也就是说如果返回值是对象的话，继续调用reactive()或者readonly()即可
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res);
        }
        return res;
    };
}
function createSetter() {
    return function set(target, key, value) {
        // 设置属性值
        target[key] = value;
        // 触发依赖
        trigger(target, key);
        // 返回值
        var res = Reflect.set(target, key, value);
        return res;
    };
}
var mutableHandlers = {
    get: get,
    set: set,
};
var readonlyHandlers = {
    get: readonlyGet,
    set: function (target, key) {
        // 可以在set时给一个warning
        console.warn("\u8BE5key: ".concat(key, " \u4E0D\u5141\u8BB8\u8FDB\u884Cset\u64CD\u4F5C\uFF0Ctarget: ").concat(target));
        return true;
    },
};
// 只是浅层的响应式，所以表现跟readonlyHandlers的形式是一样的，唯一不同的是get的实现不进行嵌套
var shallowReadonlyHandlers = extend({}, readonlyHandlers, { get: shallowReadonlyGet });

// vue3的reactive()方法，返回一个代理的对象
function reactive(raw) {
    return createReactive(raw, mutableHandlers);
}
// 返回一个只读的代理对象，也就意味着不允许set，那么也就不需要tarck和trigger
function readonly(raw) {
    return createReactive(raw, readonlyHandlers);
}
// readonly()的浅层作用形式，也就是说一个对象中只有第一层是响应式的，其内部嵌套的对象是普通的对象
function shallowReadonly(raw) {
    return createReactive(raw, shallowReadonlyHandlers);
}
function createReactive(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers);
}

/**
 *
 * @param instance 内置传递的组件实例对象
 * @param event 用户传递的emit事件名
 */
var emit = function (instance, event) {
    // console.log('emit: ',  event)
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    // 从props中找到emit事件名
    var props = instance.props;
    // 如果有事件函数的话，执行
    var handlerName = toHandlerKey(camlize(event));
    var handler = props[handlerName];
    handler && handler.apply(void 0, args);
};

var initProps = function (instance, props) {
    instance.props = props || {};
};

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; },
    $slots: function (i) { return i.slots; },
};
var PublicInstanceProxyHandles = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState, props = instance.props;
        // 此处读取到instance实例上的props并返回，从而实现在render中可以访问this[key]
        if (hasOwn(setupState, key)) {
            return setupState[key];
        }
        else if (hasOwn(props, key)) {
            return props[key];
        }
        var publicgetter = publicPropertiesMap[key];
        if (publicgetter) {
            return publicgetter(instance);
        }
    },
};

var initSlots = function (instance, children) {
    instance.slots = children;
};

function createComponentInstance(vnode) {
    var compoent = {
        vnode: vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: function () { },
        slots: {},
    };
    // 使用 bind 内置了传递第一个参数 compoent，以便于用户只需要关注传递emit事件名就可以
    compoent.emit = emit.bind(null, compoent);
    return compoent;
}
function setupComponent(instance) {
    // 初始化props
    initProps(instance, instance.vnode.props);
    // 初始化slots
    initSlots(instance, instance.vnode.children);
    setupStateFulComponent(instance);
}
function setupStateFulComponent(instance) {
    var Component = instance.type;
    // 
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandles);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        });
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    var Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    // 调用patch，方便后续进行递归处理
    patch(vnode, container);
}
function patch(vnode, container) {
    // debugger
    // 处理组件  判断vnode是不是一个element，如果是component的话
    console.log(vnode.type, '=s=s=s=s=s=>>>>', vnode);
    // 根据vnode的类型做不同的处理
    if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
    else if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // init
    mountElement(vnode, container);
    // update
}
// 初始化element
function mountElement(vnode, container) {
    // 如果是string类型的话，创建一个element元素
    var el = (vnode.el = document.createElement(vnode.type));
    // 将对应的props和children添加到创建的el上
    var children = vnode.children, props = vnode.props;
    // 根据children的不同类型去做不同的处理
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        // 如果h函数中的第三个参数children是数组类型的话，其实它的每一项还是一个vnode，则需要遍历调用patch进行处理
        mountChildren(vnode, el);
    }
    // 将vnode的props对象设置到el的属性上
    for (var key in props) {
        var val = props[key];
        // 拿到props对象中的所有key做处理，以on开头第三个字段为大写的key则认为是事件
        var isOn = function (key) { return /^on[A-Z]/.test(key); };
        if (isOn(key)) {
            // 为el添加事件
            var eventName = key.slice(2).toLowerCase();
            el.addEventListener(eventName, val);
        }
        else {
            el.setAttribute(key, val);
        }
    }
    // 将创建好的el添加到container容器上
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (vnode) {
        patch(vnode, container);
    });
}
function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode, container);
}
function mountComponent(initialVNode, container) {
    // 创建组件实例
    var instance = createComponentInstance(initialVNode);
    setupComponent(instance);
    setupRenderEffect(instance, initialVNode, container);
}
function setupRenderEffect(instance, initialVNode, container) {
    var proxy = instance.proxy;
    var subTree = instance.render.call(proxy);
    patch(subTree, container);
    // 所有的element类型都mount处理完成之后再执行
    initialVNode.el = subTree.el;
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 转换成虚拟节点Vnode
            var vnode = createVNode(rootComponent);
            // 进行渲染
            render(vnode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
