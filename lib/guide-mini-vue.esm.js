function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null, // 用于后续存储el
    };
    return vnode;
}

var isObject = function (val) {
    return val !== null && typeof val === 'object';
};

var publicPropertiesMap = {
    $el: function (i) { return i.vnode.el; }
};
var PublicInstanceProxyHandles = {
    get: function (_a, key) {
        var instance = _a._;
        var setupState = instance.setupState;
        if (key in setupState) {
            return setupState[key];
        }
        var publicgetter = publicPropertiesMap[key];
        if (publicgetter) {
            return publicgetter(instance);
        }
    },
};

function createComponentInstance(vnode) {
    var compoent = {
        vnode: vnode,
        type: vnode.type,
        setupState: {}
    };
    return compoent;
}
function setupComponent(instance) {
    // 初始化props
    // 初始化slots
    setupStateFulComponent(instance);
}
function setupStateFulComponent(instance) {
    var Component = instance.type;
    // 
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandles);
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
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
