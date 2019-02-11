import {get_company_list, update_agency,} from "../../services/CI/CI1001S";
import {Modal} from 'antd';
import {create_agency, delete_agency, get_address, get_agency_list} from "../../services/Company/companyS";
import {BossMessage} from "../../components/Common/BossMessages";
const confirm=Modal.confirm;
export default {
    namespace: "bi1001Info",
    state:{
        agencyList: [],
        companyList:[],
        countryList: [],
        provinceList: [],
        cityList: [],
    },
    effects: {
        * get_agency_list({payload}, {call, put}) {
            const backData = yield call(get_agency_list, payload);
            if (backData.result) {
                yield put({
                    type: "update",
                    payload: {
                        agencyList: backData.result
                    }
                })
            }

        },
        *get_company_list({payload},{call,put}){
            const backData = yield call(get_company_list, payload);
            if (backData.result) {
                yield put({
                    type: "update",
                    payload: {
                        companyList: backData.result
                    }
                })
            }
        },
        * create_agency({payload}, {call, put}) {
            const backData=yield call(create_agency,payload.update);
            if (backData.success) {
                const confirmModal=confirm({
                    title:"新增成功",
                    okText:"继续添加",
                    cancelText:"知道了",
                    onOk:()=>{
                        confirmModal.destroy();
                    },
                    onCancel:()=>{
                       payload.vm.props.onCancel();
                    }
                });
                yield put({
                    type:"get_agency_list",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "添加失败" + backData.result);
            }
        },
        * update_agency({payload}, {call, put}) {
            const backData=yield call(update_agency,payload.update);
            if (backData.success) {
                BossMessage(true,"编辑成功");
                yield put({
                    type:"get_agency_list",
                    payload:payload.init
                })
            }else{
                BossMessage(false,"编辑失败:"+backData.result)
            }
        },

        *delete_agency({payload},{call,put}){
            const backData=yield call(delete_agency,payload.delete);
            if (backData.success) {
                BossMessage(true,"删除成功");
                yield put({
                    type:"get_agency_list",
                    payload:payload.init
                })
            }else{
                BossMessage(false,"删除失败:"+backData.result);
            }

        },
        * get_address({payload}, {call, put}) {
            const backData = yield call(get_address, payload);
            switch (payload.level) {
                case 1:
                    yield put({
                        type: "update",
                        payload: {
                            countryList: backData.result
                        }
                    });
                    break;
                case 2:
                    yield put({
                        type: "update",
                        payload: {
                            provinceList: backData.result
                        }
                    });
                    break;
                case 3:
                    yield put({
                        type: "update",
                        payload: {
                            cityList: backData.result
                        }
                    });
                    break;
                default:
                    break;

            }
        },
        *delete_agency_batch({payload},{call,put}){
            const backData = yield call(delete_agency, payload.delete);
            if (backData.success) {
                BossMessage(true,"删除成功");
                yield put({
                    type:"get_agency_list",
                    payload:payload.init
                })
            }else{
                BossMessage(false,"删除失败:"+backData.result);
            }
        }

    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}