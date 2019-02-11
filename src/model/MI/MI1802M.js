import {get_redis_alarm_log} from "../../services/Company/companyS";

export default {
    namespace: "mi1802Info",
    state: {
        alarmLogList:[]
    },
    effects: {
        *get_redis_alarm_log({payload},{call,put}){
            const backData=yield call(get_redis_alarm_log,payload);
            yield put({
                type:"update",
                payload:{
                    alarmLogList: backData.result
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