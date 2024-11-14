import { reactive, toRefs, computed, onMounted, watch } from 'vue';
//@ts-ignore
import { i18n, moment, alert, helper, clone, cache, store } from 'src/plugins/utils';
import service from './services';
import moduleStore from '../../../store'
import assign from '../../../_components/assigns/index.vue';
import getStateData from './model';

export default function controller() {
  // Refs
  const refs = {};

  const getState = getStateData();
  // States
  const state = reactive(getState);

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
          //vIf: apptDate.isSameOrAfter(tomorrow),
          props: {
            icon: 'fa-light fa-shuffle',
            label: i18n.tr('ileads.cms.messages.reassign'),
            round: false,
            rounded: true,
            padding: 'xs md',
            color: 'green'
          },
          action: () => state.openForm = true
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
    filters: computed(() => {
      const companyId = state.companyId;

      return {
        brn_id: {
          value: 'ALL',
          type: 'select',
          quickFilter: true,
          props: {
            sortOptions: false,
            label: i18n.tr('ileads.cms.form.brnId'),
            options: [
              { label: 'ALL', value: 'ALL' }
            ]
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qassignlp.branches',
            select: { label: 'label', id: 'value' },
            requestParams: { filter: { company_id: companyId } }
          }
        },
        apptdate: {
          value: moment().format('YYYY/MM/DD'),
          type: 'date',
          quickFilter: true,
          quickNavigation: true,
          props: {
            label: i18n.tr('ileads.cms.form.apptdate')
          }
        }
      };

    }),
    fieldsUnAssign: computed(() => {
      const companyId = state.companyId;

      return {
        brnId: {
          value: 'ALL',
          type: 'select',
          props: {
            sortOptions: false,
            label: i18n.tr('ileads.cms.form.brnId'),
            options: [
              { label: 'ALL', value: 'ALL' }
            ]
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qassignlp.branches',
            select: { label: 'label', id: 'value' },
            requestParams: { filter: { company_id: companyId } }
          }
        },
        dspId: {
          value: 'ALL',
          type: 'select',
          props: {
            label: i18n.tr('ileads.cms.form.dspId'),
            options: [
              { label: '-- ALL --', value: 'ALL' }
            ]
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qassignlp.disposition',
            select: { label: 'descr', id: 'descr' },
            requestParams: { filter: { active: 1, company_id: companyId } }
          }
        },
        rnkId: {
          value: 'ALL',
          type: 'select',
          props: {
            label: i18n.tr('ileads.cms.form.rnkId'),
            options: [
              { label: '-- ALL --', value: 'ALL' }
            ]
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qassignlp.rank',
            select: { label: 'descr', id: 'id' },
            requestParams: { filter: { active: true, company_id: companyId } }
          }
        }
      };

    })
  };

  // Methods
  const methods = {
    async getActiveSlots(companyId) {
      try {
        const res = await service.getData('apiRoutes.qassignlp.slots', true, { filter: { active: 1, company_id: companyId } })
        const data = res.data

        const allSlot = state.allColumnsSlot;
        state.numSlots = data.length

        const activeColumns = data.map(d => {
          const findSlot = allSlot.find(s => s.id === d.id);

          return {
            ...findSlot,
            label: d.LongName
          }
        })

        state.columnsSlot = activeColumns;

        const slotColumns: any = clone(activeColumns).map(s => ({
          ...s,
          style: {},
          component: {
            template: assign,
            props: { block: true, calcDistance: true },
            events: {
              change: (e) => methods.moveDrag(e),
              changeLock: (e) => methods.updateCard(e),
              onDragStart: (e) => methods.onDragStart(e),
              onDragEnd: (e) => methods.onDragEnd(e)
            }
          }
        }));

        state.columns = [
          ...state.columns,
          ...slotColumns
        ];
      } catch (e) {
        alert.error('Slots could not be loaded.')
        console.error(e)
      }

    },
    blockLeads(lock = false) {
      state.unMappedAssignedData = state.unMappedAssignedData.map(a => ({ ...a, priorityScore: lock ? 0 : -1 }));
      state.allBlock = !lock;
      state.hasPendingChanges = true;
      const message = !lock ? 'All assigned leads have been blocked.' : 'All assigned leads have been unblocked.';
      alert.info(message);
    },
    toggleDynamicFilterModal() {
      state.showDynamicFilterModal = !state.showDynamicFilterModal;
    },
    updateDynamicFilterValues(filters: any) {
      state.dynamicFilterValues = filters;
      methods.getData(false, filters);
    },
    async getData(refresh = false, filter = {}) {
      state.loading = true;
      let otherFilters: any = state.dynamicFilterValues;
      const companyId = state.companyId;
      const params: any = {
        filter: {
          company_id: companyId, ...(otherFilters || {}), ...(filter || {}),
          order: { way: 'asc', field: 'brn_id' }
        },
        take: 1000
      }

      let leads = [];
      let idsAssigns = [];
      let employeesData = [];
      let allAssigns = [];
      state.hasPendingChanges = false;

      await Promise.all([
        service.getData('apiRoutes.qassignlp.employees', refresh, params),
        service.getData('apiRoutes.qassignlp.leads', refresh, params),
        service.getData('apiRoutes.qassignlp.assignments', refresh, {
          filter: {
            companyId: companyId,
            apptdate: otherFilters.apptdate,
            priorityScore: '-1'
          }
        })
      ]).then(async ([employees, leadsResponse, assignments]) => {
        employeesData = employees.data;
        const companyId = state.companyId;
        leads = leadsResponse.data.map(l => {
          return { ...helper.snakeToCamelCaseKeys(l), companyId };
        });

        const assigns = assignments.data;
        allAssigns = leads.filter(l => l.slrId > 0).map(lead => {
          const findAssign = assigns.find(a => a.leadId == lead.id);
          return { ...(findAssign || {}), ...lead };
        });

        const distances = await methods.calcAllDist(allAssigns);
        if (distances?.length) allAssigns = distances;

        idsAssigns = allAssigns.map(l => l.id);
      }).catch(e => {
        alert.error(i18n.tr('isite.cms.message.errorRequest'));
        console.error(e);
      });
      state.employees = employeesData;
      state.allLeads = leads;
      state.unMappedAssignedData = allAssigns;

      const unAssigns = leads.filter(l => !idsAssigns.includes(l.id));
      state.allUnAssign = unAssigns;
      methods.filterAndMapUnAssign();

      state.loading = false;
    },
    filterAndMapUnAssign() {
      const filters = state.filtersUnassign;
      const unassign = state.allUnAssign;

      if (!filters || !unassign.length) {
        state.unAssignedData = unassign || {};
        return;
      }

      const filteredUnAssign = unassign.filter(item => {
        return Object.keys(filters).every(key => {
          let value = filters[key];
          if (value === 'ALL') return true;
          if (key == 'brnId') {
            value = value.split(',');
            return value.includes(item[key]);
          }
          return item[key] == value;
        });
      });

      let mappedUnAssigns: any = {};

      for (let i = 1; i <= state.numSlots; i++) {
        mappedUnAssigns[`slot${i}`] = [];
      }

      filteredUnAssign.forEach(u => {
        let nameSlot = `slot${u.slot}`;
        if (!mappedUnAssigns[nameSlot]) mappedUnAssigns[nameSlot] = [];
        mappedUnAssigns[nameSlot].push(u);
      });

      state.unAssignedData = mappedUnAssigns;
    },
    initializeMappedData(id, name = '', brnId = '') {
      return {
        slrId: id,
        slrName: name,
        brnId,
        ...methods.initializeSlots()
      };
    },
    initializeSlots() {
      let slots: any = {};

      for (let i = 1; i <= state.numSlots; i++) {
        slots[`slot${i}`] = { active: false, data: [] };
      }

      return slots
    },
    async moveDrag({ evt, row, kanban }) {
      if (!evt) return;
      const { added, removed } = evt;
      if (!added && !removed) return;
      const apptdate = state.dynamicFilterValues.apptdate;

      const element = added?.element ?? removed?.element;
      const leadId = element?.id;
      const slot = element?.slot;
      const index = added?.newIndex ?? removed?.oldIndex;

      if (kanban == 'unassign') {
        if (added && leadId && index >= 0) {
          const newElement = { ...element, priorityScore: 0, distance: null, slrId: null };
          const filterUnAssign = state.allUnAssign.filter(l => l.id !== leadId);
          state.allUnAssign = [...filterUnAssign, newElement];
          methods.filterAndMapUnAssign();

          state.unMappedAssignedData = state.unMappedAssignedData.filter(l => l.id !== leadId);
          methods.updateCard({ row: newElement });
        } else if (removed) {
          state.allUnAssign = state.allUnAssign.filter(l => l.id !== leadId);
          methods.filterAndMapUnAssign();
        }
        return;
      } else if (kanban == 'assign') {
        if (added && leadId && index >= 0) {
          const body = {
            leadId,
            slrId: row.slrId,
            slot,
            rowInfo: row,
            companyId: state.companyId,
            apptdate
          };
          let saveElement = { ...element, slrId: row.slrId, priorityScore: -1 };
          methods.updateCard({ row: saveElement });
          await service.calculateAndUpdate({ attributes: body }).then(r => {
            const dists = r.data;
            const saveElements = [];
            const unMapped = clone(state.unMappedAssignedData);

            dists.forEach(d => {
              if (leadId == d.id) {
                saveElement.distance = d.distance;
                saveElements.push(saveElement);
              } else {
                const findEl = unMapped.find(l => l.id == d.id);

                if (findEl) {
                  const saveElement = { ...findEl, distance: d.distance };

                  saveElements.push(saveElement);
                } else console.warn('Not found Lead for Distance: ', { d });
              }
            });
            const onlyIds = saveElements.map(i => i.id);
            const filterAssignUnMapped = state.unMappedAssignedData.filter(l => !onlyIds.includes(l.id));
            state.unMappedAssignedData = [...filterAssignUnMapped, ...saveElements];
          }).catch(e => {
            console.error(e);
            alert.error('The distance could not be calculated');
          });
        } else if (removed) {
          const nextSlot = slot + 1;
          const lead = (row[`slot${nextSlot}`]?.data ?? [])[0];
          const leadId = lead?.id ?? -1;

          if (leadId < 0) return;
          const body = {
            leadId,
            slrId: row.slrId,
            slot: nextSlot,
            rowInfo: row,
            companyId: state.companyId,
            apptdate,
          };

          await service.calculateAndUpdate({ attributes: body }).then(r => {
            const dists = r.data;
            const saveElements = [];
            dists.forEach(d => {
              if (leadId == d.id) {
                lead.distance = d.distance;
                saveElements.push(lead);
              }
            });
            const onlyIds = saveElements.map(i => i.id);
            const filterAssignUnMapped = state.unMappedAssignedData.filter(l => !onlyIds.includes(l.id));
            state.unMappedAssignedData = [...filterAssignUnMapped, ...saveElements];
          }).catch(e => {
            console.error(e);
            alert.error('The distance could not be calculated');
          });
        }
      }
    },
    mappedAssigns(assigns = [], otherFilters) {
      const { brn_id: filterBrn, slr_id: salesId } = otherFilters;
      const brns = filterBrn.split(',');
      let mappedData: any = {};
      const emps = state.employees;

      for (const assign of assigns) {
        let { slrId, slot } = assign;
        if (!!salesId && salesId !== slrId) continue;
        slrId = parseInt(slrId);

        const findEmp = emps.find(emp => emp.id == slrId);

        if (!findEmp) {
          console.warn('Not Found Emp: ', { assign, emps });
          continue;
        }

        const { brn_id, LastName, FirstName, slots } = findEmp;

        if (!mappedData[brn_id]) {
          mappedData[brn_id] = [];
        }

        let findIndexEmp = mappedData[brn_id].findIndex(emp => emp.slrId == slrId);
        if (findIndexEmp < 0) {
          mappedData[brn_id].push(methods.initializeMappedData(slrId, `${LastName}, ${FirstName}`, brn_id));
          findIndexEmp = mappedData[brn_id].length - 1;
          slots.forEach(s => {
            mappedData[brn_id][findIndexEmp][`slot${s}`].active = true;
          });
        }
        mappedData[brn_id][findIndexEmp][`slot${slot}`].data.push(assign);
      }

      for (const emp of emps) {
        const { id, FirstName, LastName, brn_id, slots } = emp;
        let findIndexEmp = (mappedData[brn_id] || []).findIndex(emp => emp.slrId == id);

        if (filterBrn !== 'ALL' && !brns.includes(brn_id) && findIndexEmp < 0) continue;
        if (findIndexEmp < 0 && !slots.length) continue;

        if (!mappedData[brn_id]) {
          mappedData[brn_id] = [];
        }

        if (findIndexEmp < 0) {
          mappedData[brn_id].push(methods.initializeMappedData(id, `${LastName}, ${FirstName}`, brn_id));
          findIndexEmp = mappedData[brn_id].length - 1;
          slots.forEach(s => {
            mappedData[brn_id][findIndexEmp][`slot${s}`].active = true;
          });
        }
      }

      const keys = Object.keys(mappedData).sort((a, b) => a.localeCompare(b));
      let response: any = {};

      keys.forEach(key => {
        response[key] = mappedData[key].sort((a, b) => a.slrName.localeCompare(b.slrName));
      });

      state.assignedData = response || {};
    },
    async reCalc({ body, apptdate, presets }) {
      const configId = body?.configId;
      const presetSelected = presets.find(p => p.id == configId);
      if (!presetSelected) {
        alert.error('No configuration has been selected to run the ANR.');
        return;
      }
      const attributes = {
        ...body,
        apptdate,
        companyId: state.companyId
      };

      alert.info('Start the Recalculate of Auto Assigner');
      state.loading = true;

      await service.recalculateLeads({ attributes })
        .then(async res => {
          const leadBlocks = state.unMappedAssignedData.filter(l => l.priorityScore == -1);
          const leads = state.allLeads;
          const leadsAssigneds = methods.getLeadsAssigneds(presetSelected, leads, leadBlocks);
          const assigns = res.data.map(a => {
            const lead = leads.find(l => l.id == a.lead_id);

            return {
              ...(lead || helper.snakeToCamelCaseKeys(a)),
              distance: a.distance,
              slrId: a.slr_id
            };
          });

          let allAssign = [...assigns, ...leadsAssigneds, ...leadBlocks];

          const distances = await methods.calcAllDist(allAssign);
          if (distances?.length) allAssign = distances;

          state.unMappedAssignedData = allAssign;

          const idAssigns = allAssign.map(i => i.id);

          const unAssigns = leads.filter(l => !idAssigns.includes(l.id)).map(l => ({...l, slrId: null, priorityScore: 0}));
          state.allUnAssign = unAssigns;
          methods.filterAndMapUnAssign();
        })
        .catch(e => {
          alert.error('Auto Assigner Failed');
          console.error(e);
        });

      state.loading = false;
    },
    getLeadsAssigneds(presetSelected, leads, leadBlocks) {
      const {
        ignoreCredit,
        rnkId: ignoreRnkId,
        slot: ignoreSlot,
        includeDsp,
        includeSrc,
        brnId: includeBrnId
      } = presetSelected.value;

      const leadBlocksId = leadBlocks.map(i => i.id);

      return leads.filter(lead => {
        if (!lead.slrId || leadBlocksId.length && leadBlocksId.includes(lead.id)) return false;
        if (lead.isFollowUp) return true;

        let shouldIgnore = (ignoreSlot.length && ignoreSlot.includes(`${lead.slot}`)) ||
          (ignoreRnkId.length && ignoreRnkId.includes(`${lead.rnkId}`)) ||
          (ignoreCredit.length && ignoreCredit.includes(lead.crTier));

        if (!shouldIgnore) {
          shouldIgnore = !(includeDsp.includes(lead.dspId) &&
            includeSrc.includes(lead.srcId) &&
            (includeBrnId.includes('ALL') || includeBrnId.includes(lead.brnId)));
        }

        return shouldIgnore;
      });
    },
    async calcAllDist(leads) {
      const date = state.dynamicFilterValues.apptdate;
      let response = [];
      if (!leads?.length) return response;

      await service.bulkCalculateDist({ attributes: { leads, companyId: state.companyId, apptdate: date } })
        .then((res) => {
          const data = res.data;

          response = leads.map(lead => {
            const findDistance = data.find(d => d.id == lead.id);
            return { ...lead, distance: findDistance?.distance || 0 };
          });
        })
        .catch(e => alert.error('Distances could not be calculated'));

      return response;
    },
    async saveData() {
      state.loading = true;
      const data = [...state.allUnAssign, ...state.unMappedAssignedData];

      await service.leadBulkCreateOrUpdate(data)
        .then(a => {
          state.hasPendingChanges = false;
          alert.info('Leads could be saved');
        })
        .catch(e => alert.error('The leads could not be saved'));

      state.loading = false;
    },
    updateCard(data) {
      const { row } = data;
      const body = {
        priorityScore: row.priorityScore,
        slrId: row.slrId,
        distance: row.distance,
        apptdate: moment.utc(row.apptdate).startOf('day').format('MM/DD/YYYY HH:mm:ss'),
        leadId: row.id,
        slot: row.slot,
        companyId: row.companyId || state.companyId
      };

      service.updateLead(row.id, body).catch(e => alert.error('The lead could not be saved'));
    },
    onDragStart(event) {
      const props = event?.props;
      const index = props?.col?.field || props?.field

      state.columns = state.columns.map(c => {
        const column = c;
        if(column?.component) {
          column.component.props.isDragStart = true
          if(column.field == index) {
            column.component.props.style = {
              backgroundColor: column.borderColor,
              opacity: '0.4'
            }
          } else {
            column.component.props.style = {
              backgroundColor: 'black',
              opacity: '0.6'
            }
          }
        }
        return column
      })

      state.columnsSlot = state.columnsSlot.map(c => {
        const column = c;
        column.isDragStart = true
        if(column.field == index) {
          column.bgStyle = {
            backgroundColor: column.borderColor,
            opacity: '0.4'
          }
        } else {
          column.bgStyle = {
            backgroundColor: 'black',
              opacity: '0.6'
          }
        }
        return column
      })
    },
    onDragEnd(event) {
      state.columns = state.columns.map(c => {
        const column = c;
        if(column?.component) {
          column.component.props.isDragStart = false
        }
        return column
      })

      state.columnsSlot = state.columnsSlot.map(c => {
        const column = c;
        column.isDragStart = false
        return column
      })
    },
    getColumnClass(data) {
      const index = data?.field || 'table';
      const highlighted = state.dragGroupColumn === index;
      const diffused = state.dragGroupColumn !== null && state.dragGroupColumn !== index;

      return `${highlighted ? 'highlighted-column' : ''} ${diffused ? 'diffused-column' : ''}`;
    }
  };
  watch(() => state.unMappedAssignedData, (newValue) => {
    state.totalAssigns = newValue.length;
    state.totalMiles = newValue.reduce((prev, curr) => prev + parseInt(curr.distance || 0), 0);

    let otherFilters: any = state.dynamicFilterValues;
    methods.mappedAssigns(newValue, otherFilters);
  }, { deep: true });

  onMounted(async () => {
    let selectedCompanyId = await moduleStore.setCompanySelected()
    if (!selectedCompanyId) {
      alert.warning({
        mode: 'modal',
        title: i18n.tr('ileads.cms.title.noCompany'),
        message: `<div>${i18n.tr('ileads.cms.messages.contactWithAdmin')}</div>`
      });
      return;
    }

    await methods.getActiveSlots(selectedCompanyId)
    state.companyId = selectedCompanyId;
    state.companySelected = !!selectedCompanyId;
  });

  return { ...refs, ...(toRefs(state)), ...computeds, ...methods };
}
