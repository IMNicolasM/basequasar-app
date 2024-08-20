import store from '../store/index';
import moment from 'moment';

export default async function changeDate(): Promise<void> {
    switch (store.filterDate) {
        case 'today':
            store.from = moment().format('YYYY-MM-DD 00:00:00')
            store.to = moment().format('YYYY-MM-DD 23:59:59')
            break;
        case 'yesterday':
            store.from = moment().subtract(1, 'd').format('YYYY-MM-DD 00:00:00')
            store.to = moment().subtract(1, 'd').format('YYYY-MM-DD 23:59:59')
            break;
        case 'tomorrow':
            store.from = moment().add(1, 'd').format('YYYY-MM-DD 00:00:00')
            store.to = moment().add(1, 'd').format('YYYY-MM-DD 23:59:59')
            break;
        case 'lastSevenDays':
            store.from = moment().subtract(6, 'd').format('YYYY-MM-DD 00:00:00')
            store.to = moment().format('YYYY-MM-DD 23:59:59')
            break;
        case 'currentWeek':
            store.from = moment().startOf('isoWeek').format('YYYY-MM-DD 00:00:00')
            store.to = moment().endOf('isoWeek').format('YYYY-MM-DD 23:59:59')
            break;
        case 'lastWeek':
            store.from = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD 00:00:00')
            store.to = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD 23:59:59')
            break;
        case 'nextWeek':
            store.from = moment().add(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD 00:00:00')
            store.to = moment().add(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD 23:59:59')
            break;
        case 'lastThirtyDays':
            store.from = moment().subtract(29, 'd').format('YYYY-MM-DD 00:00:00')
            store.to = moment().format('YYYY-MM-DD 23:59:59')
            break;
        case 'lastSixtyDays':
            store.from = moment().subtract(59, 'd').format('YYYY-MM-DD 00:00:00')
            store.to = moment().format('YYYY-MM-DD 23:59:59')
            break;
        case 'currentMonth':
            store.from = moment().startOf('month').format('YYYY-MM-DD 00:00:00')
            store.to = moment().endOf('month').format('YYYY-MM-DD 23:59:59')
            break;
        case 'lastMonth':
            store.from = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD 00:00:00')
            store.to = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD 23:59:59')
            break;
        case 'nextMonth':
            store.from = moment().add(1, 'months').startOf('month').format('YYYY-MM-DD 00:00:00')
            store.to = moment().add(1, 'months').endOf('month').format('YYYY-MM-DD 23:59:59')
            break;
        case 'twoMonthsAgo':
            store.from = moment().subtract(2, 'months').startOf('month').format('YYYY-MM-DD 00:00:00')
            store.to = moment().subtract(2, 'months').endOf('month').format('YYYY-MM-DD 23:59:59')
            break;
        case 'twoYearsAgo':
            store.from = moment().subtract(2, 'year').startOf('year').format('YYYY-MM-DD 00:00:00')
            store.to = moment().subtract(2, 'year').endOf('year').format('YYYY-MM-DD 23:59:59')
            break;
        case 'lastYear':
            store.from = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD 00:00:00')
            store.to = moment().subtract(1, 'year').endOf('year').format('YYYY-MM-DD 23:59:59')
            break;
        case 'lastTwoYears':
            store.from = moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD 00:00:00')
            store.to = moment().endOf('year').format('YYYY-MM-DD 23:59:59')
            break;
        case 'currentYear':
            store.from = moment().startOf('year').format('YYYY-MM-DD 00:00:00')
            store.to = moment().endOf('year').format('YYYY-MM-DD 23:59:59')
            break;
        case 'customRange':
            if (store.from)
                store.from = moment(store.from).format('YYYY-MM-DD 00:00:00')
            if (store.to)
                store.to = moment(store.to).format('YYYY-MM-DD 23:59:59')
            break;
        default: {
            store.from = null
            store.to = null
        }
    }
}