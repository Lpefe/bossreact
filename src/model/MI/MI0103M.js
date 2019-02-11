import {get_tunnel_port} from "../../services/Company/companyS";
import {sshDomain} from "../../utils/commonConsts";
function initGateone(port){
    window.GateOne.init({
        url: sshDomain,
        autoConnectURL: 'ssh://root@127.0.0.1:'+port,
        showToolbar: true,
        goDiv: '#gateone',
        auth: 'none'
    });
}
export default {
    namespace: "mi0103Info",
    state: {
        url: ""
    },
    effects: {
        * get_tunnel_port({payload}, {call}) {
            const backData=yield call(get_tunnel_port,payload,"控制台启动中");
            yield call(initGateone,backData.port);
        }
    },
    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    }
}