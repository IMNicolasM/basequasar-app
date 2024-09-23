<template>
  <q-card bordered class="tw-text-[9px]" :style="{ backgroundColor: col?.borderColor }">
    <q-card-section class="wrap q-px-sm q-pt-xs q-pb-none">
      <div class="tw-font-bold tw-text-gray-800" style="white-space: normal; word-wrap: break-word;">
        {{ row?.brnId }}: {{ row?.city }}, {{ row.state }} - <span
        :style="{color: COLORS[row?.dspId] || 'black'}">{{ row?.dspId }}</span>
      </div>
      <div v-if="row?.rnkId > 0">Grade: <span :style="{color: GRADE_COLORS[row?.rnkId] || 'black', fontWeight: 'bold'}">{{
          row?.rnkDesc
        }}</span></div>
      <div class="tw-font-bold text-secondary tw-text-xs" v-if="row?.isFollowUp">Followup</div>
      <div class="tw-font-semibold tw-text-gray-900">{{ this.$trd(row?.apptdate, {type: 'time'}) }}</div>
    </q-card-section>
    <q-card-section class="wrap q-px-sm q-py-none">
      <span v-if="row?.crTier">CR: {{ row.crTier }}</span>
    </q-card-section>
    <div class="flex q-px-sm items-center">
      <!-- Distancia centrada -->
      <div class="full-width tw-max-w-[90%] flex-grow text-center tw-font-semibold tw-text-gray-600" v-if="row?.distance">
        ({{ parseInt(row.distance) }} mi / {{ getDriveTime(row.distance) }} mins)
      </div>
      <q-space v-else />
      <!-- Icono del lock con max-width de 10% -->
      <div class="tw-max-w-[10%] tw-text-right">
        <q-icon
          v-if="block && !row?.isFollowUp"
          size="12px"
          color="amber-8"
          :name="`fa-solid fa-lock${isBlock ? '' : '-open'}`"
          @click="togglePriority"/>
      </div>
    </div>
  </q-card>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import controller from './controller'

export default defineComponent({
  props: {
    row: {default: null},
    col: {default: null},
    block: {default: false}
  },
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
