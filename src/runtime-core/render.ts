import {createComponentInstance, setupComponent} from './component'

export function render(vnode, container) {
    // 调用patch，方便后续进行递归处理
    patch(vnode, container)
}

function patch(vnode, container) {
    // 处理组件  判断vnode是不是一个element，如果是component的话
    console.log(vnode.type)
    processComponent(vnode, container)
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
    const subTree = instance.render()

    patch(subTree, container)
}