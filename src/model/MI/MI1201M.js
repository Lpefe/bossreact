import {get_compress, get_compress_rank, get_dedup_rank, get_deduplicate} from "../../services/rate/rateS";
import moment from 'moment';
export default {
    namespace:"mi1201Info",
    state:{
        dedupList:[],
        compressList:[],
        dedupBefore:[],
        dedupAfter:[],
        dedupPercent:[],
        compressBefore:[],
        compressAfter:[],
        compressPercent:[],
    },
    effects:{
        *get_dedup_rank({payload},{call,put}){
            const backData=yield call(get_dedup_rank,payload);
            if(backData.msg==="ok"){
                yield put({
                    type:"update",
                    payload:{
                        dedupList:backData.data
                    }
                })
            }
        },
        *get_deduplicate({payload},{call,put}){
            const backData=yield call(get_deduplicate,payload);
            let dedupBefore=[];
            let dedupAfter=[];
            let dedupPercent=[];
            if(backData.msg==="ok"){
                for(let i=0;i<backData.data.length;i++){
                    let temp=backData.data[i];
                    let time=moment(temp.time*1000).format("YYYY-MM-DD HH:mm:ss");
                    dedupBefore.push([time,(temp.before/1024/1024).toFixed(4)]);
                    dedupAfter.push([time,(temp.after/1024/1024).toFixed(4)]);
                    dedupPercent.push([time,temp.percent]);
                }
            }
            yield put({
                type:"update",
                payload:{
                    dedupPercent:dedupPercent,
                    dedupAfter:dedupAfter,
                    dedupBefore:dedupBefore
                }
            })

        },

        *get_compress_rank({payload},{call,put}){
            const backData=yield call(get_compress_rank,payload);
            if(backData.msg==="ok"){
                yield put({
                    type:"update",
                    payload:{
                        compressList:backData.data
                    }
                })
            }
        },
        *get_compress({payload},{call,put}){
            const backData=yield call(get_compress,payload);
            let compressBefore=[];
            let compressAfter=[];
            let compressPercent=[];
            if(backData.msg==="ok"){
                for(let i=0;i<backData.data.length;i++){
                    let temp=backData.data[i];
                    let time=moment(temp.time*1000).format("YYYY-MM-DD HH:mm:ss");
                    compressBefore.push([time,(temp.before/1024/1024).toFixed(4)]);
                    compressAfter.push([time,(temp.after/1024/1024).toFixed(4)]);
                    compressPercent.push([time,temp.percent]);
                }
            }
            yield put({
                type:"update",
                payload:{
                    compressPercent:compressPercent,
                    compressAfter:compressAfter,
                    compressBefore:compressBefore
                }
            })
        },

    },
    reducers:{
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}