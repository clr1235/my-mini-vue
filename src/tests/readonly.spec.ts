import {isReadonly, readonly} from '../reactive'
describe('readonly', () => {
    it('happy path', () => {
        const original = {foo: 1, bar: {bar:2}};
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);

        // 验证一个对象是 isReactive 还是 isReadonly
        expect(isReadonly(original)).toBe(false);
        expect(isReadonly(wrapped)).toBe(true);
    })

    it('当调用set的时候，发出警告', () => {
        // jest.fn() 创建一个模拟函数，返回一个新的未使用的模拟函数
        console.warn = jest.fn();
        const user = readonly({
            age: 10
        })
        user.age = 11
        expect(console.warn).toBeCalled()
    })

    
})