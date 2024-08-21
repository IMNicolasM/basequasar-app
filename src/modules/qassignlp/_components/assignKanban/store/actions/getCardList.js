export default function getCardList(response) {
    return {
        total: response.meta.page.total,
        data: response.data.map(card => ({
            id: card.id,
            title: `${card.creator.firstName} ${card.creator.lastName}`,
            type: card.type,
            createdAt: card.createdAt,
            fields: card.fields,
            category: card.category
        }))
    }
};