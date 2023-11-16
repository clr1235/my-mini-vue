import { reactive } from "../reactive"
import {computed} from '../computed'

describe('computed', () => {
    it('should return updated value', () => {
        const value = reactive({ foo: 1 })
        const cValue = computed(() => value.foo)
        expect(cValue.value).toBe(1)
        value.foo = 2
        expect(cValue.value).toBe(2)
    })


    it('should compute lazily', () => {
        const value = reactive({
            foo: 1
        })
        const getter = jest.fn(() => {
            return value.foo
        })
        const cValue = computed(getter)
        // lazy
        expect(getter).not.toHaveBeenCalled()

        expect(cValue.value).toBe(1)
        expect(getter).toHaveBeenCalledTimes(1)
        // should not compute again
        cValue.value // get
        expect(getter).toHaveBeenCalledTimes(1)

        // 响应式对象的值发生改变时
        value.foo = 2
        expect(getter).toHaveBeenCalledTimes(1)

        expect(cValue.value).toBe(2)
        expect(getter).toHaveBeenCalledTimes(2)

        // 再次读取值时
        cValue.value
        expect(getter).toHaveBeenCalledTimes(2)
    })
})