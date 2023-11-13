import { mutableHandlers, readonlyHandlers} from './baseHandlers'


// vue3的reactive()方法，返回一个代理的对象
export function reactive(raw: any) {
    return createReactive(raw, mutableHandlers)
}
// 返回一个只读的代理对象，也就意味着不允许set，那么也就不需要tarck和trigger
export function readonly(raw: any) {
    return createReactive(raw, readonlyHandlers)
}

function createReactive(raw: any, baseHandlers: any) {
    return new Proxy(raw, baseHandlers)
}