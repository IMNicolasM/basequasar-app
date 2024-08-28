<template>
  <q-card bordered class="tw-w-34 tw-border-l-2" :style="{ borderLeftColor: col?.borderColor }">
    <q-card-section class="wrap q-pa-sm tw-text-[10px]">
      <div class="tw-font-bold tw-text-gray-800" style="white-space: normal; word-wrap: break-word;">
        {{ row?.brnId }}: {{ row?.csz }} {{ row?.dspId }}
      </div>
      <div class="tw-font-bold text-secondary tw-text-xs" v-if="row?.followupdate">Followup</div>
      <div class="tw-font-semibold tw-text-gray-600">{{ this.$trd(row?.apptdate, {type: 'time'}) }}</div>
      <div class="tw-font-semibold tw-text-gray-600" v-if="row?.distance">({{ parseInt(row.distance) }} mi /
        {{ getDriveTime(row.distance) }} mins)
      </div>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'

export default defineComponent({
  props: {
    row: {default: null},
    col: {default: null}
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
