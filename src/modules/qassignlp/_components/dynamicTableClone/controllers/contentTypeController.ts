import {computed, reactive, ref, onMounted, toRefs, watch, markRaw, shallowRef} from "vue";

export default function controller(props, emit) {

  // Refs
  const refs = {
    // refKey: ref(defaultValue)
  }

  // States
  const state = reactive({
    // Key: Default Value
    component: shallowRef()
  })

  // Computed
  const computeds = {
    // key: computed(() => {})
    //data to display
    data: computed(() => props.col?.format ? props.col.format(props.row[props.col.name]) : props.row[props.col.name]),
    isComponent: computed(() => props.col?.component || false ),
    isLoading: computed(() => props.row?.isLoading || false),
    showOnLoading: computed(() =>  computeds.isLoading.value && props.col.name != 'id')
  }

  // Methods
  const methods = {
    // methodKey: () => {}
    init() {
      methods.loadComponent();
    },
    loadComponent(){
      if(computeds.isComponent.value){
        state.component = markRaw(props.col.component)
      }
    },
    getDriveTime(dist: string) {
      const average_speed_mph = 50
      let distance = parseInt(dist) || 0

      return Math.round(distance / average_speed_mph * 60)
    }
  }

  // Mounted
  onMounted(() => {
    methods.init()
  })

  // Watch
  // watch(key, (newField, oldField): void => {
  //
  // }, {deep: true})

  return {...refs, ...(toRefs(state)), ...computeds, ...methods}
}
