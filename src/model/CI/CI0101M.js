import {Modal} from 'antd';
import {
    create_agency,
    create_iptable, delete_agency,
    delete_agency_batch, delete_device, delete_iptable,
    get_agency_list, get_company_list,
    get_device_list,
    get_device_stat, get_iptable_list, move_device,
    exchange_device, get_device_model, get_cmd_list
} from "../../services/Company/companyS";
import {get_alarm_list} from "../../services/Alarm/alarmS";
import messages from '../../../src/components/CI/CI0101New/LocaleMsg/messages';
import {BossMessage} from "../../components/Common/BossMessages";

export default {
    namespace: "ci0101Info",
    state: {
        agencyData: [],
        agencyDataStep: [],
        deviceData: [],
        companyInfo: {},
        ipTableList: [],
        deviceStat: {},
        INIT: 0,
        OFFLINE: 0,
        ONLINE: 0,
        alarmList: [],
        alertModalShow: false,
        popDeviceList:[],
        agencyList:[],
        total:0,
        deviceModelList:[],
        cmdList:[],

    },
    effects: {
        *get_agency_list({payload},{call,put}){
            const backData=yield call(get_agency_list,payload);
            yield put({
                type:"update",
                payload:{
                    agencyList:backData.result
                }
            })
        },
        *get_cmd_list({payload},{call,put}){
            const backData=yield call(get_cmd_list,payload);
            yield put({
                type:"update",
                payload:{
                    cmdList:backData.result
                }
            })
        },
        *get_device_model({payload},{call,put}){
            const backData=yield call(get_device_model,payload);
            yield put({
                type:"update",
                payload:{
                    deviceModelList: backData.result,
                }
            })
        },
        *exchange_device({payload},{call,put}){
            const backData=yield call(exchange_device,payload.update);
            if(backData.success){
                BossMessage(true,"设备更换成功");
                yield put({
                    type:"getDeviceList",
                    payload:payload.init
                })
            }else{
                BossMessage(false, "设备更换失败"+backData.result);
            }
        },
        *move_device({payload},{call,put}){
            const backData=yield call(move_device,payload.update);
            if(backData.success){
                Modal.success({
                    title: "设备迁移成功"
                });
                yield put({
                    type:"getDeviceList",
                    payload:payload.init
                })
            }else{
                Modal.error({
                    title: "设备迁移失败",
                    content: backData.result
                })
            }

        },
        * getCompanyList({payload}, {call, put}) {
            const backData = yield call(get_company_list, payload);
            yield put({
                type: "update",
                payload: {
                    companyInfo: backData.result[0]
                }
            })
        },
        * get_device_stat({payload}, {call, put}) {
            const backData = yield call(get_device_stat, payload);
            yield put({
                type: "update",
                payload: {
                    INIT: backData.INIT || 0,
                    ONLINE: backData.ONLINE || 0,
                    OFFLINE: backData.OFFLINE || 0,
                }
            })
        },
        * getAgencyList({payload}, {call, put}) {
            const backData = yield call(get_agency_list, payload);
            yield put({
                type: "update",
                payload: {
                    agencyData: backData.result
                }
            })
        },
        * getAgencyListStep({payload}, {call, put}) {
            const backData = yield call(get_agency_list, payload);
            yield put({
                type: "update",
                payload: {
                    agencyDataStep: backData.result
                }
            })
        },
        * getDeviceList({payload}, {call, put}) {
            const backData = yield call(get_device_list, payload);
            yield put({
                type: "update",
                payload: {
                    deviceData: backData.result,
                    total:backData.total
                }
            })
        },
        * delete_agency_batch({payload}, {call, put}) {
            const backData = yield call(delete_agency_batch, payload);
            if (backData.success) {
                BossMessage(true,"删除成功");
                const agencyList = yield call(get_agency_list, {
                    company_id: sessionStorage.getItem("companyId"),
                    type: payload.type
                });
                if (payload.type === "STEP") {
                    yield put({
                        type: "update",
                        payload: {
                            agencyDataStep: agencyList.result
                        }
                    })
                } else {
                    yield put({
                        type: "update",
                        payload: {
                            agencyData: agencyList.result
                        }
                    })
                }

            } else {
                BossMessage(false,backData.result);
            }
        },
        * delete_agency({payload}, {call, put}) {
            const backData = yield call(delete_agency, payload);
            if (backData.success) {
                BossMessage(true,"删除成功");
                const agencyList = yield call(get_agency_list, {
                    company_id: sessionStorage.getItem("companyId"),
                    type: payload.type
                });
                if (payload.type === "STEP") {
                    yield put({
                        type: "update",
                        payload: {
                            agencyDataStep: agencyList.result
                        }
                    })
                } else {
                    yield put({
                        type: "update",
                        payload: {
                            agencyData: agencyList.result
                        }
                    })
                }

            } else {
                Modal.error({
                    title: backData.result
                })
            }
        },
        * create_agency({payload}, {call, put}) {
            const backData = yield call(create_agency, payload);
            if (backData.success) {
                BossMessage(true, "添加成功");
                const agencyList = yield call(get_agency_list, {
                    company_id: sessionStorage.getItem("companyId"),
                    type: payload.type
                });
                if (payload.type === "STEP") {
                    yield put({
                        type: "update",
                        payload: {
                            agencyDataStep: agencyList.result
                        }
                    })
                } else {
                    yield put({
                        type: "update",
                        payload: {
                            agencyData: agencyList.result
                        }
                    })
                }

            } else {
                BossMessage(false, "添加失败"+backData.result);
            }

        },
        * get_iptable_list({payload}, {call, put}) {
            const backData = yield call(get_iptable_list, payload);
            yield put({
                type: "update",
                payload: {
                    ipTableList: backData.result,
                }
            })
        },
        * create_iptable({payload}, {call, put}) {
            const backData = yield call(create_iptable, payload);
            if (backData.success) {
                BossMessage(true, "添加成功");
                const backData = yield call(get_iptable_list, {
                    agency_id: payload.agency_id,
                    company_id: sessionStorage.getItem("companyId")
                });
                yield put({
                    type: "update",
                    payload: {
                        ipTableList: backData.result,
                    }
                })
            } else {
                Modal.error({
                    title: backData.result
                });
            }

        },
        * delete_iptable({payload}, {call, put}) {
            const backData = yield call(delete_iptable, payload);
            if (backData.success) {
                BossMessage(true,"删除成功");
                const backData = yield call(get_iptable_list, {
                    agency_id: payload.agency_id,
                    company_id: sessionStorage.getItem("companyId")
                });
                yield put({
                    type: "update",
                    payload: { 
                        ipTableList: backData.result,
                    }
                })
            } else {
                BossMessage(false, "删除失败"+backData.result);
            }
        },
        * get_alarm_list({payload}, {call, put}) {
            const __=payload.__;
            const backData = yield call(get_alarm_list, payload);
            if (backData.result.length === 0) {
                BossMessage(false, __(messages['24小时无警报']));
            } else {
                yield put({
                    type: "update",
                    payload: {
                        alarmList: backData.result,
                        alertModalShow: true
                    }
                })
            }

        },
        * closeAlertModal({payload}, {call, put}) {
            yield put({
                type: "update",
                payload: {
                    alertModalShow: false
                }
            })
        },
        * delete_device({payload}, {call, put}) {
            const backData = yield call(delete_device, payload.delete);
            if (backData.success) {
                BossMessage(true,"删除成功");
                const backData1 = yield call(get_device_list, payload.init);
                yield put({
                    type: "update",
                    payload: {
                        deviceData: backData1.result
                    }
                })
            } else {
                BossMessage(false, "删除失败:" + backData.result);
            }
        },
        *get_pop_device_list({payload},{call,put}){
            const backData = yield call(get_device_list, payload);
            yield put({
                type:"update",
                payload:{
                    popDeviceList:backData.result,
                }
            })
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};

        },
    }
}