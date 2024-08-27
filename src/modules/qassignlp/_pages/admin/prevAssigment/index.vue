<template>
  <div>
    <page-actions
      :excludeActions="excludeActions"
      :extra-actions="pageActions"
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

    <div class="tw-sticky tw-top-0 tw-flex tw-items-center tw-p-2 tw-bg-gray-50 tw-shadow-md tw-z-10">
      <div class="tw-text-sm tw-font-semibold">
        # of Appointments:
        <span class="text-primary">{{ totalAssigns }}</span>
      </div>
      <div class="tw-text-sm tw-ml-8 tw-font-semibold">
        Miles Driven:
        <span class="text-primary">{{ totalMiles }}</span>
      </div>
    </div>

    <section class="tw-w-full tw-flex tw-flex-wrap md:tw-flex-nowrap tw-gutter-sm md:tw-gutter-md tw-gap-4">
<!--      <div class="tw-w-full md:tw-w-[40%] md:tw-order-2">-->
<!--        Hola-->
<!--      </div>-->
      <dynamic-table-clone
        :columns="columns"
        :rows="assignedData"
        :loading="loading"
        class="tw-w-full md:tw-w-[100%] md:tw-order-1"
      />
    </section>

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
