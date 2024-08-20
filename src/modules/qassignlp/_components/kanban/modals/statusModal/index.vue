<template>
  <master-modal
    v-model="showModal"
    :persistent="true"
    customPosition
    maximized
    :hide="hideModal"
    modalWidthSize="98%"
    title="Administrador de estados"
    :loading="loading"
  >
    <div class="statusCtn">
      <div class="tw-border tw-border-gray-200 tw-rounded-t-md">
        <p class="tw-py-4 tw-px-4">En Progreso</p>
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
            id="inProgress"
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
                @saveColumn="saveColumn"
                @updateColumn="updateColumn"
              />
            </template>
          </draggable>
        </div>
      </div>
      <div class="tw-border tw-border-gray-200">
        <p class="tw-py-4 tw-px-4">Se produjo un fallo</p>
        <div>
          <q-btn
            v-if="statusList.failed.length === 0"
            round
            color="primary"
            icon="fas fa-plus"
            size="xs"
            class="tw-m-2"
            @click="addStatus(-1, 'failed')"
          />
          <draggable
            id="failed"
            v-model="statusList.failed"
            :animation="200"
            group="data"
            filter=".ignoreItem"
            :force-fallback="true"
            class="tw-flex tw-overflow-x-auto tw-overflow-y-hidden tw-mx-2"
            @end="saveStatusOrdering('failed')"
            item-key="id"
          >
            <template #item="{ element, index }">
              <statuses
                :status="element"
                class="tw-mb-3"
                :total="statusList.failed.length"
                @add="addStatus(index, 'failed')"
                @delete="deleteStatus(element.id, 'failed')"
                @saveColumn="saveColumn"
                @updateColumn="updateColumn"
              />
            </template>
          </draggable>
        </div>
      </div>
      <div class="tw-border tw-border-gray-200 tw-rounded-b-md">
        <p class="tw-py-4 tw-px-4">Exito</p>
        <q-btn
          v-if="statusList.success.length === 0"
          round
          color="primary"
          icon="fas fa-plus"
          size="xs"
          class="tw-m-2"
          @click="addStatus(-1, 'success')"
        />
        <div class="tw-flex tw-space-x-5 tw-m-2">
          <div v-for="(status, index) in statusList.success" :key="status.id">
            <statuses
              :status="status"
              class="tw-w-56"
              :total="statusList.success.length"
              :isAdd="false"
              @add="addStatus(index, 'success')"
              @delete="deleteStatus(status.id, 'success')"
              @saveColumn="saveColumn"
              @updateColumn="updateColumn"
            />
          </div>
        </div>
      </div>
    </div>
  </master-modal>
</template>

<script lang="ts">
import Vue, {
  defineComponent,
} from "vue";

import statuses from "../../statuses/index.vue";
import draggable from "vuedraggable";
import useStatusModal from './uses/useStatusModal'

export default defineComponent({
  components: {
    statuses,
    draggable,
  },
  setup() {
    return {
      ...useStatusModal()
    };
  },
});
</script>

<style>
</style>
