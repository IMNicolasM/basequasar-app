import {reactive, toRefs, computed, onMounted, watch} from 'vue';
import {i18n, moment, alert, helper, clone} from 'src/plugins/utils'
import service from './services'
import getName from './getName.vue'
import simpleCard from '../../../_components/simpleCard/index.vue'
import assign from '../../../_components/assigns/index.vue'

const dateFormat = 'YYYY/MM/DD'

export default function controller() {

  // Refs
  const refs = {};

  // States
  const state = reactive({
    excludeActions: ['search', 'sync', 'export', 'recommendations'],
    loading: false,
    isRuningReCalc: false,
    dynamicFilterValues: {},
    dynamicFilterSummary: {},
    showDynamicFilterModal: false,
    totalAssigns: 0,
    totalMiles: 0,
    filters: {
      brn_id: {
        value: 'ALL',
        type: 'select',
        quickFilter: true,
        props: {
          sortOptions: false,
          label: i18n.tr('ileads.cms.form.brnId'),
          options: [
            {label: 'ALL', value: 'ALL'}
          ]
        },
        loadOptions: {
          apiRoute: 'apiRoutes.qassignlp.branches',
          select: {label: 'label', id: 'value'}
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
    filtersUnassign: {},
    assignedData: [],
    employees: [],
    unMappedAssignedData: [],
    unAssignedData: {},
    allUnAssign: {},
    columnsSlot: [
      {
        name: 'slot1',
        label: i18n.tr('ileads.cms.form.morning'),
        field: 'slot1',
        align: 'center',
        // borderColor: '#D1FAE5',
        style: { backgroundColor: '#D1FAE5'},
        component: simpleCard
      },
      {
        name: 'slot2',
        label: i18n.tr('ileads.cms.form.afternoon'),
        field: 'slot2',
        align: 'center',
        component: simpleCard,
        style: { backgroundColor: '#FECACA'},
        // borderColor: '#FECACA'
      },
      {
        name: 'slot3',
        label: i18n.tr('ileads.cms.form.lateAfternoon'),
        field: 'slot3',
        align: 'center',
        component: simpleCard,
        style: { backgroundColor: '#DBEAFE'}
        // borderColor: '#DBEAFE'
      },
      {
        name: 'slot4',
        label: i18n.tr('ileads.cms.form.evening'),
        field: 'slot4',
        align: 'center',
        component: simpleCard,
        // borderColor: '#EDE9FE',
        style: { backgroundColor: '#EDE9FE'}
      },
    ],
    columns: [
      {
        name: 'brnId',
        label: i18n.tr('ileads.cms.form.slrName'),
        field: 'brnId',
        align: 'rigth',
        component: getName,
        class: 'dense-column'
      }
    ],
    fieldsUnAssign: {
      brnId: {
        value: 'ALL',
        type: 'select',
        props: {
          sortOptions: false,
          label: i18n.tr('ileads.cms.form.brnId'),
          options: [
            {label: 'ALL', value: 'ALL'}
          ]
        },
        loadOptions: {
          apiRoute: 'apiRoutes.qassignlp.branches',
          select: {label: 'label', id: 'value'}
        }
      },
      dspId: {
        value: 'ALL',
        type: 'select',
        props: {
          label: i18n.tr('ileads.cms.form.dspId'),
          options: [
            {label: '-- ALL --', value: 'ALL'}
          ]
        },
        loadOptions: {
          apiRoute: 'apiRoutes.qassignlp.disposition',
          select: {label: 'descr', id: 'descr'},
          requestParams: {filter: {active: 1}}
        }
      },
      rnkId: {
        value: 'ALL',
        type: 'select',
        props: {
          label: i18n.tr('ileads.cms.form.rnkId'),
          options: [
            {label: '-- ALL --', value: 'ALL'}
          ]
        },
        loadOptions: {
          apiRoute: 'apiRoutes.qassignlp.rank',
          select: {label: 'descr', id: 'id'},
          requestParams: {filter: {active: true}}
        }
      },
    },
    openForm: false

  });

  // Computed
  const computeds = {
    getDynamicFilterValues: computed(() => {
      return state.dynamicFilterValues;
    }),
    pageActions: computed(() => {
      const date = state.dynamicFilterValues.apptdate;
      const tomorrow = moment().add(1, 'days').startOf('day');
      const apptDate = moment(date);

      return [
        {
          label: i18n.tr('ileads.cms.messages.reassign'),
          vIf: apptDate.isSameOrAfter(tomorrow) && !state.isRuningReCalc,
          props: {
            icon: 'fa-light fa-shuffle',
            label: i18n.tr('ileads.cms.messages.reassign'),
            round: false,
            rounded: true,
            padding: 'xs md',
            color: 'green'
          },
          action: () => methods.reCalc(date)
        },
        {
          label: i18n.tr('isite.cms.label.setup'),
          props: {
            icon: 'fa-light fa-gear'
          },
          action: () => methods.openSetupForm()
        },
      ];
    }),
  };

  // Methods
  const methods = {
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

      let leads = [];
      let idsAssigns = [];

      let recalcLoading = false


      await service.getData('apiRoutes.qassignlp.progress', refresh, {apptdate: params.filter.apptdate})
        .then(res => {
          if(res.data.is_runing == true)  recalcLoading = true
          else state.isRuningReCalc = false
        })
        .catch(e => {
          recalcLoading = true
          alert.error(e.response.data.message || "The AutoAssigner is running now")
        })

      if (recalcLoading) {
        state.isRuningReCalc = true
        alert.error("The AutoAssigner is running yet. Please Refresh before some time")
        state.unMappedAssignedData = []
        state.employees = []
        state.allUnAssign = {}
        return
      }

      await Promise.all([
        service.getData('apiRoutes.qassignlp.employees', refresh, params),
        service.getData('apiRoutes.qassignlp.leads', refresh, params),
        service.getData('apiRoutes.qassignlp.assignments', refresh, params)
      ]).then(async ([employees, leadsResponse, assignments]) => {
        state.employees = employees.data
        leads = leadsResponse.data
        const assigns = assignments.data

        let followups = leads.filter(l => l.is_follow_up)
        const mappedAssigneds = assigns.map(a => {
          const findLead = leads.find(l => l.id == a.lead_id)
          const slr_id = a.priority_score >= 0 ? a.slr_id : findLead?.slr_id

          return {...(findLead || {}), slr_id, distance: a.distance || 0, priority_score: a.priority_score, ld_id: a.lead_id}
        });


        const assigneds = mappedAssigneds.filter(l => l.id && l.slr_id > 0)
        const asdasassigneds = mappedAssigneds.filter(l => !l.id)
        console.warn({asdasassigneds})
        if (followups.length) {
          await service.bulkCalculateDist({followups, assigneds}).then((res) => {
            const data = res.data

            followups = followups.map(follow => {
              const findFollow = data.find(f => f.id == follow.id)
              return {...follow, distance: findFollow?.distance || 0}
            })
          })
        }

        const allAssigns = [...assigneds, ...followups]
        idsAssigns = allAssigns.map(l => l.id)

        state.unMappedAssignedData = allAssigns;

        methods.mappedAssigns(allAssigns, otherFilters)
      }).catch(e => {
        alert.error(i18n.tr('isite.cms.message.errorRequest'))
        console.error(e)
      })
      const unAssigns = leads.filter(l => !idsAssigns.includes(l.id));
      let mappedUnAssigns = {}

      unAssigns.forEach(u => {
        let nameSlot = `slot${u.slot}`
        const camelCaseResponse = helper.snakeToCamelCaseKeys(u)

        if (!mappedUnAssigns[nameSlot]) mappedUnAssigns[nameSlot] = []

        mappedUnAssigns[nameSlot].push(camelCaseResponse)
      })

      state.allUnAssign = mappedUnAssigns
      state.loading = false
    },
    filterUnAssign() {
      const filteredUnAssign: any = {}
      const filters = state.filtersUnassign;
      const unassign = state.allUnAssign;

      if (!filters || !unassign) {
        state.unAssignedData = unassign || {};
        return;
      }

      for (const uKey in unassign) {
        const res = unassign[uKey];

        // AND FILTERS
        const filteredRes = res.filter(item => {
          return Object.keys(filters).every(key => {
            let value = filters[key];
            if (value === 'ALL') return true
            if (key == 'brnId') {
              value = value.split(',')
              return value.includes(item[key])
            }
            return item[key] == value;
          });
        });

        filteredUnAssign[uKey] = filteredRes;
      }

      state.unAssignedData = filteredUnAssign
    },
    initializeMappedData(id, name = '', brnId = '') {
      return {
        slrId: id,
        slrName: name,
        brnId,
        ...methods.initializeSlots(),
      }
    },
    initializeSlots() {
      return {
        slot1: {active: false, data: []},
        slot2: {active: false, data: []},
        slot3: {active: false, data: []},
        slot4: {active: false, data: []},
      }
    },
    openSetupForm() {
      state.openForm = true
    },
    async moveDrag({evt, row, kanban}) {
      if (!evt) return
      const {added} = evt;

      const leadId = added?.element.id;
      const slot = added?.element.slot;
      const index = added?.newIndex;
      const element = added?.element

      if (kanban == 'unassign') {
        if (leadId && index >= 0) {
          state.unAssignedData[`slot${slot}`][index] = {
            ...element,
            distance: null,
            slrId: null
          };

          state.unMappedAssignedData = state.unMappedAssignedData.filter(l => l.id !== leadId)
        }
        return
      }

      if (leadId && index >= 0) {
        const body = {
          leadId,
          slrId: row.slrId,
          slot,
          rowInfo: row
        }

        const leadIndex = state.assignedData.findIndex(l => l.slrId == row.slrId)

        await service.calculateAndUpdate(body).then(r => {
          if (r.distance) {
            state.assignedData[leadIndex][`slot${slot}`].data[index].distance = r.distance
            state.unMappedAssignedData = [
              ...state.unMappedAssignedData,
              {...element, slrId: row.slrId, distance: r.distance}
            ];
          }
        }).catch(e => {
          console.error(e)
          alert.error('The distance could not be calculated')
        })
      }
    },
    mappedAssigns(assigns = [], otherFilters) {
      const {brn_id: filterBrn, slr_id: salesId} = otherFilters
      const brns = filterBrn.split(',')
      let mappedData: any = {}
      const emps = state.employees;


      for (const assign of assigns) {
        let {slr_id, slot, brn_id} = assign;
        if (!!salesId && salesId !== slr_id) continue
        slr_id = parseInt(slr_id)
        if(!mappedData[brn_id]) {
          mappedData[brn_id] = []
        }

        let findIndexEmp = mappedData[brn_id].findIndex(emp => emp.slrId == slr_id) || - 1
        if (findIndexEmp < 0) {
          mappedData[brn_id].push(methods.initializeMappedData(slr_id));
          findIndexEmp = mappedData[brn_id].length - 1
        }
        mappedData[brn_id][findIndexEmp][`slot${slot}`].data.push(helper.snakeToCamelCaseKeys(assign));
      }

      for (const emp of emps) {
        const {id, FirstName, LastName, brn_id, slots} = emp;
        let findIndexEmp = (mappedData[brn_id] || []).findIndex(emp => emp.slrId == id)

        if(filterBrn !== 'ALL' && !brns.includes(brn_id) && findIndexEmp < 0) continue;
        if (findIndexEmp < 0 && !slots.length) continue;

        if(!mappedData[brn_id]) {
          mappedData[brn_id] = []
        }

        if (findIndexEmp < 0) {
          mappedData[brn_id].push(methods.initializeMappedData(id, `${LastName}, ${FirstName}`, brn_id));
          findIndexEmp = mappedData[brn_id].length - 1
        } else {
          mappedData[brn_id][findIndexEmp].slrName = `${LastName}, ${FirstName}`;
          mappedData[brn_id][findIndexEmp].brnId = brn_id;
        }

        slots.forEach(s => {
          mappedData[brn_id][findIndexEmp][`slot${s}`].active = true
        })
      }

      const valuesMap: any = Object.values(mappedData || {})

      console.warn({valuesMap})

      const assignedData = valuesMap//.sort((a, b) => a.brnId.localeCompare(b.brnId))
      state.assignedData = assignedData
    },
    async reCalc(apptdate) {
      state.loading = true

      await service.recalculateLeads({apptdate})
        .then(res => {
          state.isRuningReCalc = true
          alert.info('Start the Recalculate of Auto Assigner')
        })
        .catch(e => {
          state.loading = false
          console.error(e)
        })
    }
  };

  watch(() => state.allUnAssign, (newValue) => {
    methods.filterUnAssign()
  })
  watch(() => state.unMappedAssignedData, (newValue) => {
    state.totalAssigns = newValue.length
    state.totalMiles = newValue.reduce((prev, curr) => prev + parseInt(curr.distance || 0), 0)
  }, {deep: true})

  onMounted(() => {
    const slotColumns: any = clone(state.columnsSlot).map(s => ({
      ...s,
      component: {
        template: assign,
        props: {block: true, calcDistance: true},
        events: {
          change: (e) => methods.moveDrag(e)
        }
      }
    }));

    state.columns = [
      ...state.columns,
      ...slotColumns
    ]
    console.warn()
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods};
}
