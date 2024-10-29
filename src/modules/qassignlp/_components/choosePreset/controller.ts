import {computed, reactive, ref, onMounted, toRefs, watch, markRaw, shallowRef, nextTick} from "vue";
// @ts-ignore
import dynamicForm from 'src/modules/qsite/_components/master/dynamicForm.vue';
// @ts-ignore
import {clone, i18n, alert} from 'src/plugins/utils'


export default function controller(props, emit) {

  // Refs
  const refs = {
    refForm: ref<typeof dynamicForm>()
  }

  // States
  const state = reactive({
    show: false,
    presets: [],
    formTemplate: {}
  })

  // Computed
  const computeds = {
    modalProps: computed(() => {
      return {
        title: 'Run ANR',
        actions: [
          {
            action: () => state.show = false,
            props: {
              color: 'grey',
              label: i18n.tr('isite.cms.label.cancel')
            }
          },
          {
            action: () => refs.refForm.value.changeStep('next', true),
            props: {
              color: 'primary',
              label: i18n.tr('isite.cms.label.run')
            }
          }
        ]
      };
    }),
    fields: computed(() => {

      return [
        {
          name: 'main',
          fields: {
            configId: {
              type: 'crud',
              colClass: 'col-12',
              props: {
                type: 'select',
                // @ts-ignore
                crudData: import('src/modules/qassignlp/_crud/configLeads'),
                crudProps: {
                  label: `${i18n.tr('ileads.cms.form.choosePreset')}*`,
                },
                config: {
                  type: 'select',
                  options: {label: 'name', value: 'id'},
                  loadedOptions: (data: any[]) => state.presets = data
                },
              },
            },
          }
        }
      ]
    })
  };

  // Methods
  const methods = {
    emitData(){
      if(!props.hasPendingChanges) {
        emit('runAnr', { body: state.formTemplate, presets: state.presets })
        state.show = false
      } else {
        alert.warning(i18n.tr('ileads.cms.messages.beforeRunANR'));
      }
    }

  }

  // Mounted
  onMounted(() => {
    nextTick(function () {
      state.show = props.modelValue
    })
  })

  // Watch
  watch(() => props.modelValue, (newValue, oldField): void => {
    state.show = clone(newValue);
  })

  watch(() => state.show, (newValue, oldField): void => {
    emit('update:modelValue', newValue);
  })

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
