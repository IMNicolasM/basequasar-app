import kanbanStore from '../kanbanStore.js';
export default function getKanbanColumns(data) {
    const kanbanColumn = data.map((item, index) => {
        return {
            id: item.id,
            title: item.title,
            color: item.color,
            data: [],
            page: 1,
            total: 0,
            loading: false,
            new: false,
            position: index
        }
    })
    kanbanColumn.forEach(async (column) => {
        const kanbanCard = await kanbanStore().getKanbanCard(column);
        column.data = kanbanCard.data;
        column.loading = false;
        column.total = kanbanCard.total;
    });
    return kanbanColumn;
};