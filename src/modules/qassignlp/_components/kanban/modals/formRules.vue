<template>
  <master-modal 
    v-model="show" 
    :persistent="true" 
    customPosition 
    :hide="resetForm"
    :loading="loading" 
    :title="modalTitle" 
    :actions="modalActions"
  >
    <q-form 
      autocorrect="off" 
      autocomplete="off" 
      ref="formContent" 
      @submit="submitData"
      @validation-error="$alert.error($tr('isite.cms.message.formInvalid'))"
    >
        <!--Main-->
        <div class="box box-auto-height q-mb-md">
        <!--Category Id-->
        <dynamic-field 
            v-model="form.categoryId" 
            :field="formFields.category"
        />
        <!--Title-->
        <dynamic-field 
            v-model="form.name" 
            :field="formFields.name"
        />
        <!--Recipient Type-->
        <dynamic-field 
            v-model="form.to" 
            :field="formFields.to"
            v-if="formFields.to.vIf" 
            :key="`recipient-${changeKey}`"
        />
        </div>
        <!--Run fields-->
        <dynamic-form 
            v-if="!this.loading && formFields.run" 
            v-model="form.run" 
            :blocks="formFields.run" 
            no-actions no-reset-with-blocks-update
            class="q-mb-md" :title="this.$tr('isite.cms.label.run')"
        />
        <!--Category fields-->
        <dynamic-form 
            v-model="form.categoryFields" 
            :blocks="formFields.categoryFields" 
            no-actions
            v-if="!this.loading && formFields.categoryFields" 
            :title="this.$tr('isite.cms.label.setting')"
        />
    </q-form>
  </master-modal>
</template>
<script>

export default {
    props: {
        funnelId: { type: Number, default: () => null }
    },
    inject: {
        addCard: {
            type: Function,
            default: () => false,
        },
    },
    watch: {
        "form.categoryId"() {
            this.changeKey = this.$uid();
            if (!this.loading)
                this.form.to = null;
            if (this.categorySelected)
                this.form.name = this.$clone(this.categorySelected.title);
        }
    },
    data() {
        return {
            show: false,
            modalTitle: "",
            loading: true,
            statusId: null,
            categories: [],
            automationId: null,
            form: {
                categoryId: null,
                name: null,
                to: null,
                run: {},
                categoryFields: {},
            },
            changeKey: this.$uid(),
            TELEGRAM: 14,
        };
    },
    computed: {
        isSendEmailToExternalData() {
            const SEND_EMAIL_TO_EXTERNAL_DATA_ID = 14
            const id = Number(this.categorySelected?.id)
            return SEND_EMAIL_TO_EXTERNAL_DATA_ID === id
        },
        isSelectField() {
            const MAIN_FORM_COMUNICATION_ID = 1;
            const INTERNAL_COMMUNICATION_ID = 7;
            const idCategoriesWithRecipient = [
                MAIN_FORM_COMUNICATION_ID, 
                INTERNAL_COMMUNICATION_ID
            ];
            return idCategoriesWithRecipient.includes(this.categorySelected?.parentId)
        },
        isMultiDynamicfield() {
            const EXTERNAL_DATA_COMUNICATION = 13
            const parentId = this.categorySelected?.parentId
            return parentId === EXTERNAL_DATA_COMUNICATION;
        },
        whatTypeField() {
            const phoneNumber = {
                phoneNumber: {
                    type: 'localizedPhone',
                    colClass: "col-12",
                    props: {
                        rules: [
                            (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
                        ],
                        label: 'Phone number',
                        mask:"##########"
                    },
                }
            }
            const email = {
                email : {
                    value : null,
                    type : 'input',
                    colClass: "col-12",
                    props : {
                        label: 'Email',
                        rules: [
                            (val) => !!val || this.$tr("isite.cms.message.fieldRequired"),
                            (val) => /.+@.+\..+/.test(val) || "Por favor, introduce una dirección de correo electrónico válida",
                        ],
                    } 
                }
            }
            return this.isSendEmailToExternalData ?  { ...email } : { ...phoneNumber }
        },
        modalActions() {
            return [
                {
                    props: { label: this.$tr("isite.cms.label.save"), color: "green" },
                    action: () => this.$refs.formContent.submit()
                },
            ];
        },
        formFields() {
            const categoryFields = this.categorySelected?.formFields || {};
            return {
                category: {
                    type: "treeSelect",
                    required: true,
                    props: {
                        disableBranchNodes: true,
                        label: `${this.$tr("isite.cms.label.category")} *`,
                        options: this.$array.tree(this.categories)
                    }
                },
                name: {
                    value: null,
                    type: "input",
                    required: true,
                    props: {
                        label: `${this.$tr("isite.cms.form.title")} *`,
                        vIf: this.categorySelected,
                    }
                },
                to: {
                    value: [],
                    ...this.typeDynamicField()
                },
                run: [{
                        name: "runForm",
                        fields: {
                            when: {
                                value: null,
                                type: "select",
                                required: true,
                                colClass: ["inBefore", "inAfter"].includes(this.form.run.when) ? "col-12 col-md-6" : "col-12",
                                props: {
                                    label: this.$tr("isite.cms.label.when"),
                                    options: [
                                        { label: this.$tr("isite.cms.label.currentTime"), value: "currentTime" },
                                        { label: this.$tr("isite.cms.label.exactTime"), value: "exactTime" },
                                        { label: this.$tr("isite.cms.label.inBefore"), value: "inBefore" },
                                        { label: this.$tr("isite.cms.label.inAfter"), value: "inAfter" },
                                    ]
                                }
                            },
                            type: {
                                value: "minutes",
                                type: "select",
                                required: true,
                                props: {
                                    label: this.$tr("isite.cms.form.type"),
                                    vIf: ["inBefore", "inAfter"].includes(this.form.run.when),
                                    options: [
                                        { label: this.$trp("isite.cms.label.hour"), value: "hours" },
                                        { label: this.$trp("isite.cms.label.minute"), value: "minutes" },
                                        { label: this.$trp("isite.cms.label.day"), value: "days" }
                                    ]
                                }
                            },
                            value: {
                                type: "input",
                                required: true,
                                props: {
                                    vIf: ["inBefore", "inAfter"].includes(this.form.run.when),
                                    label: this.$tr("isite.cms.label.time")
                                }
                            },
                            date: {
                                value: "created_at",
                                type: "select",
                                required: true,
                                props: {
                                    label: this.$tr("isite.cms.label.field"),
                                    vIf: ["inBefore", "inAfter"].includes(this.form.run.when),
                                    options: [
                                        { label: this.$trp("isite.cms.form.createdAt"), value: "created_at" },
                                        { label: this.$trp("isite.cms.form.updatedAt"), value: "updated_at" }
                                    ]
                                }
                            }
                        }
                    }],
                categoryFields: !Object.values(categoryFields).length ? null : [{
                    name: "categoryFields",
                    fields: categoryFields
                }]
            };
        },
        categorySelected() {
            return this.categories.find(category => category.id == this.form.categoryId) || {};
        }
    },
    methods: {
        async openModal(statusId, title, id = null) {
            try {
                this.automationId = id;
                this.loading = true;
                let response = false;
                this.statusId = statusId;
                this.modalTitle = `${this.$tr("requestable.cms.newRule")} - ${title}`;
                this.show = true;
                if (id) {
                    response = await this.showAutomation(id);
                }
                await this.getCategories(response);
            } catch (error) {
                console.log(error);
                this.loading = false;
            }
        },
        getCategories(data = false) {
            return new Promise(resolve => {
                //Request params
                const requestParams = {
                    refresh: true,
                    params: {
                        filter: { statusId: this.statusId, categoryId: this.$filter.values.categoryId }
                    }
                };
                //Request
                this.$crud.index("apiRoutes.qrequestable.categoriesRule", requestParams).then(async (response) => {
                    const categoriesRule = this.$clone(response.data);
                    if (data) {
                        const category = await categoriesRule.find(item => item.id === data.categoryRuleId);
                        await data.fields.forEach(item => {
                            if (category.formFields[item.name]) {
                                category.formFields[item.name].value = item.value;
                            }
                        });
                    }
                    // telegram is hidden until the functionality remains
                    this.categories = await this.$clone(categoriesRule);
                    this.loading = false;
                }).catch(error => { console.log(error); this.loading = false; });
            });
        },
        async showAutomation(id) {
            try {
                const API_ROUTE = 'apiRoutes.qrequestable.automationRule';
                const requestParams = {
                    refresh: true,
                    params: {
                        filter: {
                            statusId: this.statusId,
                            categoryId: this.$filter.values.categoryId
                        }
                    }
                };
                const response = await this.$crud.show(API_ROUTE, id, requestParams);
                this.form.categoryId = response.data.categoryRuleId;
                this.form.name = response.data.name;
                const when = response.data.runType ? { when: response.data.runType } : {};
                this.form.run = { ...when, ...response.data.runConfig };
                this.form.to = response.data.to;
                return response.data;
            }
            catch (error) {
                this.$apiResponse.handleError(error, () => {
                    this.loading = true;
                });
            }
        },
        submitData() {
            const API_ROUTE = "apiRoutes.qrequestable.automationRule";
            this.loading = true;
            //Instance the rule data
            var ruleData = {
                categoryRuleId: this.form.categoryId,
                name: this.form.name,
                to: this.form.to,
                runType: this.form.run.when,
                runConfig: null,
                statusId: this.statusId,
                ...this.form.categoryFields
            };
            //Validate the runConfig
            if (["exactTime"].includes(this.form.run.when)) {
                ruleData.runConfig = { date: "created_at" };
            }
            else if (["inBefore", "inAfter"].includes(this.form.run.when)) {
                ruleData.runConfig = {
                    type: this.form.run.type,
                    value: this.form.run.value,
                    date: this.form.run.date
                };
            }

            const crud = this.automationId
                ? this.$crud.update(API_ROUTE, this.automationId, ruleData)
                : this.$crud.create(API_ROUTE, ruleData);
            //Request
            crud.then(response => {
                this.loading = false;
                this.addCard(this.statusId);
                this.resetForm();
                this.show = false;
            }).catch(error => this.loading = false);
        },
        resetForm() {
            this.categories = [];
            this.form = {
                categoryId: null,
                run: {},
                categoryFields: {},
                to: null
            };
        },
        whatLoadOptions() {
            const INTERNAL_COMMUNICATION_ID = 7;

            const loadOptionsUsers = {
                apiRoute: "apiRoutes.quser.users",
                filterByQuery: true,
                select: {
                    label: "fullName",
                    id: "id"
                },
            };
            const loadOptionsCategories = {
                delayed: () => {
                  return new Promise(resolve => {
                      this.$crud.get(
                        "apiRoutes.qrequestable.categoriesFormFields", 
                        {
                          filter: {
                              type: this.categorySelected?.options?.filterFormFieldType
                          }
                        }, 
                        { categoryId: this.funnelId }
                      ).then(response => 
                      resolve(response.data)).catch(error => resolve([])
                    );
                  });
                },
                filterByQuery: true,
                select: {
                    label: "name",
                    id: "id"
                }
            };

            return this.categorySelected?.parentId === INTERNAL_COMMUNICATION_ID
                ? loadOptionsUsers
                : loadOptionsCategories;
        },
        typeDynamicField() {
            const selectField = {
                value: null,
                type: "select",
                vIf: this.isSelectField,
                props: {
                    multiple: true,
                    useChips: true,
                    clearable: true,
                    label: `${this.$tr("isite.cms.label.recipient")} *`,
                },
                loadOptions: {
                    ...this.whatLoadOptions()
                }
            }
            const multiDynamicField = {
                value: [],
                type : 'multiplier',
                vIf: this.isMultiDynamicfield,
                props : {
                    label : 'Destinatarios',
                    isDraggable: true, // Default true
                    minQuantity: 1,
                    maxQuantity: 7, // Default 5
                    fields : {
                        ...this.whatTypeField
                    }
                }
            }
            return this.isSelectField ? { ...selectField  } : { ...multiDynamicField }
        },
    },
};
</script>
