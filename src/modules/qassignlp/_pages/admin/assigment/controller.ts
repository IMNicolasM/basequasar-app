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
    totalAssigns: 0,
    totalMiles: 0,
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
          select: {label: item => `${item.LastName}, ${item.FirstName}`, id: 'id'},
          requestParams: {filter: {active: 1, salesrep: 1}}
        }
      },
      brn_id: {
        value: 'ALL',
        type: 'select',
        quickFilter: true,
        props: {
          label: i18n.tr('ileads.cms.form.brnId'),
          options: [
            { label: '-- ALL --', value: 'ALL' }
          ]
        },
        loadOptions: {
          apiRoute: 'apiRoutes.qassignlp.branches',
          select: {label: 'ShortName', id: 'ShortName'} //{label: 'LongName', id: 'ShortName'}
        }
      },
      apptdate: {
        value: moment().format(dateFormat),
        type: 'date',
        quickFilter: true,
        quickNavigation: true,
        props: {
          label: i18n.tr('ileads.cms.form.apptdate')
        }
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
        filter: {...(otherFilters || {}), ...(filter || {}), order: {way: 'asc', field: 'brn_id'}},
        take: 1000
      }

      let totalMiles = 0;

      await service.getData(assingRoute, refresh, params).then(response => {
        const mappedData: any = {};

        state.totalAssigns = response.meta.page.total

        response.data.forEach(a => {
          const slrId = a.slr_id

          const camelCaseResponse = helper.snakeToCamelCaseKeys(a)

          totalMiles += parseInt(a.distance || 0)

          if (!mappedData[slrId]) {
            mappedData[slrId] = {
              slrName: a.slr_name,
              slrBrn: a.sal_brn,
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

        state.totalMiles = totalMiles

      }).catch(() => {
        alert.error(i18n.tr('isite.cms.message.errorRequest'))
      });

      state.loading = false
    }
  };

  return {...refs, ...(toRefs(state)), ...computeds, ...methods};
}
