<template>
  <!--Modal with form to category-->
  <div>
    <master-modal
      id="modalSetupForm" v-model="show" v-bind="modalProps" custom-position>
      <div class="modal-crud">
        <div id="cardContent" class="row col-1">
          <div class="relative-position col-12">
            <q-form
              autocorrect="off"
              autocomplete="off"
              ref="formContent"
              class="row q-col-gutter-md col-12"
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
    modelValue: { default: false }
  },
  emits: ['update:modelValue'],
  components: {},
  watch: {
    modelValue(newValue) {
      this.show = this.$clone(newValue);
    },
    show(newValue) {
      this.$emit('update:modelValue', this.show);
    }
  },
  mounted() {
    this.$nextTick(function() {
      this.show = this.modelValue;
    });
  },
  data() {
    return {
      show: false,
      formTemplate: {}
    };
  },
  computed: {
    //modal props
    modalProps() {
      //Response
      return {
        title: 'Setup ANR',
        width: 'max-content',
        actions: [
          {
            action: () => this.show = false,
            props: {
              color: 'grey',
              label: this.$tr('isite.cms.label.cancel')
            }
          },
          {
            action: () => this.show = false,
            props: {
              color: 'primary',
              label: this.$tr('isite.cms.label.save')
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
          value: 'ALL',
          type: 'select',
          colClass: 'col-12 col-md-6',
          props: {
            label: this.$tr('ileads.cms.form.brnId'),
            options: [
              { label: '-- ALL --', value: 'ALL' }
            ]
          },
          loadOptions: {
            apiRoute: 'apiRoutes.qassignlp.branches',
            select: {label: 'ShortName', id: 'ShortName'} //{label: 'LongName', id: 'ShortName'}
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
              { label: 'Slot 1', value: 1 },
              { label: 'Slot 2', value: 2 },
              { label: 'Slot 3', value: 3 },
              { label: 'Slot 4', value: 4 }
            ]
          }
        },
      }
    }
  },
  methods: {}
};
</script>

<!--<script lang="ts">-->
<!--import {defineComponent} from 'vue'-->
<!--import controller from './controller'-->

<!--export default defineComponent({-->
<!--  props: {-->
<!--    modelValue: { default: false },-->
<!--    itemId: { default: false },-->
<!--    field: { default: false },-->
<!--    params: { default: false }-->
<!--  },-->
<!--  setup(props, {emit}) {-->
<!--    return controller(props, emit)-->
<!--  }-->
<!--})-->
<!--</script>-->
<!--<style lang="scss">-->
<!--</style>-->
