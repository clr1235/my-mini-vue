import { ShapeFlags } from "../shared/shapeFlags"


export const initSlots = (instance, children) => {
    // children 可能是对象也能是数组，也可能是字符串
    const {vnode} = instance
    if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
        normalizeObjectSlots(children, instance.slots)
    }
}

function normalizeObjectSlots(children:any, slots: any) {
    for(const key in children) {
        const value = children[key]
        // slot
        slots[key] = (props) => normalizeSlotValue(value(props))
    }
}


function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value]
}