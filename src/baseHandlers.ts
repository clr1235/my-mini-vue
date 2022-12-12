import {track, trigger} from './effect'

// 代码优化 将get的创建 只初始化一次
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

// 抽取出get的创建方法
export function createGetter(isReadonly: any = false) {
    return function get(target: any, key:any, receiver:any) {
        const res = Reflect.get(target, key, receiver)
        if (!isReadonly) {
            // 此处会进行依赖收集
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