import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandles } from "./componentPublicInstance"

export function createComponentInstance(vnode) {
    const compoent = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {},
        emit: () => {}
    }
    // 使用 bind 内置了传递第一个参数 compoent，以便于用户只需要关注传递emit事件名就可以
    compoent.emit = emit.bind(null, compoent) as any;
 
    return compoent
}


export function setupComponent(instance:any) {
    // 初始化props
    initProps(instance, instance.vnode.props)
    // 初始化slots

    setupStateFulComponent(instance) 
}


export function setupStateFulComponent(instance: any) {
    const Component = instance.type

    // 
    instance.proxy = new Proxy({_:instance}, PublicInstanceProxyHandles)

    const {setup} = Component
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props), {
            emit: instance.emit
        })
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

