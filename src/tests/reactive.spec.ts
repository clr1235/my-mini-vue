import {reactive, isReactive} from '../reactive';

describe('reactive', () => {
    it('happy path', () => {
        const original = {foo: 1};
        // 创建一个响应式对象
        const observed = reactive(original);
        expect(observed).not.toBe(original);
        expect(observed.foo).toBe(1);
        expect(isReactive(observed)).toBe(true);
    })
});