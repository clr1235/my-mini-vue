import {h} from '../../lib/guide-mini-vue.esm.js'

export const App = {

    render() {
        return h('div', {
            id: 'root',
            class: ['red', 'hard']
        }, 
        // string类型 
        // 'hi hello world'

        // array类型
        [h('p', {class:'red'}, 'hi'), h('span', {class: 'bule'}, 'world')]
        )
    },

    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}