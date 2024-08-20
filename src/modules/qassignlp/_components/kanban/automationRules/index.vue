<template>
    <master-modal
      v-model="show"
      :persistent="true"
      customPosition
      maximized
      @hide="hideModal" 
      modalWidthSize="98%"
      title="Reglas de automatización"
    >
      <kanban
        :routes="routes"
        :funnelId="funnelId"
        :heightColumn="170"
        :dragColumn="false"
        :disableCrud="true"
        :automation="true"
      />
    </master-modal>
</template>
<script>
import { TYPE_STORE_AUTOMATION_RULES } from '../constants/constants.js';
export default {
  props: {
    funnelId: {
      type: Number,
      default:() => null,
    },
  },
  inject:['init', 'routes'],
  data() {
    return {
      TYPE_STORE_AUTOMATION_RULES,
      show: false,
    }
  },
  computed: {},
  methods: {
    hideModal() {
      this.show = false;
    },
    openModal() {
      this.show = true;
    }
  }
};
</script>