export default {
  company: {
    permission: 'isetup.companies.manage',
    activated: true,
    authenticated: true,
    path: '/companies',
    name: 'qsetuprenuity.admin.company',
    crud: import('modules/qsetuprenuity/_crud/companies'),
    page: () => import('modules/qcrud/_pages/admin/crudPage'),
    layout: () => import('layouts/master.vue'),
    title: 'isetup.cms.sidebar.adminCompanies',
    icon: 'fa-light fa-buildings',
    subHeader: {
      refresh: true,
    }
  }
}
