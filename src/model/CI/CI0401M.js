import {getHistoryRate, getTodayRate} from "../../services/CI/CI0401S";

export default {
    namespace: "ci0401Info",
    state: {
        dataSource: [],
        modalDataSource: []
    },
    effects: {
        * init({payload}, {call, put}) {
            const backData=yield call(getTodayRate,payload);
            if(backData.success){
                yield put({
                    type: "update",
                    payload: {
                        dataSource: backData.result
                    }
                })
            }
        },
        * getHistoryRate({payload}, {call, put}) {
            const backData = yield call(getHistoryRate, payload);
            yield put({
                type: "update",
                payload: {
                    modalDataSource: backData
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