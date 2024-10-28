import {reactive, computed} from 'vue'
import { cache, store } from '../../plugins/utils';
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
  },
  async setCompanySelected() {
    let selectedCompanyId = state.companySelected;
    if (selectedCompanyId) return selectedCompanyId

    if(!selectedCompanyId) selectedCompanyId = await cache.get.item('renuitySelectedCompany');
    //@ts-ignore
    const userData = store.state.quserAuth.userData
    const companies = userData?.options?.companyAssigned || []

    if(companies.length && !selectedCompanyId || !companies.includes(selectedCompanyId?.toString())) {
      selectedCompanyId = companies[0];
      await cache.set('renuitySelectedCompany', selectedCompanyId);
    }

    state.companySelected = selectedCompanyId
    return selectedCompanyId
  }
})).value
