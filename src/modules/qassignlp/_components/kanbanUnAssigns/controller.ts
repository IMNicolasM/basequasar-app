import {computed, reactive, ref, onMounted, toRefs} from "vue";


export default function controller(props, emit) {
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
