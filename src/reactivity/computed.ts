import { ReactiveEffect } from "./effect"

// 此版本只实现了只读的computed
class ComputedRefImpl {
    private _getter: any
    private dirty = true
    private _value: any
    private _effect: any

    constructor(getter) {
        this._getter = getter
        // 利用effect的shcduler方法
        this._effect = new ReactiveEffect(getter, () => {
            if(!this.dirty) {
                this.dirty = true
            }
        })
    }

    get value() {
        // 当依赖的响应式对象的值发生改变时，需要重新执行返回新的值，此时需要将dirty的值改为true
        if(this.dirty) {
            this.dirty = false
            this._value = this._effect.run()
        }
        return this._value
    }
}


// computed() 接受一个 getter 函数，返回一个只读的响应式 ref 对象。该 ref 通过 .value 暴露 getter 函数的返回值。
// 它也可以接受一个带有 get 和 set 函数的对象来创建一个可写的 ref 对象。
export function computed(getter) {
    return new ComputedRefImpl(getter)
}