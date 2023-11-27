import {h} from '../../lib/guide-mini-vue.esm.js'

export const App = {

    render() {
        return h(
            'div', 
            {
                id: 'root',
                class: ['red', 'hard']
            }, 
            // 此时读取this.msg会在页面上显示undefined，要想读取到可以使用代理对象进行实现
            `hi ${this.msg}`
            // string类型 
            // 'hi hello world'

            // array类型
            // [h('p', {class:'red'}, 'hi'), h('span', {class: 'bule'}, 'world')]
        )
    },

    setup() {
        return {
            msg: 'mini-vue 哈哈'
        }
    }
}