import { track, trigger } from "./effect"
import { ReactiveFlags, reactive, readonly } from './reactive'
import {extend, isObject} from '../shared'

// 初始化get，后续直接使用get
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)

export function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key) {
        console.log('触发的是啥：', key)
        // isReactive方法和isReadonly方法的执行结果
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }

        // 返回值
        const res = Reflect.get(target, key)

        // 如果是浅层的话，直接返回值
        if (shallow) {
            return res
        }

        // reactive()，readonly() 支持嵌套也就是说如果返回值是对象的话，继续调用reactive()或者readonly()即可
        if(isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }

        // 根据传入的isReadonly参数判断是reactive()还是readonly()，从而避免执行track
        if (!isReadonly) {
            track(target, key)
        }
        

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
    set(target: any, key: any) {
        // 可以在set时给一个warning
        console.warn(`该key: ${key} 不允许进行set操作，target: ${target}`)
        return true
    },
}
// 只是浅层的响应式，所以表现跟readonlyHandlers的形式是一样的，唯一不同的是get的实现不进行嵌套
export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {get: shallowReadonlyGet})