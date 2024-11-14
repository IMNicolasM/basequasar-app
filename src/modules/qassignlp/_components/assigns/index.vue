<template>
  <!--cell content-->
  <div :class="[
    'flex tw-min-w-28 tw-m-auto tw-h-full tw-items-center tw-justify-center relative',
    {'tw-bg-gray-300 tw-rounded-md tw-text-center tw-font-semibold tw-text-gray-800': data.active === false}]">
    <!-- Fondo dinámico -->
    <div v-if="isDragStart" class="background-overlay" :style="style">
    </div>
    <div v-if="data.active === false" class="cursor-not-allowed ">
      Not on Schedule
    </div>
    <draggable
      v-if="!!(data.data?.length) || data.active === true"
      :class="`full-width flex wrap tw-items-center tw-justify-center tw-min-h-5 ${data.active === true ? 'tw-h-full' : ''}`"
      :list="data.data"
      :group="col.field || 'table'"
      item-key="id"
      v-bind="$attrs"
      @change="moveDrag"
      @start="onDragStart"
      @end="onDragEnd"
    >
      <template #item="{ element }">
        <div class="cursor-pointer q-pb-xs tw-min-w-28 md:tw-w-30 lg:tw-w-40">
          <simple-card :row="element" :col="col" :block="block" @change-lock="changeData" />
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
    block: {default: false},
    isDragStart: {default: false},
    style: {default: null},
  },
  emits: ['changeLock', 'change', 'onDragStart', 'onDragEnd'],
  setup(props, {emit, attrs}) {
    return { ...controller(props, emit), attrs };
  }
})
</script>
<style lang="scss">
</style>
