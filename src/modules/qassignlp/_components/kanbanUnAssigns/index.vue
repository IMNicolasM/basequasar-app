<template>
  <div id="dynamic-kanban">
    <div v-if="title" class="kanban-title text-center text-capitalize">
      <p>{{ title }}</p>
    </div>
    <draggable
      v-bind="kanbanProps"
      :list="list"
      @start="(val) => show('startDrag',val)"
      @end="(val) => show(val)"
      @change="(val) => show('changeDrag', val)"
    >
      <template #item="{ element }">
        <div>
          <q-inner-loading v-if="loading" showing color="primary"/>
          <!-- dynamic content  -->
          <contentType
            :v-else="!loading"
            :col="element.col"
            :row="element.row"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'
import contentType from '../dynamicTableClone/components/contentType.vue'
import draggable from "vuedraggable";

export default defineComponent({
  props: {
    kanbanProps: {default: null},
    loading: {default: false},
    title: {default: ''},
    list: {default: []},
    actions: {default: []}
  },
  components: {
    draggable,
    contentType,
  },
  emits: ['startDrag', 'endDrag', 'changeDrag'],
  setup(props, {emit}) {
    return controller(props, emit)
  },
  computed: {
    windowSize() {
      return window.innerWidth >= '500' ? 'desktop' : 'mobile'
    },
  },
  methods: {
    showPagination(props) {
      return this.windowSize == 'desktop' && props.pagesNumber > 1
    }
  },
})
</script>
<style lang="scss">
#dynamic-kanban {
  .kanban-title {
    border-color: $grey-2;
    border-radius: $custom-radius;
    color: $blue-grey;
    font-weight: bold;
    font-size: 13px !important;
  }

  .q-table__top, .q-table__middle, .q-table__bottom {

    //box-shadow: $custom-box-shadow;
  }


  .q-table__card {
    background-color: transparent !important;
    box-shadow: none !important;
  }

  .q-table th,
  .q-table td {

  }
}
</style>
