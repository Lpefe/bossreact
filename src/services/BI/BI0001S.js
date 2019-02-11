import $ from '../../utils/ajax';

async function update_company(params) {
    return $.post("/v1/company/update_company/", params)
}
export {update_company};