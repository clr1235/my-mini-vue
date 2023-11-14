import { isReadonly, readonly, isProxy } from "../reactive";

// 测试readonly方法，根据vue3的api知道，readonly方法跟reactive方法类似，唯一不同的是readonly返回一个只读的代理对象
describe('readonly', () => {
    it('happy path', () => {
        const original = {foo: 1, bar: {baz: 2}}
        const obj = readonly(original)

        expect(original).not.toBe(obj);

        expect(obj.foo).toBe(1)

        expect(isReadonly(obj)).toBe(true)
        expect(isReadonly(original)).toBe(false)
        // 嵌套测试
        expect(isReadonly(obj.bar)).toBe(true)

        // isProxy
        expect(isProxy(obj)).toBe(true)
    })

    it('should call console.warn when set', () => {
        console.warn = jest.fn()
        const user = readonly({
            age: 10
        })
        user.age = 11
        expect(console.warn).toHaveBeenCalled()
    })
})