// 响应式的本质核心就是 当变量的值改变的时候自动的去更新数据
import {reactive} from '../reactive';
import { effect, stop } from '../effect';
// describe 是一个将多个相关的测试组合到一起的块
describe('effect', () => {
    it('happy path', () => {
        // 使用reactive方法 创建一个响应式对象
        const user = reactive({age: 10})

        // effect 接收一个函数，主要用来处理对象的值变化逻辑，在外部就表现为自动变化
        // effect接收的函数会立即执行
        let nextAge;
        effect(() => {
            nextAge = user.age + 1;
        })
        // 初始化时验证
        expect(nextAge).toBe(11);

        // update时验证
        user.age++;
        expect(nextAge).toBe(12);
    })

    it('effect执行后返回runner', () => {
        //  调用effect之后会返回一个function，
        // 在此调用返回的function之后会执行传给effect的fn函数
        // 并将fn的结果返回
        let foo = 10
        const runner = effect(() => {
            foo++
            return 'foo'
        })
        expect(foo).toBe(11);
        const res = runner()
        expect(foo).toBe(12);
        expect(res).toBe('foo')
    }); 

    it('stop', () => {
        let dummy
        const obj = reactive({ prop: 1 })
        const runner: any = effect(() => {
          dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)
        stop(runner)
        obj.prop = 3
        expect(dummy).toBe(2)
    
        // stopped effect should still be manually callable
        runner()
        expect(dummy).toBe(3)
    })

}); 