import {computed, reactive, ref, onMounted, toRefs, watch, markRaw, shallowRef, nextTick} from "vue";
// @ts-ignore
import dynamicForm from 'src/modules/qsite/_components/master/dynamicForm.vue';
import {clone, i18n} from 'src/plugins/utils'


export default function controller(props, emit) {

  // Refs
  const refs = {
    refForm: ref<typeof dynamicForm>()
  }

  // States
  const state = reactive({
    show: false,
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
                  options: {label: 'name', value: 'id'}
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
      emit('runAnr', state.formTemplate)
      state.show = false
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
