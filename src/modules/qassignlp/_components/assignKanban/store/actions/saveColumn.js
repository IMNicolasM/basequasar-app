import kanbanStore from '../kanbanStore.js';
import baseService from 'modules/qcrud/_services/baseService.js';

export default async function saveColumn(data) {
    try {
        const route = kanbanStore().getRoutes().column.apiRoute;
        const payloadStatus = kanbanStore().getPayloadStatus();
        payloadStatus.title = data.title;
        payloadStatus.color = data.color;
        payloadStatus.categoryId = kanbanStore().getFunnelSelected();
        return await baseService.create(route, payloadStatus)
    } catch (error) {
        console.log(error);
        kanbanStore().setPayloadStatus();
    }
}
