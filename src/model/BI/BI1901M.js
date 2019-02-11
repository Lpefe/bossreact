import {get_wifi,update_wifi} from "../../services/BI/BI1901S";
import {BossMessage} from "../../components/Common/BossMessages";

export default {
    namespace: "bi1901Info",
    state: {
        dataSource:[],
    },
    effects: {
        *getWifi({payload},{call,put}){
            const backData=yield call(get_wifi,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource: backData.result,
                }
            })
        },
        *updateWifi({payload},{call,put}){
            const backData=yield call(update_wifi,payload.update);
            if (backData.success) {
                BossMessage(true, "修改成功");
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