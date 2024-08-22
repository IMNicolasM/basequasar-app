<template>
  <!--cell content-->
  <div :style="col?.style">
    <!--      @change="reorderColumns"-->
    <draggable
      class="tw-flex wrap tw-items-center tw-justify-center tw-max-w-72"
      v-if="isDraggable"
      :list="data"
      group="table"
      item-key="slrName"
    >
      <template #item="{ element }">
        <div>
          <q-card bordered class="tw-min-w-34 tw-max-w-36 tw-border-l-2" :style="{ borderLeftColor: col.borderColor }">
            <q-card-section class="wrap q-pa-sm tw-text-[10px]">
              <div class="tw-font-bold tw-text-gray-800" style="white-space: normal; word-wrap: break-word;">{{element.brnId}}: {{ element.csz }}</div>
              <div class="tw-font-semibold tw-text-gray-600">{{ $trd(element.apptClockTime, {type: 'time'}) }}</div>
              <div class="tw-font-semibold tw-text-gray-600" v-if="element.distance">({{ parseInt(element.distance) }} mi / {{ getDriveTime(element.distance) }} mins)</div>
            </q-card-section>
          </q-card>
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

export default defineComponent({
  components: {draggable},
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
