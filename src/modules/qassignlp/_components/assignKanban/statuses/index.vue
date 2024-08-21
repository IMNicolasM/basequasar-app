<template>
  <div
    class="statuses-ctn tw-mr-8"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div
      class="tw-relative tw-flex  tw-w-14 tw-py-2 tw-px-3 tw-rounded-lg arrowKanbanName"
      :style="{ background: status.color }"
    >
      <button
        v-if="hover && isAdd"
        class="tw-absolute tw-right-0 tw-z-20 tw--mr-4 tw-mt-0.5 tw-bg-white tw-rounded-full tw-px-1 tw-text-center tw-shadow-lg tw-shadow-gray-500/40 tw-cursor-pointer tw-transition tw-duration-150 tw-ease-out hover:tw-ease-in hover:tw--translate-y-1 icon-plus"
        @click="add"
      >
        <i class="fas fa-plus tw-text-gray-400 tw-drop-shadow-lg" />
      </button>
      <div class="tw-flex kanbanName tw-w-full">
        <div class="tw-w-10/12" >
          <p
            v-if="!isEdit"
            class="tw-mx-1 tw-text-xs tw-whitespace-nowrap tw-font-bold tw-my-1 tw-truncate tw-text-white"
          >
            {{ status.title }}
          </p>
          <dynamic-field
            v-else
            :field="inputDynamicField"
            v-model="status.title"
            class="tw-pr-3"
        />
        </div>
        <div
            v-if="!isEdit && hover"
            class="
              tw-w-1/12
              tw-text-xs
              tw-cursor-pointer
              icon-edit"
            :class="{ 'tw-text-white': status.color }"
          >
            <q-btn
              flat
              round
              padding="5px"
              icon="fas fa-pencil-alt"
              size="6px"
              @click="isEdit = true"
            >
              <q-tooltip> Editar estado </q-tooltip>
            </q-btn>
          </div>
          <div
            v-if="isEdit"
            class="tw-flex"
            :class="{ 'tw-text-white': status.color }"
          >
            <div>
              <q-btn flat round size="6px">
                <template v-slot:default>
                  <q-icon name="fas fa-fill" class="cursor-pointer">
                    <q-popup-proxy
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-color
                        v-model="status.color"
                        no-header-tabs
                        class="my-picker"
                      />
                    </q-popup-proxy>
                  </q-icon>
                  <q-tooltip> Asignar Color </q-tooltip>
                </template>
              </q-btn>
            </div>
            <div>
              <q-btn
                flat
                round
                padding="5px"
                icon="fa-light fa-check"
                size="6px"
                @click="update"
                v-if="status.title"
              >
                <q-tooltip> Actualizar </q-tooltip>
              </q-btn>
            </div>
            <div>
              <q-btn
                flat
                round
                icon="fas fa-times"
                size="6px"
                @click="deleteStatus"
              >
                <q-tooltip> Eliminar </q-tooltip>
              </q-btn>
            </div>
          </div>
      </div>
      <div class="arrowKanban" :style="{ background: status.color }"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useQuasar } from 'quasar';
import { i18n } from 'src/plugins/utils'

export default defineComponent({
  props: {
    status: {
        type: Object,
        default: () => [],
    },
    total: {
        type: Number,
        default: 0
    },
    width: {
        type: Number,
        default: 128
    },
    isAdd: {
        type: Boolean,
        default: true
    }
  },
  setup(props, {emit}) {
    const $q = useQuasar()
    const hover = ref(false);
    const isEdit = ref(props.status.edit);
    const status = computed(() => props.status);
    const width = computed(() => props.width);
    const total = computed(() => props.total);
    const isAdd = computed(() => props.isAdd);
    const inputDynamicField = computed(() => {
      return {
        value: null,
        type: 'input',
        isFakeField: true,
        props: {},
      }
    });
    function add() {
        emit('add');
    }
    function deleteStatus() {
        $q.dialog({
          ok: i18n.tr('isite.cms.label.delete'),
          message: i18n.tr('isite.cms.message.deleteRecord'),
          cancel: true,
          persistent: true
        }).onOk(async() => {
          try {
            emit('delete')
          } catch (error) {
            console.log(error);
            isEdit.value = false;
          }
        }).onCancel(() => {})
    }
    function update() {
        isEdit.value = false;
        if(isNaN(status.value.id)) {
          emit('saveColumn', status.value);
        } else {
          emit('updateColumn', status.value);
        }
    }
    function save() {
      emit('saveColumn');
    }
    return {
        status,
        inputDynamicField,
        isEdit,
        width,
        total,
        hover,
        isAdd,
        add,
        deleteStatus,
        update,
        save
    };
  },
});
</script>

<style>
.statuses-ctn .arrowKanbanName {
  width: calc(256px - 12px);
  z-index: 1;
}
.statuses-ctn .arrowKanbanName .arrowKanban {
  height: 33px;
  width: 33px;
  border-radius: 10px;
  position: absolute;
  top: 4px;
  right: -12px;
  transform: rotate(45deg);
  z-index: -1;
}
.statuses-ctn .icon-plus {
  animation-name: spaceInUp;
  animation-duration: .2s;
  animation-fill-mode: both;
}
.statuses-ctn .icon-plus:hover {
  display: block !important;
}
.statuses-ctn .icon-edit {
  animation-name: slideUpReturn;
  animation-duration: .5s;
  animation-fill-mode: both;
  margin-top: 2px;
}
</style>
