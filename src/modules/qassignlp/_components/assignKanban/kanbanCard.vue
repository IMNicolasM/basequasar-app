<template>
  <div
    class="
      tw-bg-white
      tw-shadow
      tw-rounded
      tw-px-3
      tw-pt-3
      tw-pb-2
      tw-border-l-2
      tw-my-2
      kb-card
    "
    :style="{ borderLeftColor: colorColumn }"
  >
    <section class="tw-flex tw-justify-between">
      <div class="tw-w-full">
        <div class="tw-flex">
          <span
            class="
              tw-text-gray-700
              tw-font-semibold
              tw-font-sans
              tw-tracking-wide
              tw-text-sm
              tw-w-full
            "
          >
            {{ cardData.title }}
          </span>
          <q-btn-dropdown
            round
            color="gray-4"
            flat
            size="10px"
            padding="5px 5px"
            class="
              kd-without-arrow
              tw-float-right
              tw-cursor-pointer
              tw-text-xs
              tw-bg-gray-100
              tw-h-7
            "
            icon="fa-solid fa-ellipsis"
          >
            <q-list
              dense
              class="
                kd-list-without-arrow
                tw-bg-gray-100
                tw-text-xs"
            >
              <template
                v-for="(action, keyAction) in actionsAutomations"
                :key="keyAction"
              >
              <q-item
                clickable
                v-close-popup
                v-if="action?.vIf != undefined ? action?.vIf : true"
                v-bind="action.props"
                @click.native="runAction(action)"
              >
                  <q-item-section>
                    <div class="tw-flex tw-space-x-2 tw-py-2">
                      <q-icon :name="action.icon" color="primary" size="20px"/>
                      <div class="tw-mt-0.5 tw-font-semibold">
                        {{ action.label || action.tooltip }}
                      </div>
                    </div>
                  </q-item-section>
              </q-item>
              </template>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
    </section>
    <div
      v-if="cardData.type"
      class="
        tw-flex
        tw-mt-1
        tw-justify-between
        tw-items-center
      "
    >
      <span
        class="
          tw-mt-4
          tw-text-xs
          tw-text-gray-600
        "
      >
        <b>Tipo * </b> {{ cardData.type }}
      </span>
    </div>
    <div
      class="
        tw-flex
        tw-mt-1
        tw-justify-between
        tw-items-center
      "
      v-for="field in cardData.fields"
      :key="field.id"
    >
      <span
        class="
          tw-text-xs
          tw-text-gray-600
          tw-truncate
        "
        v-if="field.name && typeof field.value !== 'object'"
      >
        <b>{{ field.label || field.name }} *</b>
        <span class="tw-lowercase">{{ field.value }}</span>
      </span>
    </div>

    <div
      class="
        tw-flex
        tw-mt-4
        tw-justify-between
        tw-items-center
      ">
      <span
        class="
          tw-text-xs
          tw-text-gray-600
        ">
          <b>{{ $tr('isite.cms.label.date') }} *</b> {{ cardData.createdAt }}
      </span>
    </div>
    <figure
      class="
        tw-flex
        tw-mt-4
        tw-cursor-pointer
      "
      v-if="fullName"
    >
      <img
        class="
          tw-w-5
          tw-h-5
          tw-rounded-md
        "
        :src="urlAvatar"
      />
      <q-tooltip
        anchor="top left"
        self="bottom left"
        :offset="[10, 10]"
        :delay="100"
      >
        <p>
          {{ fullName.firstName + ' ' + fullName.lastName }}
        </p>
      </q-tooltip>
    </figure>
  </div>
</template>

<script>

export default {
  inject: {
    showRequestData: {
      type: Function,
      default: () => false,
    },
    update: {
      type: Function,
      default: () => false,
    },
    automation: {
      type: Boolean,
      default: () => false,
    },
    crudfieldActions: {
      type: Function,
      default: () => false,
    },
    deleteKanbanCard:  {
      type: Function,
      default: () => false,
    },
    openFormComponentModal:  {
      type: Function,
      default: () => false,
    },
  },
  props: {
    cardData: {
      type: Object,
      default: () => this.cardDataDefault,
    },
    colorColumn: {
      type: String,
      default: () => "#00000",
    },
  },
  data() {
    return {
      cardDataDefault: {
        id: 0,
        title: '',
        type: '',
        createdAt: '',
        fields: [],
        responsible: {
          firstName: '',
          lastName: '',
        },
      },
    };
  },
  computed: {
    quserState() {
      return this.$store.state.quserAuth
    },
    actions() {
      return this.crudfieldActions(this.cardData);
    },
    fullName() {
      const firstName = this.cardData?.responsible?.firstName || ''
      const lastName = this.cardData?.responsible?.lastName || ''
      return { firstName, lastName }
    },
    urlAvatar() {
      return  this.cardData?.responsible?.mediaFiles?.profile?.largeThumb ||
              this.quserState?.userData?.mainImage
    },
    actionsAutomations() {
      let response = [
       //Delete action
        {
          icon: 'fa-light fa-trash-can',
          color: 'red',
          label: this.$tr('isite.cms.label.delete'),
          action: (item) => {
            if(this.deleteKanbanCard) this.deleteKanbanCard(item);
          }
        },
        {
          icon: 'fa-light fa-pencil',
          color: 'red',
          label: this.$tr('isite.cms.label.edit'),
          action: (item) => {
            if(this.openFormComponentModal) this.openFormComponentModal(item.statusId, item.title, item.id);
          }
        }
      ];
      return this.automation ?  response : this.actionsData;
    },
    actionsData() {
      return this.actions.map((item) => {
        //Instance item props
        item.props = { tag: "a", key: this.$uid(), clickable: true };

        //Define external redirect
        if (item.toRoute) item.props.href = item.toRoute;

        //Instance vue route redirect
        if (item.route)
          item.props.to = {
            name: item.route,
            params: this.$clone(this.cardData || {}),
          };

        // Formatting all instances
        if (item.format)
          item = { ...item, ...(item.format(this.cardData) || {}) };

        //Return item
        return item;
      });
    },
  },
  methods: {
    openModal() {
      if (this.showRequestData) this.showRequestData(this.cardData);
    },
    openEdit() {
      if (this.update) this.update(this.cardData);
    },
    async runAction(action) {
      //Define action params
      let actionData = this.$clone(this.cardData || {});
      //Check if has action function
      if (action.action) await action.action(actionData);
    },
  },
};
</script>
<style lang="scss">
.kd-without-arrow {
  .q-btn-dropdown__arrow {
    @apply tw-hidden;
  }
}
</style>
