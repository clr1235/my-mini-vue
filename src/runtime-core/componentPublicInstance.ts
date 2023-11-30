import {hasOwn} from '../shared/index'

export const publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots, 
}

export const PublicInstanceProxyHandles = {
    get({_:instance}, key) {
        const {setupState, props} = instance

        // 此处读取到instance实例上的props并返回，从而实现在render中可以访问this[key]
        if (hasOwn(setupState, key)) {
            return setupState[key]
        } else if (hasOwn(props, key)) {
            return props[key]
        }

        const publicgetter = publicPropertiesMap[key]
        if (publicgetter) {
            return publicgetter(instance)
        }
    },
}