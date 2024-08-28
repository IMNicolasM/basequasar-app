import {reactive, toRefs, computed, onMounted} from 'vue';
import {i18n, moment, alert, helper, clone} from 'src/plugins/utils'
import service from './services'
import getName from './getName.vue'
import simpleCard from '../../../_components/simpleCard/index.vue'

const dateFormat = 'YYYY/MM/DD'
const assingRoute = 'apiRoutes.qassignlp.assignments'
const followRoute = 'apiRoutes.qassignlp.followups'
const leadsRoute = 'apiRoutes.qassignlp.leads'

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
    unAssignedData: {},
    columnsSlot: [
      {name: 'slot1', label: i18n.tr('ileads.cms.form.morning'), field: 'slot1', align: 'center', borderColor: '#36d7b7', component: simpleCard},
      {name: 'slot2', label: i18n.tr('ileads.cms.form.afternoon'), field: 'slot2', align: 'center', component: simpleCard, borderColor: '#e08283'},
      {name: 'slot3', label: i18n.tr('ileads.cms.form.lateAfternoon'), field: 'slot3', align: 'center', component: simpleCard, borderColor: '#7bbcf5'},
      {name: 'slot4', label: i18n.tr('ileads.cms.form.evening'), field: 'slot4', align: 'center', component: simpleCard, borderColor: '#a0a0ef'},
    ],
    columns: [
      {name: 'brnId', label: i18n.tr('ileads.cms.form.slrName'), field: 'brnId', align: 'rigth', component: getName}
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
    endMove(e) {
      console.warn(e)
    },
    toggleDynamicFilterModal() {
      state.showDynamicFilterModal = !state.showDynamicFilterModal;
    },
    updateDynamicFilterValues(filters: any) {
      state.dynamicFilterValues = filters;
      methods.getData(false, filters);
    },
    async getData(refresh = false, filter = {}) {
      state.loading = true
      let otherFilters = state.dynamicFilterValues
      const params: any = {
        filter: {...(otherFilters || {}), ...(filter || {}), order: {way: 'asc', field: 'brn_id'}},
        take: 1000
      }

      let total = 0
      let totalMiles = 0
      let leads = [];
      const idsAssigns = [];
      let mappedData = {}

      await Promise.all([
        methods.getAssignedLeads(refresh, params),
        methods.getFollowups(refresh, params),
        methods.getAllLeads(refresh, params)
      ]).then((res: any) => {
        res.forEach(r => {

          if(r.leads) {
            leads = r.leads
          }
          r.data.forEach(a => {
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
            idsAssigns.push(parseInt(a.lead_id))
            mappedData[slrId][`slot${a.slot}`].push(camelCaseResponse)
          })
          total += r.total
        })
      }).catch(e => console.log(e))

      const valuesMap: any = Object.values(mappedData || {})

      const assignedData = valuesMap.sort((a,b) => a.brnId.localeCompare(b.brnId))
      state.assignedData = assignedData
      //state.unAssignedData =
      const unAssigns = leads.filter(l => !idsAssigns.includes(l.id));

      let mappedUnAssigns = {}

      unAssigns.forEach(u => {
        let nameSlot = `slot${u.slot}`
        const camelCaseResponse = helper.snakeToCamelCaseKeys(u)
        if (!mappedUnAssigns[nameSlot]) {
          mappedUnAssigns[nameSlot] = []
        }
        mappedUnAssigns[nameSlot].push(camelCaseResponse)
      })

      console.warn(mappedUnAssigns)
      state.unAssignedData = mappedUnAssigns
      state.totalMiles = totalMiles
      state.totalAssigns = total

      state.loading = false
    },
    getFollowups(refresh, params) {
      return new Promise((resolve, reject) => {
        service.getData(followRoute, refresh, params).then(response => {
          const total = response.meta.page.total

          resolve({data: response.data, total})

        }).catch((e) => {
          alert.error(i18n.tr('isite.cms.message.errorRequest'))
          reject(e)
        });
      })
    },
    getAllLeads(refresh, params) {
      return new Promise((resolve, reject) => {
        service.getData(leadsRoute, refresh, params).then(response => {
          resolve({data: [], total: 0, leads: response.data})

        }).catch((e) => {
          alert.error(i18n.tr('isite.cms.message.errorRequest'))
          reject(e)
        });
      })
    },
    getAssignedLeads(refresh, params) {
      return new Promise((resolve, reject) => {
        service.getData(assingRoute, refresh, params).then(response => {
          const total = response.meta.page.total

          resolve({data: response.data, total})

        }).catch((e) => {
          alert.error(i18n.tr('isite.cms.message.errorRequest'))
          reject(e)
        });
      })
    }
  };

  onMounted(() => {
    state.columns = [
      ...state.columns,
      ...state.columnsSlot
    ]
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods};
}
