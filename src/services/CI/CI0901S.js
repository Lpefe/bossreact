import $ from '../../utils/ajax';

async function get_white_list(params) {
    return $.getJSON("/v1/company/get_white_list/", params)
}

async function create_white_list(params) {
    return $.post("/v1/company/create_white_list/", params)
}


async function update_white_list(params) {
    return $.post("/v1/company/update_white_list/", params)
}


async function delete_white_list(params) {
    return $.post("/v1/company/delete_white_list/", params)
}
export {get_white_list,create_white_list,update_white_list,delete_white_list};