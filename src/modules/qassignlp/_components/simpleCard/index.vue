<template>
  <q-card bordered class="tw-w-34 tw-border-l-2 tw-text-[9px]" :style="{ borderLeftColor: col?.borderColor }">
    <q-card-section class="wrap q-px-sm q-pt-xs q-pb-none">
      <div class="tw-font-bold tw-text-gray-800" style="white-space: normal; word-wrap: break-word;">
        {{ row?.brnId }}: {{ row?.city }}, {{ row.state }} - <span :style="{color: COLORS[row?.dspId] || 'black'}">{{ row?.dspId }}</span>
      </div>
      <div v-if="row?.rnkId > 0">Grade: <span :style="{color: GRADE_COLORS[row?.rnkId] || 'black', fontWeight: 'bold'}">{{ row?.rnkDesc }}</span></div>
      <div class="tw-font-bold text-secondary tw-text-xs" v-if="row?.isFollowUp">Followup</div>
      <div class="tw-font-semibold tw-text-gray-600">{{ this.$trd(row?.apptdate, {type: 'time'}) }}</div>
    </q-card-section>
    <q-card-section class="wrap q-px-sm q-py-none">
      <span v-if="row?.logit && row?.score">PSA: {{ $trc(row.score/row.logit, 'en-us') }}<br/></span>
      <span v-if="row?.logit">Pct: {{ $trn(100*row.logit)}}%<br/></span>
      <span v-if="row?.score">EV: {{ $trc(row.score, 'en-us')}} <br/></span>
      <span v-if="row?.crTier">CR: {{ row.crTier}}</span>
    </q-card-section>
    <div class="tw-font-semibold tw-text-gray-600" v-if="row?.distance">({{ parseInt(row.distance) }} mi /
      {{ getDriveTime(row.distance) }} mins)
    </div>
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
