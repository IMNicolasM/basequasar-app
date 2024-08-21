export default {
  assigments: {
    permission: 'ileads.assigments.manage',
    activated: true,
    authenticated: true,
    path: '/lead/appointments',
    name: 'qassignlp.admin.assigments',
    page: () => import('src/modules/qassignlp/_pages/admin/assigment/index.vue'),
    layout: () => import('layouts/master.vue'),
    title: 'ileads.cms.sidebar.adminAssignments',
    icon: 'fa-light fa-bullseye-pointer',
    subHeader: {
      refresh: true,
    }
  }
}
