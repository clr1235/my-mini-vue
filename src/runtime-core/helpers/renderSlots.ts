import { createVNode } from "../vnode"

export function renderSlots(slots, name) {
    // 获取到要渲染的slots
    const slot = slots[name]
    if (slot) {
        return createVNode('div', {}, slot)
    }

}