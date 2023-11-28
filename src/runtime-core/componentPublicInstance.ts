
export const publicPropertiesMap = {
    $el: (i) => i.vnode.el 
}

export const PublicInstanceProxyHandles = {
    get({_:instance}, key) {
        const {setupState} = instance
        if (key in setupState) {
            return setupState[key]
        }

        const publicgetter = publicPropertiesMap[key]
        if (publicgetter) {
            return publicgetter(instance)
        }
    },
}