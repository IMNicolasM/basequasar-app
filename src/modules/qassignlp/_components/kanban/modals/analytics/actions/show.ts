import crud from 'modules/qcrud/_services/baseService.js'
import store from '../store/index'
import { i18n, alert } from 'src/plugins/utils'

export default async function showAnalytics(criteria: string = 'leadsByStatus') {
    try {
        const filters = {
            date: {
            "field": "created_at",
            "type": store.filterDate,
            "from": store.from,
            "to": store.to
            },
            categoryId: store.categoryId
        }
        store.loading = true;
        const response = await crud.show("apiRoutes.qrequestable.analytics", criteria, {
            refresh: true,
            params: {
                filter: { ...filters }
            }
        })
        store.chartsData = response.data;
        store.loading = false;
    } catch (error) {
        store.loading = false;
        alert.error({message:  i18n.tr('isite.cms.message.errorRequest'), pos: 'bottom'})
        return { data: {} }
    }
}
