import {track, trigger} from './effect'
import { ReactiveFlags } from './reactive';

// 代码优化 将get的创建 只初始化一次
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);



// 抽取出get的创建方法
export function createGetter(isReadonly: any = false) {
    return function get(target: any, key:any, receiver:any) {
        const res = Reflect.get(target, key, receiver)
        // console.log(`${key}触发了get`)
        // 根据参数isReadonly来区分该对象是reactive的还是readonly的
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        // 此处会进行依赖收集 readonly对象不能set所以不需要进行依赖的收集和触发
        if (!isReadonly) {
            track(target, key);
        }
        return res;
    }
}
// 抽取出set的创建方法
export function createSetter() {
    return function set(target: any, key: any, value: any, receiver: any) {
        const res = Reflect.set(target, key, value, receiver);
        // 在set的时候 触发依赖
        trigger(target, key)
        return res;
    }
}

export const mutableHandlers = {
    get,
    set,
}

export const readonlyHandles = {
    get: readonlyGet,
    set(target: any, key: any, value: any, receiver: any) {
        console.warn(`key:${key}不能set，因为${target}为readonly！`)
        return true;
    }
}