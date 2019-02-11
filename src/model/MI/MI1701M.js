import {get_request_log} from "../../services/Company/companyS";

export default {
    namespace: "mi1701Info",
    state: {
        logList:[],
        total:0
    },
    effects: {
        *get_request_log({payload},{call,put}){
            const backData=yield call(get_request_log,payload);
            yield put({
                type:"update",
                payload:{
                    logList:backData.result,
                    total:backData.total
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