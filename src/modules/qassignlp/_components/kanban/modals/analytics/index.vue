<template>
    <master-modal
      id="modalCrud"
      title="Analytics"
      v-model="showModal"
      :persistent="true"
      :maximized="$q.screen.lt.md"
      custom-position
      modalWidthSize="98%"
      :loading="loading"
      :hide="hidden"
    >
        <dynamic-field
          :field="field.date"
          v-model="filterDate"
        />
        <QCharts v-if="chartsData" :chartsData="chartsData" />
    </master-modal>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from "vue";
import store from './store/index'
import QCharts from 'modules/qsite/_components/master/charts.vue';
import useModalAnalytics from './uses/useModalAnalytics'

export default defineComponent({
  components: {
    QCharts,
  },
  setup(props) {
    return {...useModalAnalytics()};
  },
});
</script>

<style scoped>
</style>
