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
    assignedData: {},
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
        borderColor: '#D1FAE5',
        component: simpleCard
      },
      {
        name: 'slot2',
        label: i18n.tr('ileads.cms.form.afternoon'),
        field: 'slot2',
        align: 'center',
        component: simpleCard,
        borderColor: '#FECACA'
      },
      {
        name: 'slot3',
        label: i18n.tr('ileads.cms.form.lateAfternoon'),
        field: 'slot3',
        align: 'center',
        component: simpleCard,
        borderColor: '#DBEAFE'
      },
      {
        name: 'slot4',
        label: i18n.tr('ileads.cms.form.evening'),
        field: 'slot4',
        align: 'center',
        component: simpleCard,
        borderColor: '#EDE9FE'
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
    openForm: false,
    allBlock: false
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
      const isBlock = state.allBlock;

      return [
        {
          label: i18n.tr('ileads.cms.messages.reassign'),
          vIf: /*apptDate.isSameOrAfter(tomorrow) &&*/ !state.isRuningReCalc,
          props: {
            icon: 'fa-light fa-shuffle',
            label: i18n.tr('ileads.cms.messages.reassign'),
            round: false,
            rounded: true,
            padding: 'xs md',
            color: 'green'
          },
          action: () => methods.openSetupForm()
        },
        {
          label: i18n.tr('isite.cms.label.save'),
          props: {
            icon: 'fa-light fa-floppy-disk'
          },
          action: () => methods.saveData()
        },
        {
          label: i18n.tr(`ileads.cms.label.${!isBlock ? '' : 'un'}lock`),
          props: {
            icon: `fa-light fa-lock${isBlock ? '' : '-open'}`
          },
          action: () => methods.blockLeads(isBlock)
        }
      ];
    }),
  };

  // Methods
  const methods = {
    blockLeads(lock = false) {
      state.unMappedAssignedData = state.unMappedAssignedData.map(a => ({...a, priorityScore: lock ? 0 : -1}))
      state.allBlock = !lock
      const message = !lock ? "All assigned leads have been blocked." : "All assigned leads have been unblocked."
      alert.info(message)
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

      let leads = [];
      let idsAssigns = [];

      await Promise.all([
        service.getData('apiRoutes.qassignlp.employees', refresh, params),
        service.getData('apiRoutes.qassignlp.leads', refresh, params),
        service.getData('apiRoutes.qassignlp.assignments', refresh, {filter: {apptdate: otherFilters.apptdate, priorityScore: -1}})
      ]).then(async ([employees, leadsResponse, assignments]) => {
        state.employees = employees.data
        leads = leadsResponse.data
        const assigns = assignments.data.filter(a => a.priority_score < 0)

        let leadsWitoutDis = leads.filter(l => l.is_follow_up || l.slr_id > 0)

        const mappedAssigneds = assigns.map(a => {
          const findLead = leads.find(l => l.id == a.lead_id)
          return {
            ...(findLead || {}),
            slr_id: a.slr_id,
            distance: a.distance || 0,
            priority_score: a.priority_score,
            ld_id: a.lead_id
          }
        });

        const filteredAssigns = mappedAssigneds.filter(l => l.id && l.slr_id > 0)

        const assigneds = filteredAssigns.filter(l => l.distance > 0)
        const aWitoutDis = filteredAssigns.filter(l => l.distance <= 0)

        leadsWitoutDis = [...leadsWitoutDis, ...aWitoutDis]
        if (leadsWitoutDis.length) {
          await service.bulkCalculateDist({attributes: {followups: leadsWitoutDis, assigneds}})
            .then((res) => {
              const data = res.data

              leadsWitoutDis = leadsWitoutDis.map(follow => {
                const findFollow = data.find(f => f.id == follow.id)
                return {...follow, distance: findFollow?.distance || 0}
              })
            })
            .catch(e => alert.error('Distances could not be calculated'))
        }

        const allAssigns = [...assigneds, ...leadsWitoutDis].map(a => helper.snakeToCamelCaseKeys(a))
        idsAssigns = allAssigns.map(l => l.id)

        state.unMappedAssignedData = allAssigns;
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
      methods.filterUnAssign()
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
      const {added, removed} = evt;

      console.warn(evt)

      const element = added?.element;
      const leadId = element?.id;
      const slot = element?.slot;
      const index = added?.newIndex;

      if (kanban == 'unassign') {
        if (leadId && index >= 0) {
          const newElement = {...element, priorityScore: 0, distance: null, slrId: null};

          state.allUnAssign[`slot${slot}`].splice(index, 0, newElement);
          methods.filterUnAssign()

          state.unMappedAssignedData = state.unMappedAssignedData.filter(l => l.id !== leadId)
        } else if (removed) {
          const element = removed?.element;
          const leadId = element?.id;
          const slot = element?.slot;

          state.allUnAssign[`slot${slot}`] = state.allUnAssign[`slot${slot}`].filter(l => l.id != leadId)
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
        await service.calculateAndUpdate({attributes: body}).then(r => {
          const dists = r.data;
          const saveElements = []
          const unMapped = clone(state.unMappedAssignedData);

          dists.forEach(d => {
            if (leadId == d.id) {
              const saveElement = {...element, slrId: row.slrId, distance: d.distance, priorityScore: -1}
              saveElements.push(saveElement)
            } else {
              const findEl = unMapped.find(l => l.id == d.id)

              if (findEl) {
                const saveElement = {...findEl, distance: d.distance}

                saveElements.push(saveElement)
              } else console.warn("Not found Lead for Distance: ", d.id)
            }
          })

          const onlyIds = saveElements.map(i => i.id)
          const filterAssignUnMapped = state.unMappedAssignedData.filter(l => !onlyIds.includes(l.id))
          state.unMappedAssignedData = [...filterAssignUnMapped, ...saveElements];
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
        let {slrId, slot} = assign;
        if (!!salesId && salesId !== slrId) continue
        slrId = parseInt(slrId)

        const findEmp = emps.find(emp => emp.id == slrId)

        if (!findEmp) {
          console.warn("Not Found Emp: ", {assign, emps})
          continue
        }

        const {brn_id, LastName, FirstName, slots} = findEmp;

        if (!mappedData[brn_id]) {
          mappedData[brn_id] = []
        }

        let findIndexEmp = mappedData[brn_id].findIndex(emp => emp.slrId == slrId)
        if (findIndexEmp < 0) {
          mappedData[brn_id].push(methods.initializeMappedData(slrId, `${LastName}, ${FirstName}`, brn_id));
          findIndexEmp = mappedData[brn_id].length - 1
          slots.forEach(s => {
            mappedData[brn_id][findIndexEmp][`slot${s}`].active = true
          })
        }
        mappedData[brn_id][findIndexEmp][`slot${slot}`].data.push(assign);
      }

      for (const emp of emps) {
        const {id, FirstName, LastName, brn_id, slots} = emp;
        let findIndexEmp = (mappedData[brn_id] || []).findIndex(emp => emp.slrId == id)

        if (filterBrn !== 'ALL' && !brns.includes(brn_id) && findIndexEmp < 0) continue;
        if (findIndexEmp < 0 && !slots.length) continue;

        if (!mappedData[brn_id]) {
          mappedData[brn_id] = []
        }

        if (findIndexEmp < 0) {
          mappedData[brn_id].push(methods.initializeMappedData(id, `${LastName}, ${FirstName}`, brn_id));
          findIndexEmp = mappedData[brn_id].length - 1
          slots.forEach(s => {
            mappedData[brn_id][findIndexEmp][`slot${s}`].active = true
          })
        }
      }

      const keys = Object.keys(mappedData).sort((a, b) => a.localeCompare(b))
      let response: any = {};

      keys.forEach(key => {
        response[key] = mappedData[key].sort((a, b) => a.slrName.localeCompare(b.slrName))
      })

      state.assignedData = response || {}
    },
    async reCalc({apptdate, configId}) {
      state.loading = true

      await service.recalculateLeads({attributes: {apptdate, configId}})
        .then(res => {
          state.isRuningReCalc = true
          alert.info('Start the Recalculate of Auto Assigner')
        })
        .catch(e => {
          state.loading = false
          console.error(e)
        })
    },
    saveData() {
      state.loading = true;

      const data = methods.unmappedLeads();
      console.warn(data)

      state.loading = false;
    },
    unmappedLeads() {
      const assignedLeads = state.unMappedAssignedData;

      let response = []
// console.warn(assignedLeads, )
      // for (const key in assignedLeads) {
      //   const employees = assignedLeads[key];
      //   employees.forEach(e => {
      //     const {slot1, slot2, slot3, slot4} = e
      //     response = [...response, ...slot1.data, ...slot2.data, ...slot3.data, ...slot4.data]
      //   })
      // }
      //
      // const unAssigns: any = clone(state.allUnAssign)
      //
      // const {slot1, slot2, slot3, slot4} = unAssigns
      //
      // const unAssignData = [...slot1, ...slot2, ...slot3, ...slot4].map(l => ({...l, slrId: 0}))
      //
      // return [...response, ...unAssignData]
    },
    updateCard(data) {
      const {row} = data;
      const body = {
        priorityScore: row.priorityScore,
        slrId: row.slrId,
        distance: row.distance,
        apptdate: row.apptdate,
        leadId: row.leadId,
        company: "MAD"
      }
      service.updateLead(row.id, {attributes: body}).catch(e => alert.error('The lead could not be saved'))
    }
  };
  watch(() => state.unMappedAssignedData, (newValue) => {
    state.totalAssigns = newValue.length
    state.totalMiles = newValue.reduce((prev, curr) => prev + parseInt(curr.distance || 0), 0)

    let otherFilters: any = state.dynamicFilterValues
    methods.mappedAssigns(newValue, otherFilters)
  }, {deep: true})

  onMounted(() => {
    const slotColumns: any = clone(state.columnsSlot).map(s => ({
      ...s,
      component: {
        template: assign,
        props: {block: true, calcDistance: true},
        events: {
          change: (e) => methods.moveDrag(e),
          changeLock: (e) => methods.updateCard(e)
        }
      }
    }));

    state.columns = [
      ...state.columns,
      ...slotColumns
    ]
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods};
}
