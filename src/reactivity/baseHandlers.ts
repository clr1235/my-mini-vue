import { track, trigger } from "./effect"

// 初始化get，后续直接使用get
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

export function createGetter(isReadonly = false) {
    return function get(target, key) {
        if (!isReadonly) {
            track(target, key)
        }
        // 返回值
        const res = Reflect.get(target, key)
        return res
    }
}

export function createSetter() {
    return function set(target, key, value) {
        // 设置属性值
        target[key] = value
        // 触发依赖
        trigger(target, key)
        // 返回值
        const res = Reflect.set(target, key, value)
        return res
    }
}


export const mutableHandlers = {
    get,
    set,
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value) {
        // 可以在set时给一个warning
        console.warn(`该key: ${key} 不允许进行set操作，target: ${target}`)
        return true
    },
}