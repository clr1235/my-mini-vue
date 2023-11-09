import { reactive } from "../reactive"

// 测试reactive方法
describe('reactive', () => {
    it('happy path', () => {
        const original = {foo: 1}
        const obj = reactive(original)

        expect(original).not.toBe(obj);

        expect(obj.foo).toBe(1)
    })
})