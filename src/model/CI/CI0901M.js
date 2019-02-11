import {create_white_list, delete_white_list, get_white_list, update_white_list} from '../../services/CI/CI0901S';
import {BossMessage} from "../../components/Common/BossMessages";


export default {
    namespace: "ci0901Info",
    state: {
        dataSource: [],
        ifAllowed: true
    },
    effects: {
        * get_white_list({payload}, {call, put}) {
            const backData = yield call(get_white_list, payload);
            if (backData.success) {
                yield put({
                    type: "update",
                    payload: {
                        dataSource: backData.result
                    }
                })
            } else {
                yield put({
                    type: "update",
                    payload: {
                        dataSource: backData.result,
                        ifAllowed: false,
                    }
                })
            }

        },
        * create_white_list({payload}, {call, put}) {
            const backData = yield call(create_white_list, payload);
            if (backData.success) {
                BossMessage(backData.success, "添加白名单成功");
                yield put({
                    type: "get_white_list",
                    payload: {
                        company_id: sessionStorage.getItem("companyId")
                    }
                })
            } else {
                BossMessage(backData.success, "添加白名单失败:" + backData.result)
            }
        }
        ,

        * update_white_list({payload}, {call, put}) {
            const backData = yield call(update_white_list, payload);
            if (backData.success) {
                yield put({
                    type: "get_white_list",
                    payload: {
                        company_id: sessionStorage.getItem("companyId")
                    }
                });
                BossMessage(backData.success, "编辑白名单成功");
            } else {
                BossMessage(backData.success, "编辑白名单失败:" + backData.result)
            }
        },
        * delete_white_list({payload}, {call, put}) {
            const backData = yield call(delete_white_list, payload);
            if (backData.success) {
                BossMessage(backData.success, "删除白名单成功");
                yield put({
                    type: "get_white_list",
                    payload: {
                        company_id: sessionStorage.getItem("companyId")
                    }
                })
            } else {
                BossMessage(backData.success, "删除白名单失败:" + backData.result)
            }
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    },
    init: function () {

    }
}