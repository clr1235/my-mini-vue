import { reactive } from "../reactive";
import {effect, stop} from '../effect'

// 副作用函数 测试用例
describe('effect', () => {
    it('happy path', () => {
        const user = reactive({age: 10})

        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        })

        expect(nextAge).toBe(11)

        // update
        user.age++
        expect(nextAge).toBe(12)
        
    })

    it('调用effect时return 一个runner', () => {
        let foo = 10
        const runner = effect(() => {
            foo++;
            return "foo"
        })
        // 验证effect
        expect(foo).toBe(11)
        
        const res = runner()
        // 验证effect正确执行
        expect(foo).toBe(12)
        // 验证effect 返回值 runner能否正确执行并返回传入的fn的返回值
        expect(res).toBe('foo')
    })

    // vue3 schduler的单测
    it('scheduler', () => {
        /**
         * 1. 通过effect的第二个参数给定一个schduler的函数
         * 2. 当 effect 第一次执行的时候，会执行第一个参数 fn
         * 3. 当响应式对象set 即update时，不会执行fn，而是执行schduler
         * 4. 如果当执行runner的时候，会再次执行fn
         */
        let dummy;
        let run: any;
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({foo: 1})
        const runner = effect(() => {
            dummy = obj.foo
        }, {scheduler})

        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        // should be called on first trigger
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)

        expect(dummy).toBe(1)

        run()

        expect(dummy).toBe(2)
    })

    it('stop', () => {
        let dummy;
        const obj = reactive({prop: 1})
        const runner = effect(() => {
            dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)
        stop(runner)
        // obj.prop = 3 // 只触发set操作
        // ++会同时触发get和set操作，而我们stop方法中对执行了cleanupEffect对依赖进行了清理，如果此处触发get的话会执行track进行依赖收集，
        // 那么我们在stop中对依赖进行的清理就是白做了，在后续set的时候触发并执行依赖，所以此时会测试不通过
        obj.prop++  
        // 调用stop方法之后，响应式数据不再更新，也就说调用stop之后不需要执行对应的effect
        expect(dummy).toBe(2)
        // 调用runner之后 值更新
        runner()
        expect(dummy).toBe(3)
    })

    it('onStop', () => {
        const obj = reactive({
            foo: 1
        })
        let dummy
        const onStop = jest.fn()
        const runner = effect(() => {
            dummy = obj.doo
        }, {onStop})
        // 执行stop方法之后，期望onStop方法会被调用一次
        stop(runner)
        expect(onStop).toBeCalledTimes(1)
    })
})