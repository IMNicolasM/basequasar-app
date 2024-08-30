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

    <section class="tw-w-full tw-flex tw-flex-wrap md:tw-flex-nowrap tw-gutter-sm md:tw-gutter-md tw-gap-4">
      <div class="tw-w-full md:tw-w-[50%]">
        <div class="tw-sticky top-info tw-flex tw-items-center tw-p-2 tw-shadow-xs tw-z-10 tw-my-3 bg-white">
          <div class="tw-text-sm tw-font-semibold">
            # of Appointments:
            <span class="text-primary">{{ totalAssigns }}</span>
          </div>
          <div class="tw-text-sm tw-ml-8 tw-font-semibold">
            Miles Driven:
            <span class="text-primary">{{ totalMiles }}</span>
          </div>
        </div>
        <dynamic-table-clone
          :columns="columns"
          :rows="assignedData"
          :loading="loading"
        />
      </div>
      <div class="tw-w-full md:tw-w-[50%] scroll-x">
        <div class="row q-col-gutter-x-sm" style="display: flex; flex-wrap: wrap;">
          <template v-for="(field, key) in fieldsUnAssign" :key="key">
            <div class="col-12 col-md-4">
              <dynamic-field
                v-model="filtersUnassign[field.name || key]"
                :field="field"
                @update:modelValue="filterUnAssign"
              />
            </div>
          </template>
        </div>

        <kanban :kanban-props="{itemKey: 'id', animation: '200'}" :columns="columnsSlot" :rows="unAssignedData" @endDrag="endMove" />
      </div>
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
