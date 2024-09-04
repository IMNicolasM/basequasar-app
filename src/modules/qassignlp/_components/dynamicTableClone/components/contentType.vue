<template>
  <!--cell content-->
  <div :style="col?.style">
    <component
      v-if="component"
      v-show="!isLoading"
      v-bind="componentProps?.props"
      v-on="componentProps?.events || {}"
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

export default defineComponent({
  components: {},
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
