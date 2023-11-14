import {trackEffects, triggerEffects, isTracking} from './effect'
import { hasChanged, isObject } from "../shared";
import { reactive } from './reactive';

/**
 * 一个响应式系统由 响应式数据以及自动读取和设置响应式数据的副作用函数组成。
 * 
 * 对比于之前的reactive()的实现可以知道：ref()的响应式也需要调用effect()，
 * 也就意味着需要在ref的get读取时执行track进行依赖收集，在set时执行trigger触发依赖。
 * 在reactive的track实现过程中，target、key、effects是多对多的一一对应关系，
 * 而ref()只有一个 .value 属性，意味着track操作可以精简，将其依赖存储到一个Set类型的deps中即可
 * 
 */ 

// Proxy的代理只针对对象，而ref接收的是一个单值，所以需要通过一个对象进行包裹，内部有一个value属性，
// 此时就可以知道value什么时候get，什么时候set，从而进行依赖的收集和触发
class RefTmpl {
    private _value: any;
    // 一个Set结构的deps，用来收集依赖
    public deps: any;
    // 存储原始的传入的value值，用来做后续的对比
    private originalValue: any
    // 标识实例是不是一个ref
    public __v_isRef = true

    constructor(value) {
        this.originalValue = value
        // 如果value是一个对象的话，需要将其转换为reactive包裹的对象，如果不是的话，直接赋值
        this._value = convert(value)
        this.deps = new Set()
    }

    get value() {
        trackRefValue(this)
        
        return this._value
    }

    set value(newVal) {
        // 对比时使用普通对象进行对比，为了避免
        if (hasChanged(newVal, this.originalValue)) {
            // 先修改值
            this.originalValue = newVal
            this._value = convert(newVal)
            
            triggerEffects(this.deps)
        } 
    }
}
// ref的依赖收集
function trackRefValue(ref:any) {
    if (isTracking()) {
        trackEffects(ref.deps)
    }
}

// 转换值
function convert(value) {
    return isObject(value) ? reactive(value) : value
}


/**
 * vue3官网解释：
 * ref()接受一个内部值，返回一个响应式的、可更改的 ref 对象，此对象只有一个指向其内部值的属性 .value。
 * 
 * 所有对 .value 的操作都将被追踪，并且写操作会触发与之相关的副作用。
 * 如果将一个对象赋值给 ref，那么这个对象将通过 reactive() 转为具有深层次响应式的对象。
 * 这也意味着如果对象中包含了嵌套的 ref，它们将被深层地解包。
 */
export function ref(value) {
    return new RefTmpl(value)
}

// isRef() 检查某个值是否为 ref。
export function isRef(ref) {
    return !!ref.__v_isRef
}
// unRef() 如果参数是一个ref对象，则返回内部值，否则返回参数本身。
export function unRef(ref) {
    return isRef(ref) ? ref.value : ref
}


export function proxyRefs(objectWithRefs) {
    return new Proxy(objectWithRefs, {
        get(target, key) {
            return unRef(Reflect.get(target, key))
        },

        set(target, key, value) {
            // 如果要赋值的属性是一个ref类型，且将要给到的新值不是一个ref类型的话，则修改要赋值的属性的.value属性值
            if(isRef(target[key]) && !isRef(value)) {
                return (target[key].value = value)
            } else {
                return Reflect.set(target, key, value)
            }
        }
    })
}