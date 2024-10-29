<template></template>
<script>
export default {
  data() {
    return {
      crudId: this.$uid()
    }
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config("main.qsetuprenuity.entityNames.companies"),
        apiRoute: 'apiRoutes.qsetuprenuity.setupCompanies',
        permission: 'isetup.companies',
        create: {
          title: this.$tr('isetup.cms.create.company')
        },
        read: {
          columns: [
            {name: 'id', field: 'id', style: 'width: 50px', label: this.$tr('isite.cms.form.id')},
            {name: 'name', label: this.$tr('isite.cms.form.name'), field: 'name', align: 'left'},
            {name: 'code', label: this.$tr('isetup.cms.form.code'), field: 'code', align: 'left'},
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'right',
              format: val => val ? this.$trd(val) : '-',
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'right',
              format: val => val ? this.$trd(val) : '-',
            },
            {name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left'},
          ]
        },
        update: {
          title: this.$tr('isetup.cms.edit.company'),
        },
        delete: true,
        formLeft: {
          id: {value: ''},
          name: {
            type: 'input',
            required: true,
            props: {
              label: `${this.$tr('isite.cms.form.name')}*`
            }
          },
          code: {
            type: 'input',
            required: true,
            props: {
              label: `${this.$tr('isetup.cms.form.code')}*`
            }
          }
        }
      }
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {}
    }
  }
}
</script>
