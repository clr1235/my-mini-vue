import {extend} from './shared'

let activeEffect:any;
class ReactiveEffect {
    deps = []
    active = true
    private _fn:any;
    onStop?: () => void;
    constructor(fn: any, public scheduler?:any) {
        this._fn = fn;
    }
    run() {
        // 将实例绑定到全局变量activeEffect上，以便其它地方可以使用
        activeEffect = this;
        // 执行传入的fn
        return this._fn();
    }
    stop() {
        // 使用active变量进行优化
        if (this.active) {
            cleanupEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}

export function cleanupEffect(effect:any) {
    const {deps} = effect;
    if (deps.length) {
        for(let i = 0; i < deps.length; i++) {
            deps[i].delete(effect)
        }
        deps.length = 0
    }
}

export function effect(fn: any, options: any = {}) {
    const scheduler = options?.scheduler;
    // 立即执行传入的fn，采用一个抽离的思想将fn传入ReactiveEffect类中，
    // 通过实例去调用
    const _effect = new ReactiveEffect(fn, scheduler)
    // 将options中的变量   合并到_effect对象上
    extend(_effect, options);

    _effect.run();
    // effect执行之后返回runner方法, run方法中涉及到了this的指向问题，所以此处需bind绑定
    const runner: any = _effect.run.bind(_effect)
    // 绑定effect 方便后续的stop中传入的runner可以调用到stop方法
    runner.effect = _effect
    return runner;
}

// 依赖收集
// 原始对象target，操作的属性key，以及副作用函数effectFn三者之间的关系
// WeakMap 的键是原始对象 target，WeakMap 的值是一个Map 实例，
// 而 Map 的键是原始对象 target 的 key，Map 的值是一个由副作用函数组成的 Set。
let targetMap = new WeakMap();
export function track(target: any, key: any) {
    // 三者的依赖关系 target ==> key ==> dep
    let depsMap = targetMap.get(target);
    if(!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap)
    }   

    // 依赖dep采用Set结构，保证其唯一性
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    if (!activeEffect) return;
    // 将依赖收集到Set结构中，收集的也就是传入effect的fn，也就是抽象出来的ReactiveEffect类的实例
    dep.add(activeEffect)
    // 将dep反向存储在activeEffect对象的deps数组中
    activeEffect?.deps.push(dep)
}

// 触发依赖
export function trigger(target:any, key:any) {
    // 拿到所有存储的依赖dep
    const depsMap = targetMap.get(target);
    const dep = depsMap.get(key);

    // 循环去执行
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
        
    }
}

// stop
export function stop(runner: any) {
    runner.effect.stop()
}

