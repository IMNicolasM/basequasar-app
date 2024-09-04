import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance, markRaw} from "vue";
import { i18n, clone } from 'src/plugins/utils'
import service from "../assigns/services";


export default function controller(props, emit) {
  const proxy = getCurrentInstance()!.appContext.config.globalProperties

  // Refs
  const refs = { }


  // States
  const state = reactive({})

  // Computed
  const computeds = {}


  // Methods
  const methods = {}

  // Mounted
  onMounted(() => {
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
