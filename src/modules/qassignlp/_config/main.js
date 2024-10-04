export default {
  moduleName: 'ileads',
  //Entities
  entityNames: {
    assigments: 'assigments',
    configLeads: 'configLeads'
  },
  //Quick Cards
  quickCards: [
    {
      active: true,
      col: 'col-12 col-lg-12',
      permission: 'ilead.leads.manage',
      props: {
        title: 'Recent Activities'
      },
      component: () => import('src/modules/qassignlp/_components/quick-cards/index.vue')
    }
  ]
};
