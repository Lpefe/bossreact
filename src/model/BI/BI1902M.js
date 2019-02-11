import {get_ssid_template,create_ssid_template,delete_ssid_template,update_ssid_template} from "../../services/BI/BI1902S";
import {BossMessage} from "../../components/Common/BossMessages";
import {get_company_list} from "../../services/Company/companyS";
export default {
    namespace: "bi1902Info",
    state: {
        dataSource:[],
        companyList:[],
    },
    effects: {
        *get_ssid_template({payload},{call,put}){
            const backData=yield call(get_ssid_template,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource: backData.result,
                }
            })
        },
        *get_company_list({payload},{call,put}){
            const backData=yield call(get_company_list,payload);
            yield put({
                type:"update",
                payload:{
                    companyList:backData.result
                }
            })
        },
        *create_ssid_template({payload},{call,put}){
            const backData = yield call(create_ssid_template, payload.update);
            if (backData.success) {
                BossMessage(true, "添加成功");
                yield put({
                    type:"get_ssid_template",
                    payload:payload.init
                });
            } else {
                BossMessage(false, "添加失败" + backData.result);
            }
        },
        *delete_ssid_template({payload},{call,put}){
            const backData=yield call(delete_ssid_template,payload);
            if (backData.success) {
                BossMessage(true, "删除成功");
                yield put({
                    type: "get_ssid_template",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "删除失败" + backData.result);
            }
        },
        *update_ssid_template({payload},{call,put}){
            const backData=yield call(update_ssid_template,payload.update);
            if (backData.success) {
                BossMessage(true, "修改成功");
                yield put({
                    type: "get_ssid_template",
                    payload: payload.init
                })
            }else{
                BossMessage(false, "修改失败" + backData.result);
            }
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}