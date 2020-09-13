import Model from '../mixins/model.js'

export default Vue.extend({
    mixins: [
        Model('unit', {
            name: '',
            type: 'Enemy',
            initiativeBonus: 0,
            active: true,
            combat: {
                initiative: 0,
                reaction: true,
            },
        }),
    ],
    template: /*html*/`
        <div
            class="unit"
            :data-type="unit.type"
            :class="{inactive: !unit.active}"
        >
            <div
                v-if="!editing"
                class="d-flex description"
            >
                <span @click="$emit('edit')" style="flex: 1">
                    {{ unit.name }}
                    <span v-if="unit.combat.initiative && unit.active" style="color: #989898">
                        [{{ unit.combat.initiative }}]
                    </span>
                </span>
                <label>
                    <input type="checkbox" v-model="unit.combat.reaction" style="margin-right: 5px"> Reaction
                </label>
            </div>
            <div
                v-else
                class="d-flex"
                style="flex-direction: column"
            >
                <label>
                    Name
                    <input type="text" v-model="unit.name">
                </label>
                <label>
                    Initiative bonus
                    <input type="number" v-model="unit.initiativeBonus">
                </label>
                <label>
                    Active
                    <input type="checkbox" v-model="unit.active">
                </label>
                <fieldset>
                    <legend>Unit type</legend>
                    <span v-for="value in ['Player', 'Enemy', 'Friendly NPC']" :key="value">
                        <label>
                            <input
                                type="radio"
                                :value="value"
                                v-model="unit.type"
                            > {{ value }}
                        </label>
                    </span>
                </fieldset>
                <label>
                    Current initiative (optionally override)
                    <input type="number" v-model="unit.combat.initiative">
                </label>
                <button @click="$emit('edit')" style="height: 50px; margin-top: 20px">
                    Save
                </button>
                <button @click="$emit('clone')">
                    Clone
                </button>
                <button @click="$emit('delete')">
                    Delete
                </button>
            </div>
        </div>
    `,
    props: {
        editing: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.focus()
    },
    watch: {
        editing() {
            this.focus()
        },
    },
    methods: {
        focus() {
            if (this.editing) {
                this.$nextTick(() => this.$el.querySelector('input').focus())
            }
        },
        startOfTurn() {
            this.unit.combat.reaction = true
        }
    },
})