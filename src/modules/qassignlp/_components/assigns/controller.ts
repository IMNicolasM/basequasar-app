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
      const  {added} = evt;

      const leadId = added?.element.id;
      const slot = added?.element.slot;
      const index = added?.newIndex;

      if(leadId && index > 0) {
        props.data.data[index].loading = true
        const body = {
            leadId,
            slrId: props.row.slrId,
            slot,
            rowInfo: props.row
        }

        await service.calculateAndUpdate(body).then(r => {
          if(r.distance) {
            props.data.data[index].distance = r.distance
          }
        }).catch(e => console.error(e))

        props.data.data[index].loading = false
      }
    }
  }

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
