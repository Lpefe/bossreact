import {get_contract_list} from "../../services/Company/companyS";


export default {
    namespace: "bi0201Info",
    state:{
        contractList:[]
    },
    effects:{
       *get_contract_list({payload},{call,put}){
           const backData=yield call(get_contract_list,payload);
           yield put({
               type:"update",
               payload:{
                   contractList:backData.result
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