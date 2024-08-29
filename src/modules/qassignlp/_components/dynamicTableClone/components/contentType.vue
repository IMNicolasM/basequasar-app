<template>
  <!--cell content-->
  <div :style="col?.style" :class="data.active === false ? 'tw-bg-gray-300 tw-py-2 tw-px-4 tw-rounded-md tw-text-center tw-font-semibold tw-text-gray-800' : ''">
    <div v-if="data.active === false">
      Not on Schedule
    </div>
    <!--      @change="reorderColumns"-->
    <draggable
      class="tw-flex wrap tw-items-center tw-justify-center tw-max-w-36"
      v-if="isDraggable"
      :list="data.data"
      group="table"
      item-key="slrName"
    >
      <template #item="{ element }">
        <div class="cursor-pointer">
          <simple-card :row="element" :col="col" />
        </div>
      </template>
    </draggable>
    <component
      v-else-if="component"
      v-show="!isLoading"
      :is="component"
      :col="col"
      :row="row"
      :data="data"
    />
    <!-- default content -->
    <div v-else-if="!isComponent" v-show="!isLoading" class="ellipsis" v-html="deleteHtml(data)"></div>
    <q-skeleton v-if="isLoading" animated type="text"/>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from '../controllers/contentTypeController'
import draggable from "vuedraggable";
import simpleCard from '../../simpleCard/index.vue'

export default defineComponent({
  components: {draggable, simpleCard},
  props: {
    col: {default: []},
    row: {default: []}
  },
  setup(props, {emit}) {
    return controller(props, emit)
  },
  computed: {
    deleteHtml() {
      return data => {
        if (!data) return '';
        return typeof data === 'string' ?
          data.replace(/<[^>]+>/g, '') :
          data;
      };
    },
  }
})
</script>
<style lang="scss">
</style>
