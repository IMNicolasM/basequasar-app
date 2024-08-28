import {reactive,toRefs} from "vue";

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
    getDriveTime(dist: string) {
      const average_speed_mph = 50
      let distance = parseInt(dist) || 0

      return Math.round(distance / average_speed_mph * 60)
    }
  }

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
