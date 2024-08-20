import kanbanStore from '../kanbanStore.js';
import baseService from 'modules/qcrud/_services/baseService.js';

export default async function updateColumn(data) {
    try {
        const route = kanbanStore().getRoutes().column.apiRoute;
        const payloadStatus = kanbanStore().getPayloadStatus();
        payloadStatus.id = data.id;
        payloadStatus.title = data.title;
        payloadStatus.color = data.color;
        payloadStatus.categoryId = kanbanStore().getFunnelSelected();
        await baseService.update(route, data.id, payloadStatus)
    } catch (error) {
        console.log(error);
        kanbanStore().setPayloadStatus();
    }
}
