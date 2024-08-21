<template>
  <!--cell content-->
  <div :style="col?.style">
    <!--      @change="reorderColumns"-->
    <draggable
      v-if="isDraggable"
      :list="data"
      group="table"
      item-key="slrName"
    >
      <template #item="{ element }">
        <div>
          {{ element }}
        </div>
      </template>
    </draggable>
    <!--    <draggable-->
    <!--      v-if="isDraggable"-->
    <!--      :list="data"-->
    <!--      group="table"-->
    <!--      item-key="slrName"-->
    <!--    >-->

    <!--      <template #item="{ element }">-->
    <!--&lt;!&ndash;        <div>&ndash;&gt;-->
    <!--&lt;!&ndash;          {{ element }}&ndash;&gt;-->
    <!--&lt;!&ndash;        </div>&ndash;&gt;-->

    <!--        &lt;!&ndash;        <div v-if="!loading" :class="{'notMoveBetweenColumns': element.type !== 1}">&ndash;&gt;-->
    <!--        &lt;!&ndash;          <kanbanColumn&ndash;&gt;-->
    <!--        &lt;!&ndash;            :column-data="element"&ndash;&gt;-->
    <!--        &lt;!&ndash;            :columnIndex="index"&ndash;&gt;-->
    <!--        &lt;!&ndash;            :totalColumns="kanbanColumns.length"&ndash;&gt;-->
    <!--        &lt;!&ndash;            :ref="`kanbanColumn-${element.id}`"&ndash;&gt;-->
    <!--        &lt;!&ndash;            class="&ndash;&gt;-->
    <!--        &lt;!&ndash;                tw-flex-none tw-space-y-0&ndash;&gt;-->
    <!--        &lt;!&ndash;                w-h-auto&ndash;&gt;-->
    <!--        &lt;!&ndash;                tw-bg-gray-100 tw-rounded-lg tw-shadow&ndash;&gt;-->
    <!--        &lt;!&ndash;              "&ndash;&gt;-->
    <!--        &lt;!&ndash;          />&ndash;&gt;-->
    <!--        &lt;!&ndash;        </div>&ndash;&gt;-->
    <!--      </template>-->
    <!--    </draggable>-->
    <!-- custom component -->
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
