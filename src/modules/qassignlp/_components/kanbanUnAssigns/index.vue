<template>
  <div id="dynamic-kanban" class="flex row tw-overflow-x-auto tw-whitespace-nowrap no-wrap">
    <div v-for="column in columns" class="tw-min-w-28 col-3 kanban-column">
      <!-- Header -->
      <div v-if="column.label"
           class="kanban-title text-center text-capitalize flex tw-justify-center tw-items-center"
      >
        <p>{{ column.label }}</p>
      </div>

      <!-- Draggable area -->
      <draggable
        class="tw-min-h-5 drag-h tw-p-2"
        :style="column.style"
        :group="column.field"
        v-bind="kanbanProps"
        :list="rows[column.field]"
        @change="(evt) => $emit('change', {evt, kanban: 'unassign',column, row: rows[column.field]})"
        >
        <template #item="{ element }">
          <div>
            <!-- dynamic content -->
            <contentType
              class="cursor-pointer q-pb-sm"
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
  emits: ['change'],
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
#dynamic-kanban {
  .kanban-column:first-child .kanban-title {
    border-radius: $custom-radius 0 0 0;
  }

  .kanban-column:last-child .kanban-title {
    border-radius: 0 $custom-radius  0 0;
  }

  .kanban-title {
    background-color: $primary;
    color: white;
    min-height: 30px;
    font-weight: bold;
    font-size: 13px !important;
  }

  .drag-h {
    height: calc(100% - 30px);
  }

  .q-table__card {
    background-color: transparent !important;
    box-shadow: none !important;
  }
}
</style>
