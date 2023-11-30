import { Fragment, createVNode } from "../vnode"

export function renderSlots(slots, name, props) {
    // 获取到要渲染的slots
    const slot = slots[name]
    if (slot) {
        if (typeof slot === 'function') {
            // 只需要把children渲染出来就可以，
            return createVNode(Fragment, {}, slot(props))
        }
        
    }

}