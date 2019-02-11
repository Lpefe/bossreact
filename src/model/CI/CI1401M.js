import {get_isp_dict,get_device_list,get_isp_of_cstep,create_isp_of_cstep,update_isp_of_cstep,delete_isp_of_cstep } from "../../services/CI/CI1401S";
import {BossMessage} from "../../components/Common/BossMessages";

export default {
    namespace: "ci1401Info",
    state: {
        dataSource:[],
        modalDataSource:[],
        ispList:[],
    },
    effects: {
        *get_device_list({payload},{call,put}){
            const backData=yield call(get_device_list,payload);
            yield put({
                type:"update",
                payload:{
                    dataSource:backData.result
                }
            })
        },
        *get_isp_of_cstep({payload},{call,put}){
            const backData=yield call(get_isp_of_cstep,payload);
            yield put({
                type:"update",
                payload:{
                    modalDataSource:backData.result
                }
            })
        },
        *create_isp_of_cstep({payload},{call,put}){
            const backData=yield call(create_isp_of_cstep,payload);
            if (backData.success) {
                BossMessage(true, "添加成功");
                const backData1 = yield call(get_isp_of_cstep, {sn:payload.sn});
                yield put({
                    type: 'update',
                    payload: {
                        modalDataSource: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "添加失败" + backData.result);
            }
        },
        *update_isp_of_cstep({payload},{call,put}){
            const backData=yield call(update_isp_of_cstep,payload);
            if (backData.success) {
                BossMessage(true, "编辑成功");
                const backData1 = yield call(get_isp_of_cstep, {sn:payload.sn});
                yield put({
                    type: 'update',
                    payload: {
                        modalDataSource: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "编辑失败:" + backData.result)
            }
        },
        *delete_isp_of_cstep ({payload},{call,put}){
            const backData=yield call(delete_isp_of_cstep,payload);
            if (backData.success) {
                BossMessage(true,"删除成功");
                const backData1 = yield call(get_isp_of_cstep, {sn:payload.sn});
                yield put({
                    type: 'update',
                    payload: {
                        modalDataSource: backData1.result,
                    }
                })
            } else {
                BossMessage(false, "删除失败:" + backData.result)
            }
        },
        *get_isp_dict({payload},{call,put}){
            const backData=yield call(get_isp_dict,payload);
            yield put({
                type:"update",
                payload:{
                    ispList:backData.result
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