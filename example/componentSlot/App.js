import {h} from '../../lib/guide-mini-vue.esm.js'

import Foo from './Foo.js'

export const App = {
    name: 'App',
    render() {
        // slot
        const app = h('div', {}, 'app')
        // 该h函数的children需要渲染在子组件Foo中
        const foo = h(Foo, {}, h('p', {}, 'app中写入的slot数据'))


        return h('div', {}, [app, foo])
    },

    setup() {
        return {
            
        }
    }
}