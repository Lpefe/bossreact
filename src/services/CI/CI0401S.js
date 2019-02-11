import $ from '../../utils/ajax';

async function getTodayRate(params) {
    return $.getJSON("/v1/company/get_today_rate/",params)
}

async function getHistoryRate(params) {
    return $.getJSON("/v1/company/get_history_rate/",params)
}

export {getTodayRate,getHistoryRate};