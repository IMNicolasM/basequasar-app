<template>
  <div id="parent" v-if="comapnyId">
    <h3 v-if="title" class="tw-text-xl text-primary tw-font-semibold">{{ title }}</h3>
    <br />
    <div class="flex no-wrap tw-gap-4 tw-overflow-x-auto tw-py-3 tw-px-1.5">
      <template v-for="card of cardsData">
          <div>
            <div v-if="!loading" class="custom-card flex tw-max-w-72 tw-min-w-60 tw-rounded-2xl">
              <div class="full-width flex tw-items-center tw-justify-between">
                <div v-if="card.title" :class="`tw-text-2xl tw-font-bold ${card.color} ${card.title.class || ''}`">{{card.title.label}}</div>

                <div v-if="card.icon" class="flex tw-bg-green-100 tw-p-3 tw-items-center tw-rounded-2xl tw-place-content-center tw-size-11" :style="card.icon.bgStyle || ''">
                  <q-icon :name="card.icon.name" :class="card.color" v-bind="card.icon.props || {}" />
                </div>
              </div>
              <div v-if="card.description" :class="`ellipsis-2-lines tw-leading-5 tw-text-gray-500 ${card.description.class || ''}`" v-html="card.description.label" />
            </div>

            <!--Inner Loading-->
            <q-skeleton
              v-if="loading"
              type="rect"
              height="161px"
              width="262px"
              class="tw-mt-4"
            />
          </div>
      </template>
    </div>

  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import controller from './controller';

export default defineComponent({
  props: {
    title: { default: '' },
    cardType: { default: 'cards' },
    apiRoutes: { type: Array, default: () => [] }
  },
  components: {},
  setup(props, { emit }) {
    return controller(props, emit);
  }
});
</script>
<style lang="scss">
#parent {
  .custom-card {
    min-height: 164px;
    padding: 14px 24px;
    gap: 14px;
    background: #FFFFFF;
    /* Card */
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.07),
    0px 2px 6px rgba(0, 0, 0, 0.0425185),
    0px 0.5px 1.5px rgba(0, 0, 0, 0.0274815);
  }
}
</style>
