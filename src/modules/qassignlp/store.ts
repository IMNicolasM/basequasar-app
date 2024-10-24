import {reactive, computed} from 'vue'
interface StateProps {
  companySelected: number
}
const state = reactive<StateProps>({
  companySelected: null
})

export default computed(() => ({
  get companySelected() {
    return state.companySelected
  },
  set companySelected(val) {
    state.companySelected = val
  }
})).value
