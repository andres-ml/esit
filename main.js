import TheTracker from './components/the-tracker.js'

Vue.filter('clearNull', value => value === null ? undefined : value)

export default new Vue({
    components: {
        TheTracker
    },
    template: /*html*/`
        <div>
            <the-tracker v-model="state"/>
        </div>
    `,
    data() {
        const json = localStorage.getItem('esit.state')
        const state = json ? JSON.parse(json) : undefined
        return { state }
    },
    watch: {
        state: {
            deep: true,
            handler(value) {
                localStorage.setItem('esit.state', JSON.stringify(value))
            }
        },
    },
})