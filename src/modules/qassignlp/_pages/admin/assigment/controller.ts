import {reactive, toRefs, computed} from 'vue';
import { i18n, moment } from 'src/plugins/utils'
const dateFormat = 'YYYY/MM/DD'
export default function controller() {

  // Refs
  const refs = {};

  // States
  const state = reactive({
    excludeActions: ['search'],
    dynamicFilterValues: {},
    dynamicFilterSummary: {},
    showDynamicFilterModal: false,
    apptdateFilter: {
      value: moment().format(dateFormat),
      type: 'date',
      props: {
        label: i18n.tr('ileads.cms.form.apptdate')
      }
    },
    filters: {
      slr_name: {
        value: null,
        type: 'select',
        props: {
          label: i18n.tr('ileads.cms.form.slrName'),
          clearable: true
        },
        loadOptions: {
          apiRoute: 'apiRoutes.qassignlp.employees',
          select: { label: 'name', id: 'id' },
          requestParams: { filter: { active: 1 } }
        }
      }
    },
    requestParams: {
      params: {
        apptdate: moment().format(dateFormat)
      }
    }
  });

  // Computed
  const computeds = {
    getDynamicFilterValues: computed(() => {
      return state.dynamicFilterValues;
    })
  };

  // Methods
  const methods = {
    toggleDynamicFilterModal() {
      state.showDynamicFilterModal = !state.showDynamicFilterModal;
    },
    updateDynamicFilterValues(filters: any) {
      state.dynamicFilterValues = filters;
      methods.getData(false, filters, { page: 1 });
    },
    async getData(refresh = false, filter = {}, pagination: any = false) {

    },
    setDate(newDate: any){
      state.requestParams.params.apptdate = newDate
      state.apptdateFilter.value = newDate

      methods.getData()
    },
    goToPrevious(){
      //prev day
      const apptdate = moment(state.requestParams.params.apptdate)
        .subtract(1, 'days').startOf('day').format(dateFormat)
      methods.setDate(apptdate)
    },
    goToNext(){
      //next day
      const apptdate = moment(state.requestParams.params.apptdate)
        .add(1, 'days').startOf('day').format(dateFormat)
      methods.setDate(apptdate)
    },
    setApptDate(value: any){
      if(value != null){
        const apptdate = moment(value).format(dateFormat)
        if(apptdate != state.requestParams.params.apptdate) methods.setDate(apptdate)
      }
    }
  };

  return {...refs, ...(toRefs(state)), ...computeds, ...methods};
}
