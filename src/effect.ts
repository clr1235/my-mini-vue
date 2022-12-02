class ReactiveEffect {
    private _fn:any;
    constructor(fn: any, public scheduler?:any) {
        this._fn = fn;
    }
    run() {
        // 将实例绑定到全局变量activeEffect上，以便其它地方可以使用
        activeEffect = this;
        // 执行传入的fn
        return this._fn();
    }
}

let activeEffect:any;
export function effect(fn: any, options: any = {}) {
    const scheduler = options?.scheduler;
    // 立即执行传入的fn，采用一个抽离的思想将fn传入ReactiveEffect类中，
    // 通过实例去调用
    const _effect = new ReactiveEffect(fn, scheduler)
    _effect.run();
    // effect执行之后返回runner方法
    return _effect.run.bind(_effect);
}

// 依赖收集
// 创建全局的targetMaps，保存target、key、dep三者的指向关系，方便后续触发依赖时取值
let targetMaps = new Map();
export function track(target: any, key: any) {
    // 三者的依赖关系 target ==> key ==> dep
    let depsMap = targetMaps.get(target);
    if(!depsMap) {
        depsMap = new Map();
        targetMaps.set(target, depsMap)
    }   

    // 依赖dep采用Set结构，保证其唯一性
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    // 将依赖收集到Set结构中，收集的也就是传入effect的fn，也就是抽象出来的ReactiveEffect类的实例
    dep.add(activeEffect)
}

// 触发依赖
export function trigger(target:any, key:any) {
    // 拿到所有存储的依赖dep
    const depsMap = targetMaps.get(target);
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