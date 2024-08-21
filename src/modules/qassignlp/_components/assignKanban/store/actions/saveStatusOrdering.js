import kanbanStore from '../kanbanStore.js';
import baseService from 'modules/qcrud/_services/baseService.js';

export default async function saveStatusOrdering() {
    try {
        const route = kanbanStore().getRoutes().orderStatus;
        const statusId = kanbanStore().getKanbanColumn().map(item => ({ id: item.id }));
        await baseService.create(route.apiRoute, {[route.filter.name]: statusId })
    } catch (error) {
        console.log(error);
    }
}
