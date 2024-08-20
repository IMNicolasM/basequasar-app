import {
    computed,
    inject,
    ref,
    onBeforeUnmount
} from "vue";
import kanbanStore from "../../../store/kanbanStore.js";
import crud from 'src/modules/qcrud/_services/baseService.js'
import { alert, i18n } from 'src/plugins/utils'

export default function useModalAnalytics() {
    const statusList: any = ref({
        inProgress: [],
        success: [],
        failed: [],
    });
    const loading = ref(false);
    const getStatus = inject("getStatus", () => ({ data: [] }));
    const routes: any = inject("routes");
    const saveColumn = inject("saveColumn", false);
    const updateColumn = inject("updateColumn", false);
    const init: any = inject("init", () => false);
    const showModal = computed({
        get: () => kanbanStore().getModalStatus(),
        set: async (value: boolean) => {
            kanbanStore().setModalStatus(value);
            if (value) {
                loading.value = true;
                const response = await getStatus();
                statusList.value = response.data.reduce(
                    (result, item) => {
                        const status: any = item;
                        switch (status.type) {
                            case 0:
                                result.inProgress.push(item);
                                break;
                            case 1:
                                result.failed.push(item);
                                break;
                            case 2:
                                result.success.push(item);
                                break;
                            default:
                                break;
                        }
                        return result;
                    },
                    { inProgress: [], success: [], failed: [] }
                );
                loading.value = false;
            }
        },
    });
    function addStatus(index, type) {
        try {
            enum Status {
                inProgress = 0,
                failed = 1,
                success = 2
            }
            const modelColumn = {
                id: null,
                title: null,
                color: null,
                edit: true,
                type: Status[type],
            };

            const counter = `kanban-${statusList.value[type].length + 1}`;
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            const column: any = { ...modelColumn };
            column.id = counter;
            column.color = `#${randomColor}`;
            // @ts-ignore
            statusList.value[type].splice(index + 1, 0, column);
        } catch (error) {
            console.log(error);
        }
    }
    async function deleteStatus(id, type) {
        try {
            if (!isNaN(id)) {
                // @ts-ignore
              await crud.delete(routes.column.apiRoute, id).then(res => {
                    statusList.value[type] = statusList.value[type].filter(
                        (item) => item.id !== id
                    );
                    alert.info({ message: i18n.tr('isite.cms.message.recordDeleted') });
                })
                .catch(err => {

                });

            } else {
                statusList.value[type] = statusList.value[type].filter(
                    (item) => item.id !== id
                );
                alert.info({ message: i18n.tr('isite.cms.message.recordDeleted') });
            }
        } catch (error) {
            console.log(error);
        }
    }


    async function hideModal() {
        showModal.value = false;
        statusList.value = {
            inProgress: [],
            success: [],
            failed: [],
        };
        await init(false, true);
    }

    async function saveStatusOrdering(type) {
        try {
            if (!routes.orderStatus) return;
            const route = routes.orderStatus;
            const statusId = statusList.value[type].map((item) => ({
                id: item.id,
            }));
            await crud.create(route.apiRoute, {
                [route.filter.name]: statusId,
            });
        } catch (error) {
            console.log(error);
        }
    }
    onBeforeUnmount(() => {
        hideModal();
    });
    return {
        showModal,
        hideModal,
        statusList,
        addStatus,
        deleteStatus,
        saveStatusOrdering,
        saveColumn,
        updateColumn,
        loading
    };
}
