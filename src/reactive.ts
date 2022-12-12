import {mutableHandlers, readonlyHandles} from './baseHandlers'
import { ReactiveFlags } from './baseHandlers';

export function createActiveObject(raw: any, baseHandlers:any) {
    return new Proxy(raw, baseHandlers) 
}


export function reactive(raw: any) {
    return createActiveObject(raw, mutableHandlers) 
}

export function readonly(raw: any) {
    return createActiveObject(raw, readonlyHandles)
}

export function isReadonly(value: any) {
    // 只要执行 value.XXX就会触发get方法，而在createGetter方法中接收了isReadonly参数做了一些处理
    // 所以可以在触发了get方法的时候根据isReadonly参数做判断
    return !!value[ReactiveFlags.IS_READONLY]
}

export function isReactive(value: any) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}
