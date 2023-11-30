import { ShapeFlags } from "../shared/shapeFlags"

export const Fragment = Symbol('Fragment')

export function createVNode(type, props?, children?) {
    const vnode =  {
        type,
        props,
        children,
        shapeFlag: getShapeFlag(type),
        el: null, // 用于后续存储el
    }

    

    // 根据children的不同处理shapeFlag的值
    if (typeof children === 'string') {
        vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
    } else if (Array.isArray(children)) {
        vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
    }

    // 添加solts的flag   满足条件：必须是组件且children是一个object
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) { // 必须是组件
        if (typeof children === 'object') {
            vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
        }
    }
    return vnode
}


function getShapeFlag(type) {
    return typeof type === 'string' ? ShapeFlags.ELEMENT : ShapeFlags.STATEFUL_COMPONENT
}