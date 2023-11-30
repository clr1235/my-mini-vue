import {h} from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
    setup() {
        

        return {
            
        }
    },

    render() {
        const foo = h('p', {}, 'foo')

        // 在Foo组件内部需要读取到父组件App中的foo变量的h函数创建的vnode的children，并将其渲染.
        // 使用this.$slots实现
        return h('div', {}, [foo, this.$slots])
    }
}

export default Foo