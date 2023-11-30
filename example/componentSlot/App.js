import {h} from '../../lib/guide-mini-vue.esm.js'

import Foo from './Foo.js'

export const App = {
    name: 'App',
    render() {
        // slot
        const app = h('div', {}, 'app')
        // 该h函数的children需要渲染在子组件Foo中
        // const foo = h(Foo, {}, [
        //     h('p', {}, 'app中写入的slot数据'),
        //     h('p', {}, '父组件app中要往子组件Foo中写入的数据')
        // ])


        // 具名插槽
        const foo = h(Foo, {}, {
            header: h('p', {}, 'header'),
            footer: h('p', {}, 'footer')
        })


        return h('div', {}, [app, foo])
    },

    setup() {
        return {
            
        }
    }
}