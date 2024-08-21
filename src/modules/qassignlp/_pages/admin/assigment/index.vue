<template>
  <div>
    <page-actions
      :excludeActions="excludeActions"
      :title="$tr($route.meta.title)"
      :dynamicFilter="filters"
      :dynamicFilterValues="getDynamicFilterValues"
      :dynamicFilterSummary="dynamicFilterSummary"
      @refresh="getData(true)"
      @toggleDynamicFilterModal="toggleDynamicFilterModal"
    />

    <!-- dynamicFilter -->
    <dynamicFilter
      v-if="filters"
      systemName="assigments"
      :modelValue="showDynamicFilterModal"
      :filters="filters"
      @showModal="showDynamicFilterModal = true"
      @hideModal="showDynamicFilterModal = false"
      @update:modelValue="filters => updateDynamicFilterValues(filters)"
      @update:summary="summary => dynamicFilterSummary = summary"
    />


    <div class="tw-w-full tw-flex q-my-md items-center tw-gap-x-2">
      <dynamic-field
        v-model="apptdateFilter.value"
        @update:model-value="(value) => setApptDate(value)"
        :field="apptdateFilter"
        style="width: 246px;"
      />
      <div class="row no-wrap" style="margin-top: -15px">
        <q-btn
          text-color="primary"
          class="q-mr-sm"
          size="sm"
          unelevated
          round
          icon="fa-regular fa-chevron-left"
          @click="goToPrevious()"
        >
          <q-tooltip anchor="bottom middle" self="top middle">
            Previous day
          </q-tooltip>
        </q-btn>
        <q-btn
          text-color="primary"
          class="q-mr-sm"
          size="sm"
          unelevated
          round
          icon="fa-regular fa-chevron-right"
          @click="goToNext()"
        >
          <q-tooltip anchor="bottom middle" self="top middle">
            Next Day
          </q-tooltip>
        </q-btn>
      </div>
      <div class="text-primary" style="font-size: 16px; margin-top: -15px">
        <div>Day: {{ $moment(requestParams.params.apptdate).format('MMM Do') }}</div>
      </div>

    </div>

    <dynamic-table-clone :columns="columns" :rows="assignedData"/>
  </div>
</template>
<script>
import {defineComponent} from 'vue';
import controller from './controller';
import dynamicFilter from 'modules/qsite/_components/master/dynamicFilter';
import dynamicTableClone from 'modules/qassignlp/_components/dynamicTableClone/index.vue';

export default defineComponent({
  props: {},
  components: {
    dynamicFilter,
    dynamicTableClone
  },
  setup() {
    return {...controller()};
  }
});
</script>
<style lang="scss">
</style>
