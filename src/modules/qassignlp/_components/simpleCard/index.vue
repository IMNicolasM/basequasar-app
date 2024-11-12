<template>
  <q-card bordered class="tw-text-[9px]" :style="{ backgroundColor: col?.borderColor }">
    <q-card-section class="wrap q-px-sm q-pt-xs q-pb-none">
      <div class="tw-font-bold tw-text-gray-800 tw-flex tw-items-center tw-whitespace-normal tw-break-words">
        <div class="tw-flex-grow">
          {{ row?.brnId }}: {{ row?.city }}, {{ row.state }} -
          <span :style="{ color: COLORS[row?.dspId] || 'black' }">{{ row?.dspId }}</span>
        </div>

        <!--More Info Button-->
        <q-btn id="moreData" icon="fa-solid fa-magnifying-glass" rounded dense
               size="6px" no-caps unelevated class="tw-flex-shrink-0 tw-w-[10px]">
          <q-menu anchor="bottom right" self="top right" :offset="[0, 18]"
            class="tw-rounded-2xl tw-shadow-none tw-top-3 tw-border-2
            tw-border-gray-100 tw-pb-3">
            <div class="tw-mb-3 q-pa-sm bg-primary text-white">{{ this.$trd(row?.apptdate, {type: 'time'}) }} - {{ row?.brnId }} - {{ row?.city }}, {{ row.state }}</div>
            <div class="q-mx-sm">
            <template v-for="(info, index) of popupInfo" :key="index" >
              <div v-if="info.value" class="tw-flex tw-items-center">
                <span class="tw-font-bold tw-w-[30%]">{{ info.title }}: </span>
                <span class="q-ml-sm text-blue-grey tw-w-[70%]" v-html="info.value" />
              </div>

              <q-separator v-if="index < popupInfo.length - 1" class="tw-my-0.5"  />
            </template>
            </div>
          </q-menu>
        </q-btn>
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
  emits: ['changeLock'],
  setup(props, {emit}) {
    return controller(props, emit)
  }
})
</script>
<style lang="scss">
</style>
