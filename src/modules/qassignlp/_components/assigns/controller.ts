import {reactive,toRefs} from "vue";
import service from './services'

export default function controller(props, emit) {

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({})

  // Computed
  const computeds = {}

  // Methods
  const methods = {
    async moveDrag(evt) {
      emit('change', {evt, row: props.row})
    },
    changeData(data) {
      emit('changeLock', data)
    }
  }

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
