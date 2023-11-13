import { readonly } from "../reactive";

// 测试readonly方法，根据vue3的api知道，readonly方法跟reactive方法类似，唯一不同的是readonly返回一个只读的代理对象
describe('readonly', () => {
    it('happy path', () => {
        const original = {foo: 1, bar: {baz: 2}}
        const obj = readonly(original)

        expect(original).not.toBe(obj);

        expect(obj.foo).toBe(1)
    })
})