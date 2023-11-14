import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers} from './baseHandlers'


export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}

// vue3的reactive()方法，返回一个代理的对象
export function reactive(raw: any) {
    return createReactive(raw, mutableHandlers)
}
// 返回一个只读的代理对象，也就意味着不允许set，那么也就不需要tarck和trigger
export function readonly(raw: any) {
    return createReactive(raw, readonlyHandlers)
}
// readonly()的浅层作用形式，也就是说一个对象中只有第一层是响应式的，其内部嵌套的对象是普通的对象
export function shallowReadonly(raw: any) {
    return createReactive(raw, shallowReadonlyHandlers)
}

export function createReactive(raw: any, baseHandlers: any) {
    return new Proxy(raw, baseHandlers)
}

// isReactive 检查一个对象是否是由 reactive() 或 shallowReactive() 创建的代理。
export function isReactive(value) {
    // 在创建getter函数时传入了isReadonly参数，可以根据此参数来区分是什么类型，
    // 而想要执行getter函数，只需要触发代理对象的get操作即可，也就是我们此方法中传入的参数value，只需要读取value上的某个属性即可触发get操作
    // !!是为了以防传入的value不是代理对象时会报错，也就是将undefined转为布尔值
    return !!value[ReactiveFlags.IS_REACTIVE]
}
// isReadonly 检查传入的值是否为只读对象
export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}

// isProxy() 检查一个对象是否是由 reactive()、readonly()、shallowReactive() 或 shallowReadonly() 创建的代理。
export function isProxy(value) {
    return isReactive(value) || isReadonly(value)
}