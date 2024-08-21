import { reactive } from 'vue';
import baseService from 'modules/qcrud/_services/baseService.js';
import getKanbanCardList from './actions/getKanbanCardList.js';
import getColumns from './actions/getColumns.js';
import deleteColumn from './actions/deleteColumn.js';
import updateColumn from './actions/updateColumn.js';
import saveColumn from './actions/saveColumn.js';
import saveStatusOrdering from './actions/saveStatusOrdering.js';
import getFunnel from './actions/getFunnel.js';


const modelPayload = {
    id: null,
    title: null,
    color: null,
    value: 1,
    categoryId: null,
}
const modelColumn = {
    id: null,
    title: null,
    color: null,
    data: [],
    loading: false,
    page: 1,
    total: 0,
    new: true,
}
const state = reactive({
    kanbanColumn: [],
    funnelList: [],
    funnelSelected: null,
    loading: false,
    inputDynamicField: {
        value: null,
        type: 'input',
        isFakeField: true,
        props: {
            clearable: true,
        },
    },
    routes: {
        funnel: {
            apiRoute: null,
        },
        column: {
            apiRoute: null,
        },
        card: {
            apiRoute: null,
        },
        orderStatus: {
            apiRoute: null,
        },
    },
    payloadStatus: { ...modelPayload },
    modalStatus: false,
});

export default function kanbanStore() {
    /* start of mutualization set and get*/
    function getModalStatus() {
        return state.modalStatus;
    }
    function setModalStatus(data) {
        state.modalStatus = data;
    }
    function getKanbanColumn() {
        return state.kanbanColumn;
    }
    function setKanbanColumn(data) {
        state.kanbanColumn = data;
    }
    function setFunnelList(data) {
        state.funnelList = data;
    }
    function getFunnelList() {
        return state.funnelList;
    }
    function getFunnelSelected() {
        return state.funnelSelected;
    }
    function setFunnelSelected(value) {
        state.funnelSelected = value;
    }
    function getLoading() {
        return state.loading;
    }
    function hideLoading() {
        state.loading = false;
    }
    function showLoading() {
        state.loading = true;
    }

    function setResetPage() {
        state.kanbanColumn.forEach((item) => {
            item.page = 1;
        })
    }
    function getInputDynamicField() {
        return state.inputDynamicField;
    }
    function reorder(type) {
        state[type].forEach((item, index) => {
            item.position = index;
        });
    }
    function getPayloadStatus() {
        return state.payloadStatus;
    }
    function setPayloadStatus() {
        state.payloadStatus = {
            id: null,
            title: null,
            color: null,
            value: 1,
            categoryId: null,
        };
    }
    function setRoutes(routes) {
        state.routes = routes;
    }
    function getRoutes() {
        return state.routes;
    }
    /* end of mutualization */
    function addColumn(index) {
        try {
            const counter = `kanban-${state.kanbanColumn.length + 1}`;
            const randomColor = Math.floor(Math.random() * 16777215).toString(16);
            const column = { ...modelColumn };
            column.id = counter;
            column.color = `#${randomColor}`;
            state.kanbanColumn.splice(index + 1, 0, column);
        } catch (error) {
            console.log(error);
        }
    }
    function deleteKanbanCard(columnId, cardId) {
        const column = state.kanbanColumn.find(item => item.id === columnId);
        if (column) {
            column.data = column.data.filter(item => item.id !== cardId);
        }
    }
    async function getKanbanCard(column, page = 1) {
        try {
            column.loading = true;
            return getKanbanCardList(column, page);
        } catch (error) {
            column.loading = false;
            console.log(error);
        }
    }
    async function addKanbanCard(column, page) {
        const kanbancolumn = state.kanbanColumn.find(item => item.id === column.id);
        if (kanbancolumn) {
            const kanbanCard = await getKanbanCardList(column, page);
            if (kanbanCard.data.length > 0) {
                kanbancolumn.data.push(...kanbanCard.data);
            }
        }
    }
    return {
        getKanbanColumn,
        addColumn,
        deleteColumn,
        addKanbanCard,
        deleteKanbanCard,
        getColumns,
        getFunnelList,
        setFunnelList,
        setFunnelSelected,
        getFunnelSelected,
        getLoading,
        hideLoading,
        showLoading,
        getKanbanCardList,
        getKanbanCard,
        setResetPage,
        getInputDynamicField,
        reorder,
        saveStatusOrdering,
        saveColumn,
        updateColumn,
        setPayloadStatus,
        setKanbanColumn,
        getPayloadStatus,
        getFunnel,
        setRoutes,
        getRoutes,
        getModalStatus,
        setModalStatus
    }
}
