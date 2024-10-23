<template></template>
<script>
import moduleStore from '../store';

export default {
  mounted() {
    this.$nextTick(function() {
      this.init();
      this.creditOptions = (this.$getSetting('ilead::allCreditsCst') || []).map(i => ({ label: i, value: i }));
    });
  },
  data() {
    return {
      crudId: this.$uid(),
      creditOptions: []
    };
  },
  computed: {
    crudData() {
      return {
        crudId: this.crudId,
        entityName: config('main.qassinglp.entityNames.configLeads'),
        apiRoute: 'apiRoutes.qassignlp.config',
        permission: 'ilead.config-leads',
        create: {
          title: this.$tr('ileads.cms.create.config'),
          requestParams: {
            notToSnakeCase: ['value']
          }
        },
        read: {
          columns: [
            { name: 'id', field: 'id', style: 'width: 50px', label: this.$tr('isite.cms.form.id') },
            { name: 'name', label: this.$tr('isite.cms.form.name'), field: 'name', align: 'left' },
            {
              name: 'created_at', label: this.$tr('isite.cms.form.createdAt'), field: 'createdAt', align: 'right',
              format: val => val ? this.$trd(val) : '-'
            },
            {
              name: 'updated_at', label: this.$tr('isite.cms.form.updatedAt'), field: 'updatedAt', align: 'right',
              format: val => val ? this.$trd(val) : '-'
            },
            { name: 'actions', label: this.$tr('isite.cms.form.actions'), align: 'left' }
          ],
          requestParams: {
            notToSnakeCase: ['value'],
            filter: { companyId: moduleStore.companySelected }
          }
        },
        update: {
          title: this.$tr('ileads.cms.edit.config'),
          requestParams: {
            notToSnakeCase: ['value']
          }
        },
        delete: true,
        formLeft: {
          id: { value: '' },
          companyId: { value: moduleStore.companySelected },
          active: { value: 1 },
          name: {
            type: 'input',
            required: true,
            colClass: 'col-12 col-md-6',
            props: {
              label: `${this.$tr('isite.cms.form.name')}*`
            }
          },
          milesHome: {
            value: 120,
            type: 'input',
            colClass: 'col-12 col-md-6',
            fakeFieldName: 'value',
            props: {
              type: 'number',
              label: this.$tr('ileads.cms.form.milesHome')
            }
          },
          milesTrip: {
            value: 100,
            type: 'input',
            colClass: 'col-12 col-md-6',
            fakeFieldName: 'value',
            props: {
              type: 'number',
              label: this.$tr('ileads.cms.form.milesTrip')
            }
          },
          brnId: {
            value: ['ALL'],
            type: 'select',
            colClass: 'col-12 col-md-6',
            fakeFieldName: 'value',
            props: {
              label: this.$tr('ileads.cms.form.brnId'),
              useInput: true,
              useChips: true,
              multiple: true,
              options: [
                { label: '-- ALL --', value: 'ALL' }
              ]
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qassignlp.branches',
              select: { label: 'label', id: 'value' },
              requestParams: { filter: { company_id: moduleStore.companySelected } }
            }
          },
          includeDsp: {
            value: [],
            type: 'select',
            colClass: 'col-12 col-md-6',
            fakeFieldName: 'value',
            props: {
              label: this.$tr('ileads.cms.form.includeDsp'),
              useInput: true,
              useChips: true,
              multiple: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qassignlp.disposition',
              select: { label: 'descr', id: 'descr' },
              requestParams: { filter: { active: 1, company_id: moduleStore.companySelected } }
            }
          },
          includeSrc: {
            value: [],
            type: 'select',
            colClass: 'col-12 col-md-6',
            fakeFieldName: 'value',
            props: {
              label: this.$tr('ileads.cms.form.includeSrc'),
              useInput: true,
              useChips: true,
              multiple: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qassignlp.sources',
              select: { label: 'SourceCode', id: 'SourceCode' },
              requestParams: { filter: { active: 1, company_id: moduleStore.companySelected } }
            }
          },
          slot: {
            value: [3],
            type: 'select',
            colClass: 'col-12 col-md-6',
            fakeFieldName: 'value',
            props: {
              label: this.$tr('ileads.cms.form.ignoreSlots'),
              useInput: true,
              useChips: true,
              multiple: true,
              options: [
                { label: 'Slot 1', value: 1 },
                { label: 'Slot 2', value: 2 },
                { label: 'Slot 3', value: 3 },
                { label: 'Slot 4', value: 4 }
              ]
            }
          },
          rnkId: {
            value: ['5', '6', '7'],
            type: 'select',
            colClass: 'col-12 col-md-6',
            fakeFieldName: 'value',
            props: {
              label: this.$tr('ileads.cms.form.ignoreRnkId'),
              useInput: true,
              useChips: true,
              multiple: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qassignlp.rank',
              select: { label: 'descr', id: 'id' },
              requestParams: { filter: { active: true, company_id: moduleStore.companySelected } }
            }
          },
          ignoreCredit: {
            value: [],
            type: 'select',
            colClass: 'col-12 col-md-6',
            fakeFieldName: 'value',
            props: {
              label: this.$tr('ileads.cms.form.ignoreCredit'),
              useInput: true,
              useChips: true,
              multiple: true,
              options: this.creditOptions
            }
          },
          daysSalesman: {
            value: 7,
            type: 'input',
            colClass: 'col-12 col-md-6',
            fakeFieldName: 'value',
            help: { description: this.$tr('ileads.cms.messages.descDaysSalesman') },
            props: {
              type: 'number',
              label: this.$tr('ileads.cms.form.daysSalesman')
            }
          },
          profitWeight: {
            value: 30,
            type: 'input',
            colClass: 'col-12 col-md-6',
            fakeFieldName: 'value',
            required: true,
            help: { description: this.$tr('ileads.cms.messages.descProfit') },
            props: {
              type: 'number',
              label: this.$tr('ileads.cms.form.profitWeight'),
              suffix: '%',
              rules: [
                val => val >= 0 && val <= 100 || this.$tr('ileads.cms.messages.valuesBetween0to100')
              ]
            }
          },
          currentDistanceWeight: {
            value: 60,
            type: 'input',
            colClass: 'col-12 col-md-6',
            required: true,
            help: { description: this.$tr('ileads.cms.messages.descNextAppt') },
            fakeFieldName: 'value',
            props: {
              type: 'number',
              label: this.$tr('ileads.cms.form.currentDistanceWeight'),
              suffix: '%',
              rules: [
                val => val >= 0 && val <= 100 || this.$tr('ileads.cms.messages.valuesBetween0to100')
              ]
            }
          },
          futureDistanceWeight: {
            value: 10,
            type: 'input',
            colClass: 'col-12 col-md-6',
            required: true,
            help: { description: this.$tr('ileads.cms.messages.descFutureAppt') },
            fakeFieldName: 'value',
            props: {
              type: 'number',
              label: this.$tr('ileads.cms.form.futureDistanceWeight'),
              suffix: '%',
              rules: [
                val => val >= 0 && val <= 100 || this.$tr('ileads.cms.messages.valuesBetween0to100')
              ]
            }
          },
          costPerMile: {
            value: 0.6,
            type: 'input',
            colClass: 'col-12 col-md-6',
            required: true,
            help: { description: this.$tr('ileads.cms.messages.descCostPerMile') },
            fakeFieldName: 'value',
            props: {
              type: 'number',
              suffix: '$',
              label: this.$tr('ileads.cms.form.costPerMile')
            }
          }
        }
      };
    },
    //Crud info
    crudInfo() {
      return this.$store.state.qcrudComponent.component[this.crudId] || {};
    }
  },
  methods: {
    init() {
      //trigger get ip actions
      this.$store.dispatch('qsiteApp/GET_IP_ADDRESS');
    }
  }
};
</script>
