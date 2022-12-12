import {mutableHandlers, readonlyHandles} from './baseHandlers'


export function createActiveObject(raw: any, baseHandlers:any) {
    return new Proxy(raw, baseHandlers) 
}


export function reactive(raw: any) {
    return createActiveObject(raw, mutableHandlers) 
}

export function readonly(raw: any) {
    return createActiveObject(raw, readonlyHandles)
}

