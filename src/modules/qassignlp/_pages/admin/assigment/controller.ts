import {reactive, toRefs, computed, onMounted} from 'vue';
import {i18n, moment, alert, helper, clone} from 'src/plugins/utils'
import service from './services'
import getName from './getName.vue'
import simpleCard from '../../../_components/simpleCard/index.vue'

const dateFormat = 'YYYY/MM/DD'
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
      let otherFilters: any = state.dynamicFilterValues
      const params: any = {
        filter: {...(otherFilters || {}), ...(filter || {}), order: {way: 'asc', field: 'brn_id'}},
        take: 1000
      }

      const filterBrn = otherFilters.brn_id

      let total = 0
      let totalMiles = 0
      let leads = [];
      const idsAssigns = [];
      let mappedData = {}

      await Promise.all([
        service.getData('apiRoutes.qassignlp.employees', refresh, params),
        service.getData('apiRoutes.qassignlp.leads', refresh, params),
        service.getData('apiRoutes.qassignlp.assignments', refresh, params)
      ]).then(([employees, leadsResponse, assignments]) => {
        //console.warn(employees, leads, assignments)
        const emps = employees.data
        leads = leadsResponse.data
        const assigns = assignments.data

        const initializeMappedData = (id, name = '', brnId = '') => ({
          slrId: id,
          slrName: name,
          brnId,
          ...methods.initializeSlots(),
        });

        for (const assign of assigns) {
          const { slr_id, lead_id, slot, distance } = assign;

          if (!mappedData[slr_id]) {
            mappedData[slr_id] = initializeMappedData(slr_id);
          }

          const findLead = leads.find(l => l.id == lead_id);
          if (!findLead) {
            alert.warning(`Not found lead with ID: ${lead_id}`);
            continue;
          }

          totalMiles += parseInt(distance || 0);
          idsAssigns.push(parseInt(lead_id));

          mappedData[slr_id][`slot${slot}`].data.push(helper.snakeToCamelCaseKeys(findLead));
        }

        for (const emp of emps) {
          const { id, FirstName, LastName, brn_id, tms_id } = emp;

          if (filterBrn !== 'ALL' && (filterBrn !== brn_id && !mappedData[id])) continue;

          if (!mappedData[id]) {
            mappedData[id] = initializeMappedData(id, `${LastName}, ${FirstName}`, brn_id);
          }

          if (filterBrn !== 'ALL' && mappedData[id]) {
            mappedData[id].slrName = `${LastName}, ${FirstName}`;
            mappedData[id].brnId = brn_id;
          }

          mappedData[id][`slot${tms_id}`].active = true;
        }

        total += assignments?.meta?.page?.total || 0
      }).catch(e => {
        alert.error(i18n.tr('isite.cms.message.errorRequest'))
        console.error(e)
      })

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

      state.unAssignedData = mappedUnAssigns
      state.totalMiles = totalMiles
      state.totalAssigns = total

      state.loading = false
    },
    mappedDataToKanban(data: any) {

    },
    initializeSlots() {
      return {
        slot1: { active: false, data: [] },
        slot2: { active: false, data: [] },
        slot3: { active: false, data: [] },
        slot4: { active: false, data: [] },
      }
    }
  };

  onMounted(() => {
    const slotColumns = []

    for (const slotColumn of state.columnsSlot) {
      const column: any = clone(slotColumn)

      delete column.component
      slotColumns.push({...column, draggable: true})
    }

    state.columns = [
      ...state.columns,
      ...slotColumns
    ]
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods};
}
