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