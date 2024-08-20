<template>
  <div class="columnCtn tw-relative bg-white no-shadow">
    <div
      class="tw-h-auto"
      :class="`cardItemsCtn-${this.uId}${columnData.id}`"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div
        v-if="columnData.loading"
        class="
          tw-flex
          tw-justify-center
          tw-absolute
          tw-inset-0
          tw-pt-48
          tw-bg-white
          tw-bg-opacity-75
          tw-z-20
        "
      >
        <q-spinner color="primary" size="2em" />
      </div>
      <button
        class="
          tw-absolute
          tw-right-0
          tw-z-20
          tw-mt-2
          tw--mr-2
          tw-bg-white
          tw-rounded-full
          tw-px-1
          tw-text-center
          tw-shadow-lg
          tw-shadow-gray-500/40
          tw-cursor-pointer
          tw-transition
          tw-duration-150
          tw-ease-out
          hover:tw-ease-in
          hover:tw--translate-y-1 icon-plus
        "
        v-if="allowCreateStatuses"
        @click="addColumnKanban"
      >
        <i
          class="
            fas
            fa-plus
            tw-text-gray-400
            tw-drop-shadow-lg"
        />
      </button>
      <div
        class="
          tw-flex
          tw-w-full
          tw-py-2
          tw-px-3
          tw-rounded-lg
          arrowKanbanName
        "
        @mouseover="arrowKanbanNameHover = true"
        @mouseleave="arrowKanbanNameHover = false"
        :style="{ background: columnData.color }"
      >
        <div class="arrowKanban" :style="{ background: columnData.color }"></div>
        <div
          class="tw-flex tw-w-full kanbanName"
        >
          <div class="tw-w-10/12">
            <p
              v-if="!columnData.new"
              class="
                tw-mx-1
                tw-text-xs
                tw-whitespace-nowrap
                tw-font-bold
                tw-my-1
                tw-truncate
              "
              :class="{ 'tw-text-white': columnData.color }"
            >
              {{ columnData.title }}
            </p>
            <dynamic-field
              v-else
              :field="inputDynamicField"
              v-model="columnData.title"
              class="tw-pr-3"
              @enter="addColumnName"
            />
          </div>
          <div
            v-if="allowEditStatuses"
            class="
              tw-w-1/12
              tw-text-xs
              tw-cursor-pointer
              icon-edit "
            :class="{ 'tw-text-white': columnData.color }"
          >
            <q-btn
              flat
              round
              padding="5px"
              icon="fas fa-pencil-alt"
              size="6px"
              @click="columnData.new = true"
            >
              <q-tooltip> Editar Columna </q-tooltip>
            </q-btn>
          </div>
          <div
            v-if="!disableCrud && arrowKanbanNameHover && !columnData.new"
            class="tw-w-1/12
              tw-text-xs
              tw-cursor-pointer icon-edit"
            :class="{ 'tw-text-white': columnData.color }"
          >
            <q-btn
              flat
              round
              padding="5px"
              icon="fa-duotone fa-rotate-right"
              size="6px"
              @click="addCard(columnData.id)"
            >
              <q-tooltip>
                  {{ $trp('isite.cms.label.refresh') }}
              </q-tooltip>
            </q-btn>
          </div>
          <div
            v-if="columnData.new"
            class="tw-flex"
            :class="{ 'tw-text-white': columnData.color }"
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
                        v-model="columnData.color"
                        no-header-tabs
                        class="my-picker"
                      />
                    </q-popup-proxy>
                  </q-icon>
                  <q-tooltip> Asignar Color </q-tooltip>
                </template>
              </q-btn>
            </div>
            <div v-if="columnData.data.length > 0">
              <q-btn
                flat
                round
                padding="5px"
                icon="fa-light fa-check"
                size="6px"
                @click="addColumnName"
              />
            </div>
            <div>
              <q-btn
                v-if="columnData.data.length === 0"
                flat
                round
                icon="fas fa-times"
                size="6px"
                @click="columnDeleteMessages"
              >
                <q-tooltip> Eliminar columnas </q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
      </div>
      <div class="c-plus" v-if="permissionRequestable.create">
        <q-btn 
          flat 
          class="
            tw-w-full
            hover:tw-text-white
            hover:tw-bg-gray-200"
          @click="openFormComponentModal(columnData.id, columnData.title)"
          :disabled="allowCreateRequestable"
          >
          <i class="fa-solid fa-plus"></i>
        </q-btn>
      </div>
      <div class="c-body
                  tw-shadow
                  tw-overflow-y-auto
                  tw-overflow-x-hidden
                  tw-mb-4 tw-px-2"
                >
        <draggable
          :id="columnData.id"
          :list="columnData.data"
          :animation="200"
          group="data"
          ghost-class="ghostCard"
          drag-class="dragCard"
          filter=".ignoreItem"
          :style="{ height: computedHeight }"
          :force-fallback="true"
          @start="dragColumn = true"
          @end="move"
          @change="countTotalRecords"
          item-key="id"
          :disabled="!permissionStatuses.edit"
        >
          <template #item="{ element }">
            <kanbanCard
              :cardData="element"
              :colorColumn="element.color"
              class="tw-cursor-pointer"
              :id="element.id"
            />
          </template>
          <template #footer>
            <div>
              <div class="tw-text-center tw-h-5 tw-rounded">
                <q-banner
                  inline-actions
                  rounded
                  class="primary"
                  v-if="
                columnData.total !== 0 &&
                isTotalNumberOfRecords &&
                !loading &&
                !columnData.loading
              "
                >
                  <div>
                    <i class="far fa-grin-beam-sweat tw-text-base" />
                  </div>
                  <div class="tw-font-semibold">Ya te dimos todo</div>
                </q-banner>
              </div>
              <div
                :class="`trigger-${this.uId}${columnData.id}`"
                class="tw-text-center tw-h-5 tw-flex tw-justify-center"
              >
                <q-spinner v-if="loading" color="primary" size="1.3em" />
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import kanbanCard from "modules/qsite/_components/master/kanban/kanbanCard.vue";
import kanbanStore from "modules/qsite/_components/master/kanban/store/kanbanStore.js";
const modelColumn = {
    id: null,
    title: null,
    color: null,
    data: [],
    loading: false,
    page: 1,
    total: 0,
    new: true,
}

export default {
  props: {
    columnData: {
      type: Object,
      required: true,
    },
    columnIndex: {
      type: Number,
      required: true,
    },
    totalColumns: {
      type: Number,
      default: () => 0,
    },
  },
  inject: [
    'saveStatusOrdering',
    'saveColumn',
    'addKanbanCard',
    'deleteColumn',
    'updateColumn',
    'setPayloadStatus',
    'addColumn',
    'heightColumn',
    'uId',
    'disableCrud',
    'automation',
    'routes',
    'openFormComponentModal',
    'countTotalRecords',
    'addCard',
    'updateCardColumn',
  ],
  mounted() {
    const parent = document.querySelector(`#kanbanCtn${this.uId}`);
    this.initialheight = `${window.innerHeight - parent.offsetTop - this.heightColumn}px`;
    window.addEventListener("resize", () => {
      setTimeout(() => {
        this.computedHeight = `${
          window.innerHeight - parent.offsetTop - 100
        }px`;
      }, 100);
    });
    // infinite scroll
    const observerOptions = {
      root: document.querySelector(`.cardItemsCtn-${this.uId}${this.columnData.id}`),
    };
    const target = document.querySelector(`.trigger-${this.uId}${this.columnData.id}`);
    const observer = new IntersectionObserver(
      this.observerCallback,
      observerOptions
    );
    observer.observe(target);
  },
  data() {
    return {
      initialheight: null,
      loading: false,
      hover: false,
      arrowKanbanNameHover: false,
      dragColumn: false,
    };
  },
  components: {
    draggable,
    kanbanCard,
  },
  computed: {
    allowCreateRequestable() {
      return typeof this.columnData.id == 'string' || !this.permissionRequestable.create;
    },
    permissionRequestable() {
      return {
        index: this.$hasAccess('requestable.requestables.index'),
        create: this.$hasAccess('requestable.requestables.create'),
        edit: this.$hasAccess('requestable.requestables.edit'),
        delete: this.$hasAccess('requestable.requestables.delete')
      }
    },
    permissionStatuses() {
      return {
        index: this.$hasAccess('requestable.statuses.index'),
        create: this.$hasAccess('requestable.statuses.create'),
        edit: this.$hasAccess('requestable.statuses.edit'),
        delete: this.$hasAccess('requestable.statuses.delete'),
        moveRequestables: this.$hasAccess('requestable.requestables.move')
      }
    },
    allowCreateStatuses() {
      if(this.permissionStatuses.create) {
        return !this.disableCrud && this.hover && this.columnData.type !== 2;
      }
      return false;
    },
    allowEditStatuses() {
      if(this.permissionStatuses.edit) {
        return !this.disableCrud && this.arrowKanbanNameHover && !this.columnData.new
      }
      return false;
    },
    inputDynamicField() {
      return {
        value: null,
        type: 'input',
        isFakeField: true,
        props: {},
      }
    },
    computedHeight: {
      get() {
        return this.initialheight;
      },
      set(value) {
        this.initialheight = value;
      },
    },
    isTotalNumberOfRecords() {
      return this.columnData.total === this.columnData.data.length;
    },
  },
  methods: {
    addColumnKanban() {
      this.addColumn(this.columnIndex, this.columnData);
    },
    async columnDeleteMessages() {
      this.$q.dialog({
          ok: this.$tr('isite.cms.label.delete'),
          message: this.$tr('isite.cms.message.deleteRecord'),
          cancel: true,
          persistent: true
        }).onOk(async() => {
          await this.deleteColumn(this.columnData.id);
          this.$alert.info({ message: this.$tr('isite.cms.message.recordDeleted') });
          await this.saveStatusOrdering();
        }).onCancel(() => {})
    },
    observerCallback(entries) {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.infiniteHandler();
        }
      });
    },
    async infiniteHandler() {
      try {
          if (!this.columnData.loading) {
            this.loading = true;
            this.columnData.page = this.columnData.page + 1;
            await this.addKanbanCard(
              this.columnData,
              this.columnData.page
            );
            this.loading = false;
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    async addColumnName() {
      if (this.columnData.title) {
        this.columnData.new = false;
        if(isNaN(this.columnData.id)) {
          const response = await this.saveColumn(this.columnData)
          this.columnData.id = response.data.id;
        } else {
          await this.updateColumn(this.columnData);
        }
        await this.saveStatusOrdering();
        this.setPayloadStatus();
      }
    },
    updateCard(data, route) {
      this.$crud.update(route.apiRoute, data.id, data).then(response => {
      }).catch(error => {
        console.log(error);
      })
    },
    move(elm) {
      if (elm.from.id === elm.to.id) return;
      const nameRoute = this.automation ? 'automation' : 'card';
      const route = this.routes[nameRoute];
      if(!route) return;
      const data = { id: elm.clone.id, [route.filter.name]: elm.to.id };
      this.updateCardColumn(Number(elm.to.id));
      this.updateCard(data , route);
    }
  },
};
</script>

<style>
.columnCtn {
  @apply tw-w-60;
}

.dragCard {
  @apply tw-bg-white tw-transform tw-rotate-6;
  cursor: grabbing;
}

.ghostCard {
  @apply tw-opacity-75 tw-bg-white !important;
}

.kanbanName p {
  @apply tw-lowercase;
}

.kanbanName p::first-letter {
  @apply tw-uppercase;
}

.arrowKanbanName .kanbanName .q-field__focusable-action {
  @apply tw--mt-4;
}
.arrowKanbanName .kanbanName .q-field--dense .q-field__control {
  @apply tw-h-6 tw-rounded-lg !important;
}
.arrowKanbanName .kanbanName .q-field--dense .q-field__control:before {
  @apply tw-border-0 tw-rounded-lg !important;
}
.arrowKanbanName .kanbanName .q-field--labeled .q-field__native,
.q-field--labeled .q-field__prefix,
.q-field--labeled .q-field__suffix {
  @apply tw-p-0;
}
.columnCtn .arrowKanbanName {
  width: calc(100% - 13px);
}
.columnCtn .arrowKanbanName .arrowKanban {
  height: 33px;
  width: 33px;
  border-radius: 10px;
  position: absolute;
  top: 4px;
  right: 3px;
  transform: rotate(45deg);
}
.columnCtn .c-plus {
    border-left: 1px dashed #bdb9b9;
    padding: 10px;
}
.columnCtn .c-body {
    background: #f3f4f6;
    border-radius: 10px;
}
.columnCtn .icon-edit {
  animation-name: slideUpReturn;
  animation-duration: .5s;
  animation-fill-mode: both;
  margin-top: 2px;
}
.columnCtn .icon-plus {
  animation-name: spaceInUp;
  animation-duration: .2s;
  animation-fill-mode: both;
}
@keyframes spaceInUp {
  0% {
    opacity: 0;
    -webkit-transform-origin: 50% 0%;
    transform-origin: 50% 0%;
    -webkit-transform: scale(0.2) translate(0%, -200%);
    transform: scale(0.2) translate(0%, -200%);
  }
  100% {
    opacity: 1;
    -webkit-transform-origin: 50% 0%;
    transform-origin: 50% 0%;
    -webkit-transform: scale(1) translate(0%, 0%);
    transform: scale(1) translate(0%, 0%);
  }
}
@keyframes slideUpReturn {
  0% {
    transform-origin: 0 0;
    transform: translateX(100%);
  }
  100% {
    transform-origin: 0 0;
    transform: translateX(0%);
  }
}
</style>
