import {reactive, toRefs, computed} from 'vue';
import {i18n, moment, alert, helper} from 'src/plugins/utils'
import service from './services'
import getName from './getName.vue'

const dateFormat = 'YYYY/MM/DD'
const assingRoute = 'apiRoutes.qassignlp.assignments'

export default function controller() {

  // Refs
  const refs = {};

  // States
  const state = reactive({
    excludeActions: ['search'],
    loading: false,
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
      slr_id: {
        value: null,
        type: 'select',
        props: {
          label: i18n.tr('ileads.cms.form.slrName'),
          clearable: true
        },
        loadOptions: {
          apiRoute: 'apiRoutes.qassignlp.employees',
          select: {label: 'name', id: 'id'},
          requestParams: {filter: {active: 1}}
        }
      },
      brn_id: {
        value: 'ALL',
        type: 'select',
        quickFilter: true,
        props: {
          label: i18n.tr('ileads.cms.form.slrName'),
          options: [
            { label: '-- ALL --', value: 'ALL' }
          ]
        },
        loadOptions: {
          apiRoute: 'apiRoutes.qassignlp.branches',
          select: {label: 'LongName', id: 'ShortName'}
        }
      }
    },
    requestParams: {
      params: {
        apptdate: moment().format(dateFormat)
      }
    },
    assignedData: [],
    columns: [
      {name: 'brnId', label: i18n.tr('ileads.cms.form.slrName'), field: 'brnId', align: 'rigth', component: getName},
      {name: 'slot1', label: i18n.tr('ileads.cms.form.morning'), field: 'slot1', align: 'center', draggable: true, borderColor: '#36d7b7'},
      {name: 'slot2', label: i18n.tr('ileads.cms.form.afternoon'), field: 'slot2', align: 'center', draggable: true, borderColor: '#e08283'},
      {name: 'slot3', label: i18n.tr('ileads.cms.form.lateAfternoon'), field: 'slot3', align: 'center', draggable: true, borderColor: '#7bbcf5'},
      {name: 'slot4', label: i18n.tr('ileads.cms.form.evening'), field: 'slot4', align: 'center', draggable: true, borderColor: '#a0a0ef'},
    ]
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
      methods.getData(false, filters, {page: 1});
    },
    async getData(refresh = false, filter = {}, pagination: any = false) {
      state.loading = true
      let otherFilters = state.dynamicFilterValues
      const params = {
        filter: {...(otherFilters || {}), ...(filter || {}), ...state.requestParams.params, order: {way: 'asc', field: 'brn_id'}},
        take: 1000
      }

      await service.getData(assingRoute, refresh, params).then(response => {
        const mappedData: any = {};

        response.data.forEach(a => {
          const slrId = a.slr_id

          const camelCaseResponse = helper.snakeToCamelCaseKeys(a)

          if (!mappedData[slrId]) {
            mappedData[slrId] = {
              slrName: a.slr_name,
              brnId: a.brn_id,
              slot1: [],
              slot2: [],
              slot3: [],
              slot4: []
            }
          }

          mappedData[slrId][`slot${a.slot}`].push(camelCaseResponse)
        })

        const valuesMap: any = Object.values(mappedData || {})

        state.assignedData = valuesMap.sort((a,b) => a.brnId.localeCompare(b.brnId))

      }).catch(() => {
        alert.error(i18n.tr('isite.cms.message.errorRequest'))
      });

      state.loading = false
    },
    setDate(newDate: any) {
      state.requestParams.params.apptdate = newDate
      state.apptdateFilter.value = newDate

      methods.getData()
    },
    goToPrevious() {
      //prev day
      const apptdate = moment(state.requestParams.params.apptdate)
        .subtract(1, 'days').startOf('day').format(dateFormat)
      methods.setDate(apptdate)
    },
    goToNext() {
      //next day
      const apptdate = moment(state.requestParams.params.apptdate)
        .add(1, 'days').startOf('day').format(dateFormat)
      methods.setDate(apptdate)
    },
    setApptDate(value: any) {
      if (value != null) {
        const apptdate = moment(value).format(dateFormat)
        if (apptdate != state.requestParams.params.apptdate) methods.setDate(apptdate)
      }
    }
  };

  return {...refs, ...(toRefs(state)), ...computeds, ...methods};
}
