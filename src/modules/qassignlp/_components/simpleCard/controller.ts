import {computed, reactive, toRefs} from "vue";
import {i18n} from "../../../../plugins/utils";

export default function controller(props, emit) {

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    blockCard: false,
    COLORS: {
      Verif: 'red',
      Set: 'red'
    },
    GRADE_COLORS: {
      5: 'green',
      3: '#df7315',
      2: 'blue'
    }
  })

  // Computed
  const computeds = {
    isBlock: computed(() => {
      return state.blockCard || props.row.priorityScore == -1
    })
  }

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
