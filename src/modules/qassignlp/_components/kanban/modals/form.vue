<template>
  <superModal
      v-model="show"
      :persistent="true"
      customPosition
      :loading="loading"
      maximized
      @hide="hideModal"
      modalWidthSize="98%"
      :title="title"
  >
    <div>
      <div class="relative-position">
        <div class="box box-auto-height q-mb-md">
          <div class="tw-mb-4">
            <dynamic-field
                v-for="(field, keyField) in formFields"
                :key="keyField"
                v-model="dynamicFieldForm[keyField]"
                :field="field"
            />
          </div>
          <div v-if="funnelForm">
            <dynamic-form
                :requestParams="requestParams"
                v-if="formCategory.vIf"
                v-model="form"
                :form-id="formCategory.formId"
                @submit="saveForm()"
            />
          </div>
        </div>
      </div>
    </div>
  </superModal>
</template>
<script>
import superModal from 'modules/qrequestable/_components/modals/information/components/superModal.vue';

export default {
  props: {
    funnelId: {
      type: Number,
      default: () => null,
    },
    filterName: {
      type: String,
      default: () => null,
    },
  },
  inject: {
    init: {
      type: Function,
      default: () => false,
    },
    routes: {
      type: Object,
      default: () => {
      },
    },
    automation: {
      type: Boolean,
      default: () => false,
    },
    addCard: {
      type: Function,
      default: () => false,
    },
  },
  components: {
    superModal
  },
  data() {
    return {
      show: false,
      funnelForm: null,
      statusId: null,
      form: {},
      dynamicFieldForm: {},
      loading: false,
      title: null,
      requestParams: {
        filter: {
          renderLocation: 'requestable'
        }
      },
    };
  },
  computed: {
    formCategory() {
      return {
        vIf: this.funnelForm && this.funnelForm.form ? true : false,
        formId: this.funnelForm?.form?.id || null,
      };
    },
    formFields() {
      const userData = this.$store.state.quserAuth.userData;
      return {
        sourceId: {
          value: null,
          type: 'crud',
          permission: 'requestable.sources.index',
          props: {
            crudType: 'select',
            crudData: import('modules/qrequestable/_crud/sources'),
            crudProps: {
              label: this.$tr('isite.cms.label.source'),
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
            config: {
              filterByQuery: true,
              options: {
                label: 'title', value: 'id'
              }
            }
          },
        },
        requestedById: {
          value: null,
          type: "crud",
          permission: 'profile.user.index',
          props: {
            crudType: "select",
            crudData: import("modules/quser/_crud/users"),
            crudProps: {
              label: this.$tr('isite.cms.form.requestedBy'),
              rules: [
                (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
              ],
            },
            config: {
              filterByQuery: true,
              options: {
                label: "fullName",
                value: "id",
              },
            },
          },
        },
        responsibleId: {
          value: null,
          type: 'crud',
          permission: 'profile.user.index',
          props: {
            crudType: 'select',
            crudData: import('modules/quser/_crud/users'),
            crudProps: {
              vIf: this.$hasAccess('profile.user.index') && this.$hasAccess('requestable.requestables.assign-responsible'),
              label: this.$tr('requestable.cms.label.responsible'),
              rules: [
                val => !!val || this.$tr('isite.cms.message.fieldRequired')
              ],
            },
            config: {
              filterByQuery: true,
              options: {
                label: 'fullName', value: 'id',
              }
            }
          },
        }
      }
    },
  },
  methods: {
    hideModal() {
      this.show = false;
      this.resetForm();
    },
    openModal(statusId, title = null) {
      this.statusId = statusId;
      this.title = title;
      const funnel =
          this.$helper.getDynamicSelectList()[this.filterName] || null;
      if (funnel) {
        this.funnelForm = funnel.find((item) => item.id == this.funnelId);
      }
      if (!this.formCategory.vIf) {
        this.$alert.warning({message: 'No existen formulario para esta categoría'})
        return;
      }
      this.show = true;
    },
    async saveForm() {
      try {
        this.loading = true;
        const nameRoute = this.automation ? "automation" : "card";
        if (!this.routes[nameRoute]) return;
        const route = this.routes[nameRoute];
        const form = {
          ...this.form,
          type: this.funnelForm.type,
          statusId: this.statusId,
          ...this.dynamicFieldForm,
          requestedById: this.dynamicFieldForm.requestedById || this.$store.state.quserAuth.userId
        };
        await this.$crud.create(route.apiRoute, form);
        await this.addCard(this.statusId);
        this.hideModal();

        this.loading = false;
      } catch (error) {
        this.loading = false;
        console.log(error);
      }
    },
    resetForm() {
      this.form = {};
    }
  },
};
</script>
