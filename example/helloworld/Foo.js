import {h} from '../../lib/guide-mini-vue.esm.js'

export const Foo = {
    setup(props) {
        // 1. 在setup中接收到props
        // 2. 在render中可以使用this. 访问到props的key值
        // 3. props是只读的、不允许修改其值

        console.log(props, 'psosp=====')
        props.count++
    },

    render() {
        return h('div', {}, `foo: ${this.count}`)
    }
}

export default Foo