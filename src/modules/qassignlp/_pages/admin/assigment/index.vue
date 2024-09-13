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
      <div class="tw-w-full md:tw-w-[60%]">
        <div class="text-primary text-weight-bold ellipsis title-content items-center tw-text-lg text-center tw-py-2">
          <label id="titleCrudTable">Sales Rep Availability</label>
        </div>
        <div class="tw-sticky top-info tw-flex tw-items-center tw-p-1.5 tw-shadow-xs tw-z-10 tw-mt-3 tw-mb-2 bg-white">
          <div class="tw-text-sm tw-font-semibold">
            # of Appointments:
            <span class="text-primary">{{ totalAssigns }}</span>
          </div>
          <div class="tw-text-sm tw-ml-8 tw-font-semibold">
            Miles Driven:
            <span class="text-primary">{{ this.$trn(totalMiles) }}</span>
          </div>
        </div>
        <div class="scroll-x tw-overflow-x-auto">
          <template v-for="(assigns, key) of assignedData" :key="key">
            <dynamic-table-clone
              class="q-py-sm tw-min-w-full"
              :tableProps="{dense: true, separator: 'cell', virtualScroll: false}"
              :columns="columns"
              :rows="assigns"
              :loading="loading"
            />
          </template>
        </div>
      </div>
      <div class="tw-w-full md:tw-w-[40%] scroll-x">
        <div class="text-primary text-weight-bold ellipsis title-content items-center tw-text-lg text-center tw-py-2">
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
    .q-table__middle {
      width: 100%;
      overflow: visible;
    }

    .q-table th {
      background-color: $primary;
      color: white;
      padding-bottom: 6px;
    }

    .q-tr .q-td {
      padding: 2px;
      border: 1px solid #d4d4d4;
      white-space: nowrap;
    }

    .q-tr .q-td > * {
      padding: 0;
      height: 100%;
      width: 100%;

      margin: 0 auto;
      max-width: 160px;

      @media screen and (max-width: $breakpoint-md) {
        max-width: 130px;
      }
    }

    .q-table td:first-child, .q-table td:first-child div {
      width: 100px;
    }

  }
}
</style>
