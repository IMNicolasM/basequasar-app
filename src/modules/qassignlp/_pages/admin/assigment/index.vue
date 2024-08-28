<template>
  <div id="assigns">
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

    <div class="tw-sticky top-info tw-flex tw-items-center tw-p-2 tw-shadow-xs tw-z-10 tw-mb-2 bg-white">
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
      <div class="tw-w-full md:tw-w-[50%] md:tw-order-2">
        <kanban :kanban-props="{itemKey: 'id', animation: '200'}" :columns="columnsSlot" :rows="unAssignedData" @endDrag="endMove" />
      </div>
      <dynamic-table-clone
        :columns="columns"
        :rows="assignedData"
        :loading="loading"
        class="tw-w-full md:tw-w-[50%] md:tw-order-1"
      />
    </section>

  </div>
</template>
<script>
import {defineComponent} from 'vue';
import controller from './controller';
import dynamicFilter from 'modules/qsite/_components/master/dynamicFilter';
import dynamicTableClone from 'modules/qassignlp/_components/dynamicTableClone/index.vue';
import kanban from 'modules/qassignlp/_components/kanbanUnAssigns/index.vue'

export default defineComponent({
  props: {},
  components: {
    kanban,
    dynamicFilter,
    dynamicTableClone
  },
  setup() {
    return {...controller()};
  }
});
</script>
<style lang="scss">
#assigns {
  .top-info {
    top: 100px;

    @media screen and (max-width: $breakpoint-md) {
      top: 0px;
    }
  }
}
</style>
