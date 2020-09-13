import AUnit from './a-unit.js'
import Model from '../mixins/model.js'

export default Vue.extend({
    mixins: [
        Model('state', {
            units: [],
            combatIndex: undefined,
        })
    ],
    components: {
        AUnit
    },
    data() {
        return {
            editIndex: undefined,
        }
    },
    template: /*html*/`
        <div>
            <div class="combat">
                <div
                    v-for="(unit, index) in sortedUnits" :key="unit.index"
                    class="d-flex"
                >
                    <span style="flex: 0 0 30px; padding: 5px">
                        <div v-if="state.combatIndex === index" class="combat-active"/>
                    </span>
                    <a-unit
                        ref="units"
                        :unit="state.units[unit.index] | clearNull"
                        :editing="unit.index === editIndex"
                        style="flex: 1"
                        @input="value => updateUnit(unit.index, value)"
                        @edit="editUnit(unit.index)"
                        @clone="cloneUnit(unit.index)"
                        @delete="deleteUnit(unit.index)"
                    />
                </div>
                <i v-if="state.units.length === 0">
                    No characters have been added yet
                </i>
                <button v-if="state.combatIndex !== undefined" @click="finishTurn" class="btn-block" style="margin: 5px 0 10px 0">
                    Next turn
                </button>
            </div>
            <button v-if="state.units.length > 1" @click="roll" class="btn-block">
                Roll initiative
            </button>
            <button @click="() => addUnit()" class="btn-block">
                + Add unit
            </button>
            <div v-if="state.units.length > 0"  class="d-flex" style="margin-top: 10px">
                <button @click="clear(['Enemy'])" style="flex: 1">
                    Clear Non-player characters
                </button>
                <button @click="clear()" style="flex: 1">
                    Clear all characters
                </button>
            </div>
        </div>
    `,
    computed: {
        sortedUnits() {
            const withIndex = this.state.units.map((unit, index) => ({...unit, index: index}))
            return R.sortBy(unit => unit?.active ? -unit?.combat?.initiative : 1, withIndex)
        },
        combatUnits() {
            return this.sortedUnits.filter(unit => unit?.active)
        }
    },
    methods: {
        roll() {
            const cache = {}
            this.state.units.forEach(unit => {
                if (cache[unit.name] === undefined) {
                    cache[unit.name] = Math.floor(Math.random() * 20) + 1
                }
                unit.combat.initiative = cache[unit.name] + parseInt(unit.initiativeBonus)
            })
            this.state.combatIndex = 0
        },
        finishTurn() {
            this.state.combatIndex += 1
            this.state.combatIndex %= this.combatUnits.length
            this.$refs.units[this.state.combatIndex].startOfTurn()
        },
        addUnit(template = undefined) {
            this.state.units.push(template ? R.clone(template) : undefined)
            this.editUnit(this.state.units.length - 1)
        },
        updateUnit(index, value) {
            this.$set(this.state.units, index, value)
        },
        cloneUnit(index) {
            this.addUnit(this.state.units[index])
        },
        editUnit(index) {
            this.editIndex = this.editIndex === index ? undefined : index
        },
        deleteUnit(index) {
            this.state.units.splice(index)
            this.editIndex -= 1
        },
        clear(types = undefined) {
            this.state.combatIndex = undefined
            this.editIndex = undefined
            this.state.units = this.state.units.filter(unit => types !== undefined && types.indexOf(unit.type) === -1)
        },
    },
})