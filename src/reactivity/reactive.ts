import {track, trigger} from './effect' 

// vue3的reactive()方法，返回一个代理的对象
export function reactive(raw: any) {

    return new Proxy(raw, {
        get(target, key) {
            // 进行依赖收集
            track(target, key)
            // 返回值
            const res = Reflect.get(target, key)
            return res
        },
        set(target, key, value) {
            // 设置属性值
            target[key] = value
            // 触发依赖
            trigger(target, key)
            // 返回值
            const res = Reflect.set(target, key, value)
            return res
        },
    })
}
// 返回一个只读的代理对象，也就意味着不允许set，那么也就不需要tarck和trigger
export function readonly(raw: any) {
    return new Proxy(raw, {
        get(target, key) {
            // 返回值
            const res = Reflect.get(target, key)
            return res
        },
        set(target, key, value) {
            // 可以在set时给一个warning
            return true
        },
    })
}