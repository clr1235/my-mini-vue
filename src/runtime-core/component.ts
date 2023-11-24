export function createComponentInstance(vnode) {
    const compoent = {
        vnode,
        type: vnode.type
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

