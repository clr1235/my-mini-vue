import { reactive, isReactive } from "../reactive"

// 测试reactive方法
describe('reactive', () => {
    it('happy path', () => {
        const original = {foo: 1}
        const obj = reactive(original)

        expect(original).not.toBe(obj);

        expect(obj.foo).toBe(1)

        expect(isReactive(obj)).toBe(true)
        expect(isReactive(original)).toBe(false)
    })

    // 嵌套测试
    test('nested reactive', () => {
        const original = {
            nested: {foo: 1},
            array: [{bar: 2}]
        }
        const observed = reactive(original)

        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.array)).toBe(true)
        expect(isReactive(observed.array[0])).toBe(true)
    })
})