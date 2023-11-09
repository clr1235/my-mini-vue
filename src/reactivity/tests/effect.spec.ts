import { reactive } from "../reactive";
import {effect} from '../effect'

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
})