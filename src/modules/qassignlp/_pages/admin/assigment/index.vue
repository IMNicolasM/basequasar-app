<template>
  <div id="assigns">
    <setup-form v-model="openForm" />

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

    <section class="relative-position tw-w-full tw-flex tw-flex-wrap md:tw-flex-nowrap tw-gutter-sm md:tw-gutter-md tw-gap-4">
      <div class="tw-w-full md:tw-w-[50%]">
        <div class="text-primary text-weight-bold ellipsis title-content items-center tw-text-lg text-center">
          <label id="titleCrudTable">Sales Rep Availability</label>
        </div>
        <div class="tw-sticky top-info tw-flex tw-items-center tw-p-1.5 tw-shadow-xs tw-z-10 tw-my-3 bg-white">
          <div class="tw-text-sm tw-font-semibold">
            # of Appointments:
            <span class="text-primary">{{ totalAssigns }}</span>
          </div>
          <div class="tw-text-sm tw-ml-8 tw-font-semibold">
            Miles Driven:
            <span class="text-primary">{{ this.$trn(totalMiles) }}</span>
          </div>
        </div>
        <dynamic-table-clone
          :tableProps="{dense: true, separator: 'cell'}"
          :columns="columns"
          :rows="assignedData"
          :loading="loading"
        />
      </div>
      <div class="tw-w-full md:tw-w-[50%] scroll-x tw-bg-gray-100 tw-rounded">
        <div class="text-primary text-weight-bold ellipsis title-content items-center tw-text-lg text-center tw-pb-2">
          <label id="titleCrudTable">Appointments</label>
        </div>
        <div class="row q-col-gutter-x-sm tw-px-2" style="display: flex; flex-wrap: wrap;">
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

        <kanban :kanban-props="{itemKey: 'id', animation: '200'}" :columns="columnsSlot" :rows="unAssignedData" @change="moveDrag" />
      </div>
      <!--Inner loading-->
      <inner-loading :visible="loading"/>
    </section>

  </div>
</template>
<script>
import {defineComponent} from 'vue';
import controller from './controller';
import dynamicFilter from 'modules/qsite/_components/master/dynamicFilter';
import dynamicTableClone from 'modules/qassignlp/_components/dynamicTableClone/index.vue';
import kanban from 'modules/qassignlp/_components/kanbanUnAssigns/index.vue'
import setupForm from 'modules/qassignlp/_components/setupForm/index.vue'

export default defineComponent({
  props: {},
  components: {
    kanban,
    dynamicFilter,
    setupForm,
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

  #dynamic-table {

    .q-table th,
    .q-table td {
      border-width: 1px;
      border-color: $blue-grey-13;
    }

    .q-tr .q-td {
      padding: 2px;
      white-space: nowrap;
    }

    .q-tr .q-td > * {
      margin: 0;
      padding: 0;
    }

  }
}
</style>
