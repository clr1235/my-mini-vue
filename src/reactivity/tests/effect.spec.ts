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
})