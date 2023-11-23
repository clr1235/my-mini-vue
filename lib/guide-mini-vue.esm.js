function createVNode(type, props, children) {
    var vnode = {
        type: type,
        props: props,
        children: children
    };
    return vnode;
}

function createComponentInstance(vnode) {
    var compoent = {
        vnode: vnode,
        type: vnode.type
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
    var setup = Component.setup;
    if (setup) {
        var setupResult = setup();
        handleSetupRersult(instance, setupResult);
    }
}
function handleSetupRersult(instance, setupResult) {
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
    patch(vnode);
}
function patch(vnode, container) {
    // 处理组件  判断vnode是不是一个element，如果是component的话
    processComponent(vnode);
}
function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    // 创建组件实例
    var instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    var subTree = instance.render();
    patch(subTree);
}

function createApp(rootComponent) {
    return {
        mount: function (rootContainer) {
            // 转换成虚拟节点Vnode
            var vnode = createVNode(rootComponent);
            // 进行渲染
            render(vnode);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

export { createApp, h };
