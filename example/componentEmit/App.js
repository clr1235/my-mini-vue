import {h} from '../../lib/guide-mini-vue.esm.js'

import Foo from './Foo.js'

export const App = {
    name: 'App',
    render() {
        // emit
        return h(
            'div',
            {},
            [
                h('div', {}, 'App'),
                h(Foo, {
                    onAdd(a, b) {
                        console.log('emit onAdd', a, b)
                    },
                    onAddFoo() {
                        console.log('emit onAddFoo')
                    }
                })
            ]
        )
    },

    setup() {
        return {
            
        }
    }
}