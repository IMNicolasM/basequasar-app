import { cache, store, router } from '../../../plugins/utils';
import service from '../service'

export default {
  moduleName: 'ileads',
  moduleTitle: 'Assignments',
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
  ],
  headerActions: async () => {
    const userData = store.state.quserAuth.userData
    const companies = userData?.options?.companyAssigned || []
    const selectedCompany = await cache.get.item('renuitySelectedCompany')
    let actionCompany = []
    let label = 'Company'

    if(companies.length && !selectedCompany) await cache.set('renuitySelectedCompany', companies[0])
    if(companies.length > 1) {
      await service.getData('apiRoutes.qsetuprenuity.setupCompanies', true, { id: companies })
        .then(res => {
          actionCompany = res.data.map(r => {
            if(r.id == selectedCompany) label = r.name
              return {
                label: r.name,
                action: async () => {
                  await cache.set('renuitySelectedCompany', r.id)
                  router.push({ name: 'app.update.app' });
                }
              }
          })
        }).catch(e => console.error(e))
    }

    return [
      {
        id: 'siteActionChooseCompany',
        name: 'changeCompany',
        label: 'Choose Company',
        type: 'btn',
        vIf: companies.length > 1 && actionCompany.length,
        props: {
          label: label,
          unelevated: true,
          round: false,
          rightIcon: 'fas fa-chevron-down'
        },
        menu: {
          actions: actionCompany
        }
      }
    ]
  }
};
