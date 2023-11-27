import { isObject } from '../shared/index'
import {createComponentInstance, setupComponent} from './component'

export function render(vnode, container) {
    // 调用patch，方便后续进行递归处理
    patch(vnode, container)
}

function patch(vnode, container) {
    // debugger
    // 处理组件  判断vnode是不是一个element，如果是component的话
    console.log(vnode.type, '=s=s=s=s=s=>>>>', vnode )
    // 根据vnode的类型做不同的处理
    if (typeof vnode.type === 'string') {
        processElement(vnode, container)
    } else if (isObject(vnode.type)) {
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
    const el = document.createElement(vnode.type);
    // 将对应的props和children添加到创建的el上
    const {children, props} = vnode
    // 根据children的不同类型去做不同的处理
    if (typeof children === 'string') {
        el.textContent = children
    } else if (Array.isArray(children)) {
        // 如果h函数中的第三个参数children是数组类型的话，其实它的每一项还是一个vnode，则需要遍历调用patch进行处理
        mountChildren(vnode, el)
    }
    

    // 将vnode的props对象设置到el的属性上
    for(const key in props) {
        const val = props[key]
        el.setAttribute(key, val)
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

function mountComponent(vnode: any, container) {
    // 创建组件实例
    const instance = createComponentInstance(vnode)

    setupComponent(instance)

    setupRenderEffect(instance, container)
}


function setupRenderEffect(instance: any, container: any) {
    const {proxy} = instance
    const subTree = instance.render.call(proxy)

    patch(subTree, container)
}


