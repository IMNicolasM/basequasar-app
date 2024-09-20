<template>
  <master-modal
    id="modalSetupForm" v-model="show" v-bind="modalProps">
    <div id="cardContent" class="row col-12">
      <dynamic-form class="col-12 full-width" ref="refForm" v-model="formTemplate" formType="grid"
                    :blocks="fields" no-actions no-reset-with-blocks-update @submit="emitData"/>
    </div>
  </master-modal>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import controller from './controller';

export default defineComponent({
  props: {
    modelValue: {default: false},
    saveInDb: {default: false},
    emits: ['update:modelValue', 'runAnr']
  },
  setup (props, { emit })
  {
    return controller(props, emit);
  },
  components: {}
});
</script>
<style lang="scss">
#dynamicFormComponentContent {
  #gridContent div div {
    box-shadow: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }
}
</style>
