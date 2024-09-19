<template>
  <!--Modal with form to category-->
  <div>
    <master-modal
      id="modalSetupForm" v-model="show" v-bind="modalProps" custom-position @hide="resetModal">
      <div class="modal-crud">
        <div id="cardContent" class="row col-12">
          <dynamic-form class="col-12 full-width" ref="refForm" v-model="formTemplate" formType="collapsible"
                        :blocks="fields" no-actions no-reset-with-blocks-update @submit="createItem"/>
        </div>
      </div>
    </master-modal>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {default: false},
    saveInDb: {default: false}
  },
  emits: ['update:modelValue'],
  components: {},
  watch: {
    modelValue(newValue) {
      this.show = this.$clone(newValue);
    },
    show(newValue) {
      this.$emit('update:modelValue', this.show);
      if (newValue) this.initForm()
    },
    'formTemplate.name'(newValue) {
      if(!this.goCreate) {
        console.warn(newValue)
        const config = this.loadedConfigs.find(i => i.id == newValue);

        if(config) {
          this.formTemplate = config
        }
      }
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.show = this.modelValue;
    });
  },
  data() {
    return {
      show: false,
      formTemplate: {},
      loading: false,
      goCreate: false,
      apiRoute: 'apiRoutes.qassignlp.config',
      emptyConfig: {
        name: '',
        value: {},
        active: '0',
        isDefault: '0'
      },
      loadedConfigs: []
    };
  },
  computed: {
    //modal props
    modalProps() {
      //Response
      return {
        title: 'Setup ANR',
        width: 'max-content',
        loading: this.loading,
        actions: [
          {
            action: () => this.show = false,
            props: {
              color: 'grey',
              label: this.$tr('isite.cms.label.cancel')
            }
          },
          {
            action: () => this.$refs.refForm.changeStep('next', true),
            props: {
              color: 'primary',
              label: this.$tr('isite.cms.label.apply')
            }
          }
        ]
      };
    },
    fields() {
      return [
        {
          name: 'main',
          title: this.$tr('ileads.cms.label.preset'),
          fields: {
            id: {value: ''},
            company: {value: 'MAD'},
            banner: {
              type: 'banner',
              colClass: 'col-12',
              props: {
                color: 'info',
                icon: 'fas fa-exclamation-triangle',
                message: this.goCreate ? this.$tr('ileads.cms.message.goSelectPreset') : this.$tr('ileads.cms.message.goCreatePreset'),
                actions: [
                  {
                    props: {
                      label: this.goCreate ? this.$tr('ileads.cms.message.selectPreset') : this.$tr('ileads.cms.message.createPreset')
                    },
                    action: () => {
                      this.goCreate = !this.goCreate
                      this.formTemplate = this.emptyConfig
                    }
                  }
                ]
              }
            },
            name: {
              type: this.goCreate ? 'input' : 'select',
              required: true,
              colClass: 'col-6',
              props: {
                label: `${this.$tr('ileads.cms.label.name')}*`
              },
              ...(this.goCreate
                ? {}
                : {
                    loadOptions: {
                      apiRoute: 'apiRoutes.qassignlp.config',
                      select: {label: 'name', id: 'id'}
                    },
                    loadedOptions: (val) => this.loadedConfigs = val
                  }
              )
            },
            active: {
              value: '1',
              type: 'select',
              colClass: 'col-6',
              required: true,
              props: {
                label: `${this.$tr('isite.cms.form.status')} *`,
                options: [
                  { label: this.$tr('isite.cms.label.enabled'), value: '1' },
                  { label: this.$tr('isite.cms.label.disabled'), value: '0' }
                ]
              }
            },
          }
        },
        {
          name: 'preset',
          title: this.$tr('ilead.cms.label.infoPreset'),
          fields: {
            milesHome: {
              value: 120,
              type: 'input',
              colClass: 'col-12 col-md-6',
              props: {
                type: 'number',
                label: this.$tr('ileads.cms.form.milesHome')
              },
            },
            milesTrip: {
              value: 100,
              type: 'input',
              colClass: 'col-12 col-md-6',
              props: {
                type: 'number',
                label: this.$tr('ileads.cms.form.milesTrip')
              },
            },
            brnId: {
              value: ['ALL'],
              type: 'select',
              colClass: 'col-12 col-md-6',
              props: {
                label: this.$tr('ileads.cms.form.brnId'),
                useInput: true,
                useChips: true,
                multiple: true,
                options: [
                  {label: '-- ALL --', value: 'ALL'}
                ]
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qassignlp.branches',
                select: {label: 'label', id: 'value'}
              }
            },
            slot: {
              value: [3],
              type: 'select',
              colClass: 'col-12 col-md-6',
              props: {
                label: this.$tr('ileads.cms.form.ignoreSlots'),
                useInput: true,
                useChips: true,
                multiple: true,
                options: [
                  {label: 'Slot 1', value: 1},
                  {label: 'Slot 2', value: 2},
                  {label: 'Slot 3', value: 3},
                  {label: 'Slot 4', value: 4}
                ]
              }
            },
            rnkId: {
              value: ['5', '6', '7'],
              type: 'select',
              colClass: 'col-12 col-md-6',
              props: {
                label: this.$tr('ileads.cms.form.ignoreRnkId'),
                useInput: true,
                useChips: true,
                multiple: true
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qassignlp.rank',
                select: {label: 'descr', id: 'id'},
                requestParams: {filter: {active: true}}
              }
            },
            daysSalesman: {
              value: 7,
              type: 'input',
              colClass: 'col-12 col-md-6',
              help: {description: this.$tr('ileads.cms.messages.descDaysSalesman')},
              props: {
                type: 'number',
                label: this.$tr('ileads.cms.form.daysSalesman')
              },
            },
            profitWeight: {
              value: 30,
              type: 'input',
              colClass: 'col-12 col-md-6',
              required: true,
              help: {description: this.$tr('ileads.cms.messages.descProfit')},
              props: {
                type: 'number',
                label: this.$tr('ileads.cms.form.profitWeight'),
                suffix: "%",
                rules: [
                  val => val >= 0 && val <= 100 || this.$tr('ileads.cms.messages.valuesBetween0to100')
                ],
              },
            },
            currentDistanceWeight: {
              value: 60,
              type: 'input',
              colClass: 'col-12 col-md-6',
              required: true,
              help: {description: this.$tr('ileads.cms.messages.descNextAppt')},
              props: {
                type: 'number',
                label: this.$tr('ileads.cms.form.currentDistanceWeight'),
                suffix: "%",
                rules: [
                  val => val >= 0 && val <= 100 || this.$tr('ileads.cms.messages.valuesBetween0to100')
                ],
              },
            },
            futureDistanceWeight: {
              value: 10,
              type: 'input',
              colClass: 'col-12 col-md-6',
              required: true,
              help: {description: this.$tr('ileads.cms.messages.descFutureAppt')},
              props: {
                type: 'number',
                label: this.$tr('ileads.cms.form.futureDistanceWeight'),
                suffix: "%",
                rules: [
                  val => val >= 0 && val <= 100 || this.$tr('ileads.cms.messages.valuesBetween0to100')
                ],
              },
            },
            costPerMile: {
              value: 0.6,
              type: 'input',
              colClass: 'col-12 col-md-6',
              required: true,
              help: {description: this.$tr('ileads.cms.messages.descCostPerMile')},
              props: {
                type: 'number',
                suffix: "$",
                label: this.$tr('ileads.cms.form.costPerMile')
              },
            },
          }
        }
      ]
    }
  },
  methods: {
    //Init form
    async initForm() {},
    async createItem() {
      let isValid = await this.$refs.refForm.validateCompleteForm()
      console.warn(this.formTemplate)
      if (false) {
        this.loading = true;
        let formData = this.$clone(this.formTemplate);
        let requestInfo = {response: false, error: false};//Default request response

        try {
          requestInfo.response = await this.$crud.post(
            this.apiRoute,
            {attributes: formData}
          );
        } catch (err) {
          requestInfo.error = err;
        }

        //Action after request
        if (requestInfo.response) {
          this.$alert.info({message: `${this.$tr('ileads.cms.messages.autoAssignerUpdate')}`});
        } else {
          this.$alert.error({message: `${this.$tr('ileads.cms.messages.autoAssignerNoUpdate')}`});
        }
        this.loading = false;//login hide
        this.show = false;
      }
    },
    resetModal() {
      this.formTemplate = {};
      this.show = false;
      this.loading = false
    }
  }
};
</script>
