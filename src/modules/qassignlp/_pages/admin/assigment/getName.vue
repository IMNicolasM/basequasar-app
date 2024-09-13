<template>
  <div class="tw-text-center flex column tw-items-center tw-justify-center"  style="white-space: normal; word-wrap: break-word;">
    <span class="tw-font-bold">{{ row.brnId }}</span>
    {{ row.slrName }}
  </div>
</template>
<script>
import {defineComponent} from 'vue';

export default defineComponent({
  props: {
    row: {default: {}},
    col: {default: {}},
    data: {default: {}}
  },
  components: {},
});
</script>
<style lang="scss">
</style>
