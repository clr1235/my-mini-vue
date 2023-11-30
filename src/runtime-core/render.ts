import { isObject } from '../shared/index'
import { ShapeFlags } from '../shared/shapeFlags'
import {createComponentInstance, setupComponent} from './component'

export function render(vnode, container) {
    // 调用patch，方便后续进行递归处理
    patch(vnode, container)
}

function patch(vnode, container) {
    // debugger
    // 处理组件  判断vnode是不是一个element，如果是component的话
    // console.log(vnode.type, '=s=s=s=s=s=>>>>', vnode )
    // 根据vnode的类型做不同的处理
    const {shapeFlag} = vnode
    if (shapeFlag & ShapeFlags.ELEMENT) { // 基于&运算符进行处理
        processElement(vnode, container)
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
    }
    
}


function processElement(vnode: any, container: any) {
    // init
    mountElement(vnode, container)
    // update

}

// 初始化element
function mountElement(vnode: any, container: any) {
    // 如果是string类型的话，创建一个element元素
    const el = (vnode.el = document.createElement(vnode.type))

    // 将对应的props和children添加到创建的el上
    const {children, props, shapeFlag} = vnode
    // 根据children的不同类型去做不同的处理
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 如果h函数中的第三个参数children是数组类型的话，其实它的每一项还是一个vnode，则需要遍历调用patch进行处理
        mountChildren(vnode, el)
    }
    

    // 将vnode的props对象设置到el的属性上
    for(const key in props) {
        const val = props[key]
        // 拿到props对象中的所有key做处理，以on开头第三个字段为大写的key则认为是事件
        const isOn = (key) => /^on[A-Z]/.test(key);
        if (isOn(key)) {
            // 为el添加事件
            const eventName = key.slice(2).toLowerCase()
            el.addEventListener(eventName, val)
        } else {
            el.setAttribute(key, val)
        }
        
    }
    // 将创建好的el添加到container容器上
    container.append(el)
}

function mountChildren(vnode, container) {
    vnode.children.forEach(vnode => {
        patch(vnode, container)
    })
}


function processComponent(vnode:any, container: any) {
    // 挂载组件
    mountComponent(vnode, container)
}

function mountComponent(initialVNode: any, container) {
    // 创建组件实例
    const instance = createComponentInstance(initialVNode)

    setupComponent(instance)

    setupRenderEffect(instance, initialVNode, container)
}


function setupRenderEffect(instance: any, initialVNode, container: any) {
    const {proxy} = instance
    const subTree = instance.render.call(proxy)

    patch(subTree, container)

    // 所有的element类型都mount处理完成之后再执行
    initialVNode.el = subTree.el
}


