import { extend } from "../shared";

// 声明一个activeEffect 用来存储当前激活的副作用函数
let activeEffect;
// shoudleTrack 用来控制是否应该收集依赖
let shoudleTrack;


// 创建bucket，用来收集依赖
let bucket = new WeakMap()



// 用于构造副作用函数的类
class ReactiveEffect {
    private _fn: any;
    // 定义deps数组，用来存储所有包含当前副作用函数的依赖集合
    deps = []
    // 用来控制是否每次都需要执行 cleanupEffect
    active = true;
    // onStop方法，根据单元测试知道，需要在stop方法中调用一次
    onStop?: () => void

    constructor(fn, public scheduler?) {
        this._fn = fn;
    }

    run() {
        // stop()执行完之后active变为false，也就是说此时是调用了stop的状态
        if (!this.active) {
            return this._fn()
        }

        // 初始化以及没有调用stop()走这块
        shoudleTrack = true
        // 将注册好的副作用函数，赋值给activeEffect
        activeEffect = this;
        const result = this._fn()
        // 执行完fn之后，重置 shoudleTrack
        shoudleTrack = false

        
        return result
    }

    // 在类上定义stop方法，方便后续实例调用
    stop() {
        // 根据单元测试知道，此处需要清除掉对应的effect
        if (this.active) {
            cleanupEffect(this)
            this.onStop && this.onStop()
            this.active = false
        }
        
    }
}

function cleanupEffect(effect) {
    for(let i = 0; i < effect.deps.length; i++) {
        // 循环取出 依赖集合deps
        const deps = effect.deps[i]
        // 将 effectFn 从依赖集合中移除
        deps.delete(effect)
    }
    // 最后需要重置effectFn.deps数组
    effect.deps.length = 0
}

// 副作用函数
export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler)
    // 将传入的options对象的属性全部继承到_effect实例上
    extend(_effect, options)
    
    // 执行副作用函数 目的是触发响应式数据的读取操作，进而触发Proxy的get拦截函数，在其中进行副作用函数的收集
    _effect.run()

    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect

    return runner
}

// 用来判断是否应该执行收集依赖相关的操作
function isTracking() {
    return shoudleTrack && activeEffect !== undefined
}

// 依赖收集 
export function track(target, key) {
    if(!isTracking()) return

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
    if (deps.has(activeEffect)) return;
    deps.add(activeEffect)
    // 将收集到的deps依赖集合，添加到 activeEffect.deps 数组中
    activeEffect.deps.push(deps)
}

// 触发依赖
export function trigger(target, key) {
    // 根据track中的依赖存储方式，取出所有的依赖
    const depsMap = bucket.get(target)
    if (!depsMap) return;
    const deps = depsMap.get(key)

    // 循环执行所有的依赖
    const effectsToRun = new Set(deps)
    effectsToRun && effectsToRun.forEach((effectFn:any) => {
        if (effectFn.scheduler) {
            effectFn.scheduler()
        } else {
            effectFn.run()
        }
    })
}


export function stop(runnner) {
    runnner.effect.stop()
}