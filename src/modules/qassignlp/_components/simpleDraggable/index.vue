<template>
  <div id="dynamic-kanban" class="flex gap-3">
    <div v-for="column of columns" class="tw-min-w-20 tw-w-36 tw-p-2 tw-bg-gray-50 tw-rounded-md tw-shadow-md">
      <div v-if="column.label" class="kanban-title text-center text-capitalize">
        <p>{{ column.label }}</p>
      </div>
      <draggable
        v-bind="kanbanProps"
        :list="rows[column.field]"
        @start="dragColumn = true"
        @end="show"
        :move="show"
      >
        <template #item="{ element }">
          <div>
            <q-inner-loading v-if="loading" showing color="primary"/>
            <!-- dynamic content  -->
            <contentType
              :v-else="!loading"
              :col="column"
              :row="element"
            />
          </div>
        </template>
      </draggable>
    </div>
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
    rows: {default: []},
    columns: {default: []},
    actions: {default: []}
  },
  components: {
    draggable,
    contentType
  },
  //emits: ['startDrag', 'endDrag', 'changeDrag'],
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
