<template>
  <div class="tw-border tw-border-gray-200 tw-rounded-t-md">
    <p class="tw-py-4 tw-px-4">InProgress</p>
    <div>
      <q-btn
        v-if="statusList.inProgress.length === 0"
        round
        color="primary"
        icon="fas fa-plus"
        size="xs"
        class="tw-m-2"
        @click="addStatus(-1, 'inProgress')"
      />
      <draggable
        v-model="statusList.inProgress"
        :animation="200"
        group="data"
        filter=".ignoreItem"
        :force-fallback="true"
        class="tw-flex tw-overflow-x-auto tw-overflow-y-hidden tw-mx-2"
        @end="saveStatusOrdering('inProgress')"
        item-key="id"
      >
        <template #item="{ element, index }">
          <statuses
            :status="element"
            class="tw-mb-3"
            :total="statusList.inProgress.length"
            @add="addStatus(index, 'inProgress')"
            @delete="deleteStatus(element.id, 'inProgress')"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import draggable from "vuedraggable";
import statuses from '../../statuses/index.vue'

export default defineComponent({
  components: {
    statuses,
    draggable
  },
  props: {
    title: {
        type: String,
        default: () => '',
    },
    data: {
        type: Array,
        default: [],
    }
  },
  setup(props) {
    const data = computed(() => props.data)
    return {data};
  },
});
</script>

<style scoped>
</style>
