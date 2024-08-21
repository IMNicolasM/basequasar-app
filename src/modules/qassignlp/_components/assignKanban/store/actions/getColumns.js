import kanbanStore from '../kanbanStore.js';
import getKanbanColumns from './getKanbanColumns.js';
import baseService from 'modules/qcrud/_services/baseService.js';

export default async function getColumns() {
    try {
        const route = kanbanStore().getRoutes().column;
        kanbanStore().showLoading();
        const parameters = {params: {},refresh: true}
        parameters.params.include = route.include;
        parameters.params.filter = {[route.filter.name]: kanbanStore().getFunnelSelected() };
        const response = await baseService.index(route.apiRoute, parameters);
        const kanbanColumn = getKanbanColumns(response.data);
        kanbanStore().setKanbanColumn(kanbanColumn);
        kanbanStore().hideLoading();
    } catch (error) {
        kanbanStore().hideLoading();
        kanbanStore().setKanbanColumn([]);
        console.log(error);
    }
}
