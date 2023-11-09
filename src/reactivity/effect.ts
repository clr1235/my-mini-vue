

// 声明一个activeEffect 用来存储当前激活的副作用函数
let activeEffect;

// 创建bucket，用来收集依赖
const bucket = new WeakMap()



// 用于构造副作用函数的类
class ReactiveEffect {
    private _fn: any;
    constructor(fn) {
        this._fn = fn;
    }

    run() {
        this._fn()
    }
}

// 副作用函数
export function effect(fn) {
    const _effect = new ReactiveEffect(fn)
    // 将注册好的副作用函数，赋值给activeEffect
    activeEffect = _effect
    // 执行副作用函数 目的是触发响应式数据的读取操作，进而触发Proxy的get拦截函数，在其中进行副作用函数的收集
    _effect.run()


}

// 依赖收集 
export function track(target, key) {
    if (!activeEffect) return;
    // bucket，用来存储 原始对象target 和 depsMap 的映射关系。即，bucket是一个WeakMap：target ------> depsMap
    // 根据 target 从 bucket 中取得 depsMap，它也是一个Map类型：key ---> effects
    let depsMap = bucket.get(target)
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    // depsMap 用来存储 字段名key 和 所有的副作用函数effects 的映射关系；即，depsMap是一个Map：key ------> effects
    // 再根据 key 从 depsMap 中取得 deps，它是一个Set类型：里边存储着所有与当前 key 相关联的副作用函数 effects
    let deps = depsMap.get(key)
    if (!deps) {
        depsMap.set(key, (deps = new Set()))
    }

    // 最后将当前激活的副作用函数添加到 deps 中
    deps.add(activeEffect)
}

// 触发依赖
export function trigger(target, key, value) {
    // 根据track中的依赖存储方式，取出所有的依赖
    const depsMap = bucket.get(target)
    if (!depsMap) return;
    const deps = depsMap.get(key)

    // 循环执行所有的依赖
    deps && deps.forEach(fn => fn())
}