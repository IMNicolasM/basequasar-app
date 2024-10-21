import { cache, store } from '../../../plugins/utils';

console.warn("EOOOOOO: ")
console.warn(store.getters, "Points")
// const data = await cache.get.item('sessionData');
// console.warn({ data })

export default {
  moduleName: 'ileads',
  moduleTitle: 'Assignments',
  //Entities
  entityNames: {
    assigments: 'assigments',
    configLeads: 'configLeads'
  },
  //Quick Cards
  // quickCards: [
  //   {
  //     active: true,
  //     col: 'col-12 col-lg-12',
  //     permission: 'ilead.leads.manage',
  //     props: {
  //       title: 'Recent Activities'
  //     },
  //     component: () => import('src/modules/qassignlp/_components/quick-cards/index.vue')
  //   }
  // ],
  configList: [
    {
      type: 'button',
      btnProps: {
        label: 'Companies'
      }
    }
  ]
};
