import {get_bandwidth_stat, get_agency_stat, get_city_stat} from "../../services/CI/CI0801S";
import {get_device_stat, get_link_stat, get_redis_alarm_stat} from "../../services/Company/companyS";
import messages from '../../components/CI/CI0801/LocaleMsg/message';
 export default {
    namespace: "ci0801Info",
    state: {
        bandwidthStat: {},
        bandwidthTotal: 0,
        linkStat: {
            data:[],
            legend:[]
        },
        deviceStat: {
            data:[],
            legend:[]
        },
        agencyStat: [],
        nodeData: [],
        linkDataInit: [],
        linkDataOnline: [],
        linkDataOffline: [],
        linkSum:0,
        deviceSum:0,
        agencySum:0,
        alarmStat:{
            device:{},
            link:{}
        },
        ifDomestic:true,
    },
    effects: {
        * get_stat({payload}, {call, put}) {
            const backData1 = yield call(get_bandwidth_stat, payload);
            const backData2 = yield call(get_device_stat, payload);
            const backData3 = yield call(get_link_stat, payload);
            const backData4 = yield call(get_agency_stat, payload);
            let pieData2 = {data: [], legend: []};
            let pieData3 = {data: [], legend: []};
            let pieData4 = {data: [], legend: []};
            let linkSum=0;
            let deviceSum=0;
            let agencySum=0;
            for (let key in backData2) {
                switch (key) {
                    case "OFFLINE":
                        pieData2.data.push({value: backData2[key], name: key,});
                        deviceSum+=backData2[key]
                        break;
                    case "ONLINE":
                        pieData2.data.push({value: backData2[key], name: key,});
                        deviceSum+=backData2[key]
                        break;
                    case "INIT":
                        pieData2.data.push({value: backData2[key], name: key, });
                        deviceSum+=backData2[key]
                        break;
                    default:
                        break;
                }
                pieData2.legend.push(key);
            }
            if(!pieData2.data.length){
                pieData2.data.push({name:"暂无数据",value:"1"})
            }
            for (let key in backData3) {
                switch (key) {
                    case "OFFLINE":
                        pieData3.data.push({value: backData3[key], name: key, });
                        linkSum+=backData3[key]
                        break;
                    case "ONLINE":
                        pieData3.data.push({value: backData3[key], name: key, });
                        linkSum+=backData3[key]
                        break;
                    case "INIT":
                        pieData3.data.push({value: backData3[key], name: key,});
                        linkSum+=backData3[key]
                        break;
                    default:
                        break;
                }
                pieData3.legend.push(key);
            }
            if(!pieData3.data.length){
                pieData3.data.push({name:"暂无数据",value:"1"})
            }
            for (let key in backData4) {
                switch (key) {
                    case "STEP":
                        pieData4.data.push({value: backData4[key], name: "边缘节点", });
                        pieData4.legend.push("边缘节点");
                        agencySum+=backData4[key];
                        break;
                    case "CSTEP":
                        pieData4.data.push({value: backData4[key], name: "中心节点", });
                        pieData4.legend.push("中心节点");
                        agencySum+=backData4[key];
                        break;
                    default:
                        break;
                }

            }
            yield put({
                type: "update",
                payload: {
                    bandwidthStat: backData1,
                    bandwidthTotal: (backData1["国内组网"] || 0) + (backData1["全球组网"] || 0) + (backData1["全球SaaS加速"] || 0)+(backData1["国内SaaS加速"] || 0),
                    linkStat: pieData3,
                    deviceStat: pieData2,
                    agencyStat: pieData4,
                    linkSum:linkSum,
                    deviceSum:deviceSum,
                    agencySum:agencySum

                }
            })
        },
        * get_city_stat({payload}, {call, put}) {
            const __=payload.__;
            const backData = yield call(get_city_stat, payload);
            let nodeData = [];
            let linkDataInit = [];
            let linkDataOnline = [];
            let linkDataOffline = [];
            if (backData.city_result) {
                for (let key in backData.city_result) {
                    let node = {};
                    let data = backData.city_result[key];
                    node.name = data.name;
                    node.value = [data.log, data.lat];
                    node.itemStyle = {
                        normal: {
                            color: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.5,
                                colorStops: [{
                                    offset: 0, color: '#0471FF'
                                }, {
                                    offset: 0.5, color: '#fff'
                                }, {
                                    offset: 0.8, color: '#0471FF'
                                }],
                            }
                        }
                    };
                    node.tooltip = {
                        formatter: function () {
                            let edge = "";
                            let center = "";
                            let links = "";
                            if (data.edge) {
                                if(data.center||data.links){
                                    edge = '<table class="map-tooltip-table"><tr><th class="title">'+__(messages['边缘节点'])+'</th><th class="count">'+__(messages["数量"])+'</th></tr><tr><td><li class="OFFLINE">OFFLINE</li></td><td class="num">' + data.edge.OFFLINE + '</td></tr><td><li class="INIT">INIT</li></td><td class="num">' + data.edge.INIT + '</td></tr><td><li class="ONLINE">ONLINE</li></td><td class="num">' + data.edge.ONLINE + '</td></tr><table/>';
                                }else{
                                    edge = '<table class="map-tooltip-table" style="border-bottom: none"><tr><th class="title">'+__(messages["边缘节点"])+'</th><th class="count">'+__(messages["数量"])+'</th></tr><tr><td><li class="OFFLINE">OFFLINE</li></td><td class="num">' + data.edge.OFFLINE + '</td></tr><td><li class="INIT">INIT</li></td><td class="num">' + data.edge.INIT + '</td></tr><td><li class="ONLINE">ONLINE</li></td><td class="num">' + data.edge.ONLINE + '</td></tr><table/>';
                                }
                            }
                            if (data.center) {
                                if(data.links){
                                    center = '<table class="map-tooltip-table"><tr><th class="title">'+__(messages["中心节点"])+'</th><th class="count">'+__(messages["数量"])+'</th></tr><tr><td><li class="OFFLINE">OFFLINE</li></td><td class="num">' + data.center.OFFLINE + '</td></tr><td><li class="INIT">INIT</li></td><td class="num">' + data.center.INIT + '</td></tr><td><li class="ONLINE">ONLINE</li></td><td class="num">' + data.center.ONLINE + '</td></tr><table/>';
                                }else{
                                    center = '<table class="map-tooltip-table" style="border-bottom: none"><tr><th class="title">'+__(messages["中心节点"])+'</th><th class="count">'+__(messages["数量"])+'</th></tr><tr><td><li class="OFFLINE">OFFLINE</li></td><td class="num">' + data.center.OFFLINE + '</td></tr><td><li class="INIT">INIT</li></td><td class="num">' + data.center.INIT + '</td></tr><td><li class="ONLINE">ONLINE</li></td><td class="num">' + data.center.ONLINE + '</td></tr><table/>';
                                }
                            }
                            if (data.links) {
                                links = '<table class="map-tooltip-table" style="border-bottom: none"><tr><th class="title">'+__(messages["链路信息"])+'</th><th class="count">'+__(messages["数量"])+'</th></tr><tr><td><li class="OFFLINE">OFFLINE</li></td><td class="num">' + data.links.OFFLINE + '</td></tr><td><li class="INIT">INIT</li></td><td class="num">' + data.links.INIT + '</td></tr><td><li class="ONLINE">ONLINE</li></td><td class="num">' + data.links.ONLINE + '</td></tr><table/>';
                            }

                            return '<div class="map-tooltip">' + edge + center + links + '</div>'
                        },
                        backgroundColor: "#fff",
                        extraCssText: 'box-shadow: 0 2px 2px 0 rgba(24,24,24,0.60);border-radius: 2px 2px 0 0 0 2px 2px;z-index:9999',
                        position:"right"
                    };
                    nodeData.push(node);
                }
            }

            if (backData.link_result) {
                for (let key in backData.link_result) {
                    let link = {};
                    let data = backData.link_result[key];
                    link.coords = data.city_coord_pair;
                    link.tooltip = {
                        formatter: function () {
                            let links = '<table class="map-tooltip-table" style="border-bottom: none"><tr><th class="title">'+__(messages["链路状态"])+'</th><th class="count">'+__(messages["数量"])+'</th></tr><tr><td><li class="OFFLINE">OFFLINE</li></td><td class="num">' + data.OFFLINE + '</td></tr><td><li class="INIT">INIT</li></td><td class="num">' + data.INIT + '</td></tr><td><li class="ONLINE">ONLINE</li></td><td class="num">' + data.ONLINE + '</td></tr><table/>';
                            return '<div class="map-tooltip">' + links + '</div>'
                        },
                        backgroundColor: "#fff",
                        extraCssText: 'box-shadow: 0 2px 2px 0 rgba(24,24,24,0.60);border-radius: 2px 2px 0 0 0 2px 2px;z-index:9999',
                        position:"right"
                    };
                    if (data.INIT !== 0) {
                        linkDataInit.push(link);
                    }
                    if (data.ONLINE !== 0) {
                        linkDataOnline.push(link);
                    }
                    if (data.OFFLINE !== 0) {
                        linkDataOffline.push(link);
                    }
                }
            }
            yield put({
                type: "update",
                payload: {
                    nodeData: nodeData,
                    linkDataOffline: linkDataOffline,
                    linkDataOnline: linkDataOnline,
                    linkDataInit: linkDataInit,
                    ifDomestic:backData.is_domestic
                }
            })

        },
        *get_redis_alarm_stat({payload},{call,put}){
            const backData=yield call(get_redis_alarm_stat,payload);
            yield put({
                type:"update",
                payload:{
                    alarmStat: backData
                }
            })
        },
        *changeMapView({payload},{call,put}){
            yield put({
                type:"update",
                payload:{
                    ifDomestic:payload.ifDomestic
                }
            })
        }
    },

    reducers: {
        update(state, action) {
            return {...state, ...action.payload};
        },
    },
}