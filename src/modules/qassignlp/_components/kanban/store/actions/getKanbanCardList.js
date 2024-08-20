import getCardList from './getCardList.js';
import baseService from 'modules/qcrud/_services/baseService.js';
import kanbanStore from '../kanbanStore.js';

export default async function getKanbanCardList(column, page) {
    try {
        const route = kanbanStore().getRoutes().card;
        const parameters = {params: {},refresh: true}
        parameters.params.include = route.include;
        parameters.params.filter = { [route.filter.name]: column.id };
        parameters.params.page = page;
        parameters.params.take = 10;
        const response = await baseService.index(route.apiRoute, parameters);
        return getCardList(response);
    } catch (error) {
        console.log(error);
    }
}
