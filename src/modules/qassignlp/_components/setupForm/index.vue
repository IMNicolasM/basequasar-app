<template>
  <!--Modal with form to category-->
  <div>
    <master-modal
      id="modalSetupForm" v-model="show" v-bind="modalProps" custom-position @hide="resetModal">
      <div class="modal-crud">
        <div id="cardContent" class="row col-1">
          <div class="relative-position col-12">
            <q-form
              autocorrect="off"
              autocomplete="off"
              ref="formContent"
              class="row q-col-gutter-md col-12"
              @submit="createItem"
              @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))"
            >
              <!--Fields-->
              <div v-for="(field, key) in fields" :key="key" :ref="key" :class="field.colClass || 'col-12'">
                <!--Dynamic field-->
                <dynamic-field
                  v-model="formTemplate[field.name || key]"
                  :key="key"
                  :field="{...field, testId: (field.testId  || field.name || key)}"
                  :ref="`field-${field.name || key}`"
                />
              </div>
            </q-form>
          </div>
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
      apiRoute: 'apiRoutes.qassignlp.config'
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
            action: () => this.$refs.formContent.submit(),
            props: {
              color: 'primary',
              label: this.$tr('isite.cms.label.apply')
            }
          }
        ]
      };
    },
    fields() {
      return {
        id: {value: ''},
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
  },
  methods: {
    //Init form
    async initForm() {
      this.loading = true;//loading
      await this.getDataItem();//Get data item
      this.loading = false;
    },
    //Get data category to update
    getDataItem() {
      return new Promise((resolve, reject) => {
        let params = {//Params to request
          refresh: true
        };
        this.$crud.index(this.apiRoute, params).then(response => {
          const res = response.data[0];

          const value = res.DataValue;

          let objValue = {};
          if (typeof value == 'string') {
            try {
              objValue = JSON.parse(value);
            } catch (error) {
              console.error("Invalid JSON string:", error);
            }
          }

          this.formTemplate = {
            ...this.formTemplate,
            ...objValue
          }
          resolve(true);
        }).catch(error => {
          this.$apiResponse.handleError(error, () => {
            this.messageWindow('error', this.$tr('isite.cms.message.errorRequest'));
            reject(false);
          });
        });
      });
    },
    async createItem() {
      if (await this.$refs.formContent.validate()) {
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
