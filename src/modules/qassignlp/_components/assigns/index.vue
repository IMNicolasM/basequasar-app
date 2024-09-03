<template>
  <!--cell content-->
  <div :class="data.active === false ? 'tw-bg-gray-300 tw-py-2 tw-px-4 tw-rounded-md tw-text-center tw-font-semibold tw-text-gray-800' : ''">
    <div v-if="data.active === false" class="cursor-not-allowed">
      Not on Schedule
    </div>
    <draggable
      class="tw-flex wrap tw-items-center tw-justify-center tw-max-w-30 lg:tw-max-w-36"
      :list="data.data"
      :group="col.field || 'table'"
      item-key="slrName"
    >
      <template #item="{ element }">
        <div class="cursor-pointer">
          <simple-card :row="element" :col="col" :block="true" />
        </div>
      </template>
    </draggable>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'
import simpleCard from "../simpleCard/index.vue";
import draggable from "vuedraggable";

export default defineComponent({
  components: {draggable, simpleCard},
  props: {
    row: {default: null},
    col: {default: null},
    data: {default: null}
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
