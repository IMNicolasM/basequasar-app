import {computed, reactive, ref, onMounted, toRefs, watch, markRaw, shallowRef, nextTick} from "vue";
// @ts-ignore
import dynamicForm from 'src/modules/qsite/_components/master/dynamicForm.vue';
// @ts-ignore
import {clone, i18n, store, cache} from 'src/plugins/utils'


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
        title: i18n.tr('ileads.cms.title.chooseCompany'),
        persistent: true,
        hideCloseAction: true,
        actions: [
          {
            action: () => refs.refForm.value.changeStep('next', true),
            props: {
              color: 'primary',
              label: i18n.tr('isite.cms.label.select')
            }
          }
        ]
      };
    }),
    fields: computed(() => {
      const user = store.getters['quserAuth/user']
      const companyAssigned = user?.options?.companyAssigned || []
      return [
        {
          name: 'main',
          fields: {
            companyId: {
              type: 'select',
              required: true,
              colClass: 'col-12',
              props: {
                label: i18n.tr('ileads.cms.form.company'),
              },
              loadOptions: {
                apiRoute: 'apiRoutes.qsetuprenuity.setupCompanies',
                select: {label: 'name', id: 'id'},
                requestParams: {
                  id: companyAssigned
                }
              }
            }
          }
        }
      ]
    })
  };

  // Methods
  const methods = {
    emitData(){
      emit('selected', { body: state.formTemplate })
      state.show = false
    }

  }

  // Mounted
  onMounted(async () => {
    const sessionData = await cache.get.item('sessionData')

    if(sessionData) {
      sessionData.userData.companySelected = 1
      await cache.set('sessionData', sessionData)

      console.warn(sessionData)

    }

    console.warn("Init: ",{ sessionData, s: cache.get.item('sessionData'), user: store.getters['quserAuth/user'] })
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
