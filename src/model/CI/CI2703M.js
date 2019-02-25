import {get_agency_list,get_ssid_template,get_ssid_template_agency,create_ssid_template_agency,delete_ssid_template_agency,update_ssid_template_agency} from "../../services/CI/CI2703S";
import {BossMessage} from "../../components/Common/BossMessages";
import {get_company_list} from "../../services/Company/companyS";
export default {
    namespace: "ci2703Info",
    state: {
        dataSource:[],
        companyList:[],
        ssidTemplateList:[],
        agencyList:[]
    },
    effects: {
        *get_ssid_template_agency({payload},{call,put}){
            const backData=yield call(get_ssid_template_agency,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource: backData.result,
                }
            })
        }, 
        *get_agency_list({payload},{call,put}){
            const backData=yield call(get_agency_list,payload);
            yield put({
                type:"update",
                payload:{
                    agencyList: backData.result,
                }
            })
        },       
         *get_ssid_template({payload},{call,put}){
            const backData=yield call(get_ssid_template,payload);
            yield put({
                type:"update",
                payload:{
                    ssidTemplateList: backData.result,
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
        *create_ssid_template_agency({payload},{call,put}){
            const backData = yield call(create_ssid_template_agency, payload.update);
            console.log(payload)
            if (backData.success) {
                BossMessage(true, "添加成功");

            } else {
                BossMessage(false, "添加失败" + backData.result);
            }
        },
        *delete_ssid_template_agency({payload},{call,put}){
            const backData=yield call(delete_ssid_template_agency,payload);
            if (backData.success) {
                BossMessage(true, "删除成功");
                yield put({
                    type: "get_ssid_template_agency",
                    payload: {name:payload.selectName,company_id:payload.companyId}
                    
                })
            }else{
                BossMessage(false, "删除失败" + backData.result);
            }
        },
        *update_ssid_template_agency({payload},{call,put}){
            const backData=yield call(update_ssid_template_agency,payload);
            if (backData.success) {
                BossMessage(true, "更新成功");
                yield put({
                    type: "get_ssid_template_agency",
                    payload: {name:payload.selectName,company_id:payload.companyId}
                    
                })
            }else{
                BossMessage(false, "更新失败" + backData.result);
            }
        },
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}