

export const initSlots = (instance, children) => {
    // children 可能是对象也能是数组，也可能是字符串
    normalizeObjectSlots(children, instance.slots)
}

function normalizeObjectSlots(children:any, slots: any) {
    for(const key in children) {
        const value = children[key]
        // slot
        slots[key] = normalizeSlotValue(value)
    }
}


function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value]
}