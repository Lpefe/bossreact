import {batch_update_redis_alarm, deal_alarm, get_redis_alarm} from "../../services/Company/companyS";
import {_crypto} from "../../utils/commonUtilFunc";
import {BossMessage} from "../../components/Common/BossMessages";

export default {
    namespace: "mi1801Info",
    state: {
        tempPayload: {},
        alarmList: [],
    },
    effects: {
        * ignore({payload}, {call, put}) {
            const backData = yield call(batch_update_redis_alarm, payload.update);
            if (backData.success) {
                BossMessage(true, "操作成功");
                yield put({
                    type: "get_redis_alarm",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "操作失败" + backData.result)
            }
        },
        * process({payload}, {call, put}) {
            yield put({
                type: "update",
                payload: {
                    tempPayload: payload.update
                }
            })
        },
        * confirm({payload}, {call, put, select}) {
            const temp = yield select(state => state.mi1801Info.tempPayload);
            let payloadUsed = {
                alarm_id: temp.alarm_id,
                password: _crypto(payload.update.password),
                sn: temp.sn,
                remark: temp.remark,
                cmd: temp.debug
            };
            const backData = yield call(deal_alarm, payloadUsed);
            if (backData.success) {
                BossMessage(true, "操作成功");
                yield put({
                    type: "get_redis_alarm",
                    payload: payload.init
                })
            } else {
                BossMessage(false, "操作失败" + backData.result)
            }

        },
        * get_redis_alarm({payload}, {call, put}) {
            const backData = yield call(get_redis_alarm, payload);
            yield put({
                type: "update",
                payload: {
                    alarmList: backData.result,
                    total: backData.total
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