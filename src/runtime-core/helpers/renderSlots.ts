import { createVNode } from "../vnode"

export function renderSlots(slots, name, props) {
    // 获取到要渲染的slots
    const slot = slots[name]
    if (slot) {
        if (typeof slot === 'function') {
            return createVNode('div', {}, slot(props))
        }
        
    }

}