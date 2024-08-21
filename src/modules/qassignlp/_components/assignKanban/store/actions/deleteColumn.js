import kanbanStore from '../kanbanStore.js';
import baseService from 'modules/qcrud/_services/baseService.js';

export default async function deleteColumn(columnId) {
    try {
        const route = kanbanStore().getRoutes().column;
        const kanbanColumn = kanbanStore().getKanbanColumn().filter((item) => item.id !== columnId);
        kanbanStore().setKanbanColumn(kanbanColumn);
        if (!isNaN(columnId)) {
            await baseService.delete(route.apiRoute, columnId)
        }
    } catch (error) {
        console.log(error);
    }
}
