import {computed, reactive, ref, onMounted, toRefs, watch, getCurrentInstance, markRaw} from "vue";
import { i18n, clone } from 'src/plugins/utils'


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
    
  })

  // Computed
  const computeds = {
    // key: computed(() => {})    

    //pagination: computed(() => props.pagination),

    

    rowsPerPageOption: computed(() => [5, 10, 20, 50, 100, 300, 500]),
    /*
    windowSize: computed(() => props.window >= '500' ? 'desktop' : 'mobile'),
     //showPagination
    showPagination: computed(() => computeds.windowSize == 'desktop' && props.pagination.pagesNumber > 1)
    //showPagination: computed(() => true)
    */
  }
  

  // Methods
  const methods = {
    // methodKey: () => {}    
    countPage(pagination){
      const page = pagination.pagination.page;
      const rowsPerPage = pagination.pagination.rowsPerPage;
      const showTable = props.initialPagination.rowsNumber;
      const totalPage = props.initialPagination.rowsNumber;
      const start = page == 1 ? 1 : page * rowsPerPage - ((rowsPerPage - (page - 1)) <= 0 ? 1 : rowsPerPage - (page - 1));
      const end = showTable < rowsPerPage ? totalPage : page * rowsPerPage;
      return `${start} - ${end} ${i18n.tr('isite.cms.label.of')} ${totalPage}`
    },
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
