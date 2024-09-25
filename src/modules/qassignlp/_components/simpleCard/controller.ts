import {computed, reactive, toRefs, watch} from "vue";
import {i18n} from "../../../../plugins/utils";

export default function controller(props, emit) {

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    COLORS: {
      Verif: 'red',
      Set: 'red'
    },
    GRADE_COLORS: {
      5: '#48BB78',
      3: '#F5A623',
      2: '#4A90E2',
      6: '#9B59B6',
      7: '#4A5568'
    }
  })

  // Computed
  const computeds = {
    isBlock: computed(() => {
      return props.row.priorityScore == -1
    })
  }

  // Methods
  const methods = {
    getDriveTime(dist: string) {
      const average_speed_mph = 50
      let distance = parseInt(dist) || 0

      return Math.round(distance / average_speed_mph * 60)
    },
    togglePriority() {
      if (props.row) {
        const prScore = props.row.priorityScore == -1 ? 0 : -1;
        props.row.priorityScore = prScore;
        emit('changeLock', {...props, prScore})
      }
    }
  }

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
