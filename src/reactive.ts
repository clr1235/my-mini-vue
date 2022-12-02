import {track, trigger} from './effect'
export function reactive(raw: any) {

    return new Proxy(raw, {
        get(target, key, receiver){
            const res = Reflect.get(target, key, receiver)

            // 此处会进行依赖收集
            track(target, key);
            return res;
        },
        set(target, key, value, receiver) {
            const res = Reflect.set(target, key, value, receiver);
            // 在set的时候 触发依赖
            trigger(target, key)
            return res;
        }
    })
}