import {createVNode} from './vnode'
import {render} from './render'

export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 转换成虚拟节点Vnode
            const vnode = createVNode(rootComponent)
            // 进行渲染
            render(vnode, rootContainer);
        }
    }
}


