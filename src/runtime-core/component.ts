export function createComponentInstance(vnode) {
    const compoent = {
        vnode,
        type: vnode.type,
        setupState: {}
    }
    return compoent
}


export function setupComponent(instance:any) {
    // 初始化props
    // 初始化slots

    setupStateFulComponent(instance) 
}


export function setupStateFulComponent(instance: any) {
    const Component = instance.type

    // 
    instance.proxy = new Proxy({}, {
        get(target, key) {
            const {setupState} = instance
            if (key in setupState) {
                return setupState[key]
            }
        },

    })

    const {setup} = Component
    if (setup) {
        const setupResult = setup()
        handleSetupResult(instance, setupResult)
    }
}


function handleSetupResult(instance: any, setupResult: any) {
    
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
    }

    finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
    const Component = instance.type
    if (Component.render) {
        instance.render = Component.render
    }
}

