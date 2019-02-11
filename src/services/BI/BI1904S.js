import $ from '../../utils/ajax';

async function get_wifi(params) {
    return $.getJSON("/v1/company/get_wifi/", params)
}
async function get_wifi_config_file(params) {
    return $.getJSON("/v1/company/get_wifi_config_file/", params)
}
async function update_wifi(params) {
    return $.post("/v1/company/update_wifi/", params)
}
export {get_wifi,update_wifi,get_wifi_config_file};