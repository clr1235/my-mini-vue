import {h} from '../../lib/guide-mini-vue.esm.js'

export const App = {

    render() {
        return h('div', 'hellow world' + this.msg)
    },

    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}