const makeMixin = (key, initial) => Vue.extend({
    model: {
        prop: key,
    },
    props: {
        [key]: {
            type: Object,
            default: () => R.clone(initial)
        }
    },
    watch: {
        [key]: {
            deep: true,
            handler(value) {
                this.$emit('input', value)
            }
        }
    }
})

export default makeMixin