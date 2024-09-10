<template>
  <!--cell content-->
  <div :class="data.active === false ? 'tw-bg-gray-300 tw-py-2 tw-px-4 tw-rounded-md tw-text-center tw-font-semibold tw-text-gray-800' : '' + 'tw-w-30 md:tw-w-32 lg:tw-w-36 tw-m-auto'">
    <div v-if="data.active === false" class="cursor-not-allowed">
      Not on Schedule
    </div>
    <draggable
      v-else-if="data.data?.length || data.active === true"
      class="flex wrap tw-items-center tw-justify-center tw-w-30 md:tw-w-32 lg:tw-w-36 tw-min-h-5 tw-border tw-border-[#B0BEC5] tw-m-auto tw-p-1"
      :list="data.data"
      :group="col.field || 'table'"
      item-key="id"
      v-bind="$attrs"
      @change="moveDrag"
    >
      <template #item="{ element }">
        <div class="cursor-pointer q-pb-xs tw-w-28 md:tw-w-30 lg:tw-w-34">
          <simple-card :row="element" :col="col" :block="block" />
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
    data: {default: null},
    block: {default: false}
  },
  setup(props, {emit, attrs}) {
    return { ...controller(props, emit), attrs };
  }
})
</script>
<style lang="scss">
</style>
