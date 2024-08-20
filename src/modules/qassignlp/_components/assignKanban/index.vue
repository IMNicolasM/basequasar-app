<template>
  <div id="assignKanban">

  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'

export default defineComponent({
  props: {},
  components: {},
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
