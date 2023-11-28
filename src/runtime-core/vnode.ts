export function createVNode(type, props?, children?) {
    const vnode =  {
        type,
        props,
        children,
        el: null, // 用于后续存储el
    }

    return vnode
}