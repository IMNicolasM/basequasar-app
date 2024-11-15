import { i18n } from '../../../../../plugins/utils';

import getName from './getName.vue';
import simpleCard from '../../../_components/simpleCard/index.vue';

export default function getStateData() {
  let res: any = {
    excludeActions: ['search', 'sync', 'export', 'recommendations'],
    loading: false,
    dynamicFilterValues: {},
    dynamicFilterSummary: {},
    showDynamicFilterModal: false,
    totalAssigns: 0,
    totalMiles: 0,
    filtersUnassign: {},
    assignedData: {},
    allLeads: [],
    employees: [],
    unMappedAssignedData: [],
    unAssignedData: {},
    allUnAssign: [],
    openForm: false,
    companySelected: false,
    allBlock: false,
    companyId: 0,
    columnsSlot: [],
    numSlots: [],
    hasPendingChanges: false,
    styleSheet: null
  };

  res.allColumnsSlot = [
    {
      id: 1,
      name: 'slot1',
      label: i18n.tr('ileads.cms.form.morning'),
      field: 'slot1',
      align: 'center',
      borderColor: '#D1FAE5',
      style: { background: '#F1FEF7' },
      component: simpleCard
    },
    {
      id: 2,
      name: 'slot2',
      label: i18n.tr('ileads.cms.form.afternoon'),
      field: 'slot2',
      align: 'center',
      component: simpleCard,
      borderColor: '#FECACA',
      style: { background: '#FFF5F5' }
    },
    {
      id: 3,
      name: 'slot3',
      label: i18n.tr('ileads.cms.form.lateAfternoon'),
      field: 'slot3',
      align: 'center',
      component: simpleCard,
      borderColor: '#DBEAFE',
      style: { background: '#F5F8FF' }
    },
    {
      id: 4,
      name: 'slot4',
      label: i18n.tr('ileads.cms.form.evening'),
      field: 'slot4',
      align: 'center',
      component: simpleCard,
      borderColor: '#EDE9FE',
      style: { background: '#F9F8FD' }
    },
    {
      id: 5,
      name: 'slot5',
      label: i18n.tr('ileads.cms.form.evening'),
      field: 'slot5',
      align: 'center',
      component: simpleCard,
      borderColor: '#FEF3C7',
      style: { background: '#FFFBEB' }
    },
    {
      id: 6,
      name: 'slot6',
      label: i18n.tr('ileads.cms.form.evening'),
      field: 'slot6',
      align: 'center',
      component: simpleCard,
      borderColor: '#FDE68A',
      style: { background: '#FFFBEA' }
    }
  ];

  res.columns = [
    {
      name: 'brnId',
      label: i18n.tr('ileads.cms.form.slrName'),
      field: 'brnId',
      align: 'rigth',
      component: getName,
      class: 'dense-column'
    }
  ];
  return res;
}
