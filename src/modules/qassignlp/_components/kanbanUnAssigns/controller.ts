import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance, markRaw} from "vue";
import { i18n, clone } from 'src/plugins/utils'
import service from "../assigns/services";


export default function controller(props, emit) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
    pagination: ref({
      page: 1,
      //rowsNumber: props.initialPagination.rowsNumber,
      rowsPerPage: 10,
      descending: true,
      //sortBy: 'desc',
    }),
  }


  // States
  const state = reactive({
    // Key: Default Value
    dragColumn: false
  })

  // Computed
  const computeds = {
    rowsPerPageOption: computed(() => [5, 10, 20, 50, 100, 300, 500])
  }


  // Methods
  const methods = {
    async moveDrag(evt) {
      const  {added} = evt;

      const leadId = added?.element.id;
      const slot = added?.element.slot;
      const index = added?.newIndex;

      if(leadId && index >= 0) {
        props.rows[`slot${slot}`][index].distance = null
      }
    }
  }

  // Mounted
  onMounted(() => {
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
