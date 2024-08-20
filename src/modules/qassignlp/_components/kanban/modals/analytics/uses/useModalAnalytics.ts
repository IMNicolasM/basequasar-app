import { computed, onBeforeMount } from "vue";
import store from "src/modules/qsite/_components/master/kanban/modals/analytics/store";
import changeDate from '../actions/changeDate'
import show from '../actions/show'
import { i18n } from 'src/plugins/utils'

export default function useModalAnalytics() {
    const loading = computed(() => store.loading);
    const showModal = computed({
        get: () => store.showModal,
        set(value) {
            store.showModal = value
        }
    });
    const filterDate = computed({
        get: () => store.filterDate,
        async set(value) {
            store.filterDate = value
            await changeDate();
            await show();
        }
    });
    const field = computed(() => ({
        date: {
            value: null,
            type: 'select',
            props: {
                label: i18n.tr('isite.cms.form.date'),
                clearable: true,
                options: [
                    {label: i18n.tr('isite.cms.label.customRange'), value: 'customRange'},
                    {label: i18n.tr('isite.cms.label.today'), value: 'today'},
                    {label: i18n.tr('isite.cms.label.yesterday'), value: 'yesterday'},
                    {label: i18n.tr('isite.cms.label.tomorrow'), value: 'tomorrow'},
                    {label: i18n.tr('isite.cms.label.LastNumDays', {numDays: 7}), value: 'lastSevenDays'},
                    {label: i18n.tr('isite.cms.label.LastNumDays', {numDays: 30}), value: 'lastThirtyDays'},
                    {label: i18n.tr('isite.cms.label.LastNumDays', {numDays: 60}), value: 'lastSixtyDays'},
                    {label: i18n.tr('isite.cms.label.currentWeek'), value: 'currentWeek'},
                    {label: i18n.tr('isite.cms.label.lastWeek'), value: 'lastWeek'},
                    {label: i18n.tr('isite.cms.label.nextWeek'), value: 'nextWeek'},
                    {label: i18n.tr('isite.cms.label.currentMonth'), value: 'currentMonth'},
                    {label: i18n.tr('isite.cms.label.lastMonth'), value: 'lastMonth'},
                    {label: i18n.tr('isite.cms.label.nextMonth'), value: 'nextMonth'},
                    {label: i18n.tr('isite.cms.label.numMonthsAgo', {numMonths: 2}), value: 'twoMonthsAgo'},
                    {label: i18n.tr('isite.cms.label.currentYear'), value: 'currentYear'},
                    {label: i18n.tr('isite.cms.label.lastYear'), value: 'lastYear'},
                    {label: i18n.tr('isite.cms.label.numYearsAgo', {numYears: 2}), value: 'twoYearsAgo'},
                    {label: i18n.tr('isite.cms.label.lastNumYears', {numYears: 2}), value: 'lastTwoYears'},
                ]
            }
        }
    }))

    const chartsData = computed(() => store.chartsData);
    function hidden() {
        store.reset();
    }
    onBeforeMount(() => {
        hidden()
    })
    return {
        chartsData,
        showModal,
        loading,
        field,
        filterDate,
        hidden,
    };
}
