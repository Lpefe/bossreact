import {get_device_list} from "../../services/CI/CI1101S";
import moment from 'moment';
import {chartColor} from "../../utils/commonConsts";

import {get_link, get_link_list, get_link_path, get_wan_info, update_device,get_wifi_config_file,get_wifi} from "../../services/Company/companyS";
import {
    get_days4g,
    get_interface,
    get_main_flow,
    get_multi_band,
    get_session_ct,
    get_system,
    get_tunnel_agent,
    get_wans,
    statistics,
    get_path_rtt,
    get_path_miss
} from "../../services/rate/rateS";
import {get_alarm_list, get_link_alarm_list} from "../../services/Alarm/alarmS";

export default {
    namespace: "mi0102Info",
    state: {
        wanInfo: [],
        deviceInfo: {},
        link_path: [],
        linkList: [],
        selectedLinkId: "",
        tunnelList: [],
        selectedTunnel: "",
        sysInfoDataSeries: [],
        selectedWan: "",
        selectedWanInfo: {},
        wanInfoDataSeries: {
            speed: [],
            rttMiss: [],
            getPost: []
        },
        tunnelInfoSeries: {
            speed: [],
            session: [],
            rttGet: [],
            tunnelStatus: [],
        },
        days4gSeries: [],
        wanTimeInterval: "0",
        timeInterval4G: "0",
        refreshType: "0",
        selectedTunnelBandwidth: 0,
        linkInfo: [],
        deviceList: [],
        agencyinfo: [],
        ifNoSystemData: false,
        hcpeSpeedSeries: [],
        hasHcpeSpeed: false,
        wifiFile:"",
        pathRtt:[],
        pathMiss:[]
    },
    effects: {
        * get_path_miss({payload}, {call, put}) {
            const missGetData = yield call(get_path_miss, payload);
            let arr = []
            for (let key in missGetData.data) {
            let getSeries = {
                name: missGetData.data[key].pathname,
                data: [],
                type: "line",
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                animation: false,
                lineStyle: {
                    color: chartColor[key]
                },
                itemStyle: {
                    color: chartColor[key]
                }
            };
            if (missGetData.msg === "ok") {
                
                    for(let keys in missGetData.data[key].pathinfo){

                        let time = moment.unix(missGetData.data[key].pathinfo[keys].time).format("YYYY-MM-DD HH:mm:ss");
                        let miss = missGetData.data[key].pathinfo[keys].miss
                        let name =  missGetData.data[key].pathinfo[keys].pathname
                        let tempGet = [time,miss,name];
                        getSeries.data.push(tempGet);
                    }
            }
            arr.push(getSeries);
        }

            yield put({
                type: "update",
                payload: {
                    pathMiss: arr
                }
            })
        },
        * get_path_rtt({payload}, {call, put}) {
            const rttGetData = yield call(get_path_rtt, payload);
            let rtt = []
            for (let key in rttGetData.data) {

            let getSeries = {
                name: rttGetData.data[key].pathname,
                data: [],
                type: "line",
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                animation: false,
                lineStyle: {
                    color: chartColor[key]
                },
                itemStyle: {
                    color: chartColor[key]
                }
            };
            if (rttGetData.msg === "ok") {
                    for(let keys in rttGetData.data[key].pathinfo){
                        let time = moment.unix(rttGetData.data[key].pathinfo[keys].time).format("YYYY-MM-DD HH:mm:ss");
                        let rtts = rttGetData.data[key].pathinfo[keys].rtt
                        let name = rttGetData.data[key].pathinfo[keys].pathname
                        
                        let tempGet = [time,rtts,name];
                        getSeries.data.push(tempGet);
                    }
                console.log(getSeries)
            }
            rtt.push(getSeries);
        }

            yield put({
                type: "update",
                payload: {
                    pathRtt: rtt
                }
            })
        },
        * update_device({payload}, {call,}) {
            yield call(update_device, payload)
        },
        * get_wan_info({payload}, {call, put}) {
            const backData = yield call(get_wan_info, payload);
            if (backData.success && backData.result) {
                for (let key in backData.result) {
                    const backData1 = yield call(get_interface, {
                        sn: payload.sn,
                        iface: backData.result[key].interface
                    });
                    if (backData1.msg === "ok") {
                        backData.result[key].upDownInfo = backData1.data
                    } else {
                        backData.result[key].upDownInfo = []
                    }
                }//get_wan_info接口获取所有wan口数据,遍历wan口数据,获取每个wan口的iface参数,再调用get_interface接口,获取每个wan口的up\down时间表,再把时间表数据拼入wanInfo,
            }
            yield put({
                type: "update",
                payload: {
                    wanInfo: backData.result,
                    selectedWan: backData.result[0] ? backData.result[0].id : "",
                    selectedWanInfo: backData.result[0] || {},
                }
            })
        },
        * get_device_list({payload}, {call, put}) {
            const backData = yield call(get_device_list, payload);
            yield put({
                type: "update",
                payload: {
                    deviceInfo: backData.result[0] || {}
                }
            })
        },
        //设备页面跳转进来获取链路信息以及隧道信息
        * get_link_list({payload}, {call, put}) {
            const backData = yield call(get_link_list, payload);
            let temp = [];
            try {
                temp = backData.result.map((item) => {
                    return {name: "tunnel_" + item.id, value: item.id, bandwidth: item.bandwidth}
                })
            } catch (e) {
                console.warn(e)
            }
            yield put({
                type: "update",
                payload: {
                    tunnelList: temp,
                    selectedTunnel: temp[0] ? temp[0].value : "",
                    selectedTunnelBandwidth: temp[0] ? temp[0].bandwidth : 0,
                    linkList: backData.result,
                    selectedLinkId: backData.result[0] ? backData.result[0].id : ""
                }
            });
            if (backData.result[0]) {
                const getLinkBackData = yield call(get_link, {id: backData.result[0] ? backData.result[0].id : ""});
                const linkPathData = yield call(get_link_path, {link_id: backData.result[0] ? backData.result[0].id : ""})
                yield put({
                    type: "update",
                    payload: {
                        linkInfo: [getLinkBackData.link_info],
                        deviceList: getLinkBackData.device_list,
                        agencyinfo: getLinkBackData.agency_list,
                        link_path: linkPathData.result
                    }
                })
            } else {
                yield put({
                    type: "update",
                    payload: {
                        linkInfo: [],
                        deviceList: [],
                        agencyinfo: [],
                        link_path: []
                    }
                })
            }
        },

        //链路页面跳转进来获取隧道信息
        * set_tunnel_info({payload}, {call, put}) {
            yield put({
                type: "update",
                payload: {
                    selectedTunnel: payload.id,
                    tunnelList: [{name: "tunnel_" + payload.id, value: payload.id}],
                }
            })
        },
        * handleSelectLink({payload}, {call, put}) {
            const getLinkBackData = yield call(get_link, {id: payload.link_id});
            yield put({
                type: "update",
                payload: {
                    linkInfo: [getLinkBackData.link_info],
                    deviceList: getLinkBackData.device_list,
                    agencyinfo: getLinkBackData.agency_list,
                    selectedLinkId: payload.link_id,
                }
            });
        },
        * changeTunnel({payload}, {call, put}) {
            yield put({
                type: "update",
                payload: {
                    selectedTunnel: payload.tunnel,
                    selectedTunnelBandwidth: payload.bandwidth
                }
            })
        },
        * changeWan({payload}, {call, put}) {
            yield put({
                type: "update",
                payload: {
                    selectedWan: payload.selectedWan,
                    selectedWanInfo: payload.selectedWanInfo
                }
            })
        },
        * get_system({payload}, {call, put}) {
            const backData = yield call(get_system, payload);
            const backData1 = yield call(get_alarm_list, payload);
            let sysInfoData = {};
            let sysInfoDataSeries = [];
            let tempSeries = {
                type: "line",
                step: "start",
                yAxisIndex: 1,
                name: "ONLINE-OFFLINE",
                data: [],
                showSymbol: false,
                animation: false,
                lineStyle: {
                    color: "#59D54F"
                },
                itemStyle: {
                    color: "#59D54F"
                }

            };
            if (backData.msg === "ok") {
                if (backData.data.length > 0) {
                    //构造sysInfo基本数据结构
                    for (let primKey in backData.data) {
                        for (let key in backData.data[primKey]) {
                            if (key === "cpus") {
                                for (let cpuKey in backData.data[primKey].cpus) {
                                    sysInfoData["cpu" + cpuKey] = {
                                        name: "cpu" + cpuKey,
                                        data: [],
                                        yAxisIndex: 0,
                                        smoothMonotone: "x",
                                        smooth: true,
                                        animation: false,

                                    }
                                }
                                continue;
                            } else if (key === "disk") {
                                if (backData.data[primKey].disk.length > 0) {
                                    for (let diskKey in backData.data[primKey].disk) {
                                        sysInfoData[backData.data[primKey].disk[diskKey].name] = {
                                            name: "磁盘-" + backData.data[primKey].disk[diskKey].name,
                                            data: [],
                                            yAxisIndex: 0,
                                            showSymbol: false,
                                            smoothMonotone: "x",
                                            smooth: true,
                                            animation: false
                                        }
                                    }

                                }
                                continue;
                            } else if (key === "time") {
                                continue;
                            }
                            sysInfoData[key] = {
                                name: key,
                                data: [],
                                yAxisIndex: 0,
                                smoothMonotone: "x",
                                smooth: true,
                                animation: false,
                            }
                        }
                    }

                    //push data into sysInfo
                    for (let key in backData.data) {
                        let time = moment.unix(backData.data[key].time).format("YYYY-MM-DD HH:mm:ss");
                        for (let subKey in backData.data[key]) {
                            switch (subKey) {
                                case "cpus":
                                    for (let cpuKey in backData.data[key].cpus) {
                                        if (sysInfoData["cpu" + cpuKey]) {
                                            sysInfoData["cpu" + cpuKey].data.push([time, backData.data[key].cpus[cpuKey]])
                                        }
                                    }
                                    break;
                                case "disk":
                                    if (backData.data[key].disk.length > 0) {
                                        for (let diskKey in backData.data[key].disk) {
                                            if (sysInfoData[backData.data[key].disk[diskKey].name]) {
                                                sysInfoData[backData.data[key].disk[diskKey].name].data.push([time, backData.data[key].disk[diskKey].usage])
                                            }
                                        }
                                    }
                                    break;
                                case "mem":
                                    sysInfoData.mem.data.push([time, backData.data[key].mem]);
                                    break;
                                default:
                                    break;
                            }
                        }
                    }

                    for (let key in sysInfoData) {
                        if (key.indexOf("cpu") > -1) {
                            let num = key.replace("cpu", "");
                            let name = "cpu" + (parseInt(num, 10) + 1);
                            sysInfoData[key].name = name
                        }
                        //if语句里面给每个cpu名称序号+1
                        let temp = sysInfoData[key];
                        temp.type = "line";
                        temp.showSymbol = false;
                        sysInfoDataSeries.push(temp);
                    }

                } else {
                    yield put({
                        type: "update",
                        payload: {
                            ifNoSystemData: true
                        }
                    })
                }
            }

            if (backData1.result.length > 0) {
                let dataSource = backData1.result;
                if (dataSource.length > 0) {
                    for (let key in dataSource) {
                        if (dataSource.length === 1) {
                            let isBefore = moment(dataSource[key].begin_time).isBefore(payload.start_tm);
                            if (isBefore) {
                                tempSeries.data.push([payload.start_tm, "OFFLINE"]);
                                if (dataSource[key].end_time === "") {
                                    tempSeries.data.push([payload.end_tm, "OFFLINE"]);
                                } else {
                                    tempSeries.data.push([dataSource[key].end_time, "ONLINE"]);
                                    tempSeries.data.push([payload.end_tm, "ONLINE"]);
                                }
                                continue;
                            } else {
                                tempSeries.data.push([payload.start_tm, "ONLINE"]);
                                tempSeries.data.push([dataSource[key].begin_time, "OFFLINE"]);
                                if (dataSource[key].end_time === "") {
                                    tempSeries.data.push([payload.end_tm, "OFFLINE"]);
                                } else {
                                    tempSeries.data.push([dataSource[key].end_time, "ONLINE"]);
                                    tempSeries.data.push([payload.end_tm, "ONLINE"]);
                                }
                                continue;
                            }
                        }//如果只有一个点的判断
                        if (key === "0") {
                            let isBefore = moment(dataSource[key].begin_time).isBefore(payload.begin_time);
                            if (isBefore) {
                                tempSeries.data.push([payload.begin_time, "OFFLINE"]);
                                tempSeries.data.push([dataSource[key].end_time, "ONLINE"]);
                                continue;
                            } else {
                                tempSeries.data.push([payload.begin_time, "ONLINE"]);
                                tempSeries.data.push([dataSource[key].begin_time, "OFFLINE"]);
                                tempSeries.data.push([dataSource[key].end_time, "ONLINE"]);
                                continue;
                            }
                        }//关于第一个点的开关判断
                        if (key === (dataSource.length - 1).toString()) {
                            if (dataSource[key].end_time === "") {
                                tempSeries.data.push([dataSource[key].begin_time, "OFFLINE"]);
                                tempSeries.data.push([payload.end_time, "OFFLINE"]);
                                continue;
                            } else {
                                tempSeries.data.push([dataSource[key].begin_time, "OFFLINE"]);
                                tempSeries.data.push([dataSource[key].end_time, "ONLINE"]);
                                tempSeries.data.push([payload.end_time, "ONLINE"]);
                                continue;
                            }
                        }//关于最后一个点的开关判断
                        tempSeries.data.push([dataSource[key].begin_time, "OFFLINE"]);
                        tempSeries.data.push([dataSource[key].end_time, "ONLINE"])
                    }
                }
            } else if (backData1.result.length === 0) {
                switch (backData1.flag) {
                    case "OFFLINE":
                        tempSeries.data.push([payload.start_tm, "OFFLINE"]);
                        tempSeries.data.push([payload.end_tm, "OFFLINE"]);
                        break;
                    case "ONLINE":
                        tempSeries.data.push([payload.start_tm, "ONLINE"]);
                        tempSeries.data.push([payload.end_tm, "ONLINE"]);
                        break;
                    case "no data":
                        break;
                    default:
                        break;
                }
            }
            sysInfoDataSeries.push(tempSeries);

            yield put({
                type: "update",
                payload: {
                    sysInfoDataSeries: sysInfoDataSeries,
                }
            })
        }
        ,

        * get_wans({payload}, {call, put}) {
            const backData = yield call(get_wans, payload);
            let wanInfoDataSeries = {
                speed: [],
                rttMiss: [],
                getPost: []
            };
            if (backData.msg === "ok") {
                let series_ratetx = {
                    type: "line",
                    data: [],
                    name: "上行带宽",
                    showSymbol: false,
                    smoothMonotone: "x",
                    smooth: true,
                    animation: false,
                    lineStyle: {
                        color: "#3B9FF7"
                    },
                    itemStyle: {
                        color: "#3B9FF7"
                    }

                };
                let series_raterx = {
                    type: "line",
                    data: [],
                    name: "下行带宽",
                    showSymbol: false,
                    smoothMonotone: "x",
                    smooth: true,
                    animation: false,
                    lineStyle: {
                        color: "#D396F5"
                    },
                    itemStyle: {
                        color: "#D396F5"
                    }

                };

                let series_rtt = {
                    type: "line",
                    data: [],
                    name: "网络延迟",
                    yAxisIndex: 0,
                    showSymbol: false,
                    smoothMonotone: "x",
                    smooth: true,
                    animation: false,
                    lineStyle: {
                        color: "#FF8D23"
                    },
                    itemStyle: {
                        color: "#FF8D23"
                    }

                };
                let series_miss = {
                    type: "line",
                    data: [],
                    name: "网络丢包",
                    yAxisIndex: 1,
                    showSymbol: false,
                    smoothMonotone: "x",
                    smooth: true,
                    animation: false,
                    lineStyle: {
                        color: "#BDA20A"
                    },
                    itemStyle: {
                        color: "#BDA20A"
                    }

                };
                let series_get = {
                    type: "line",
                    data: [],
                    name: "GET",
                    showSymbol: false,
                    smoothMonotone: "x",
                    smooth: true,
                    animation: false,
                    lineStyle: {
                        color: "#059CAD"
                    },
                    itemStyle: {
                        color: "#059CAD"
                    }

                };
                let series_post = {
                    type: "line",
                    data: [],
                    name: "POST",
                    showSymbol: false,
                    smoothMonotone: "x",
                    smooth: true,
                    animation: false,
                    lineStyle: {
                        color: "#89D7FF"
                    },
                    itemStyle: {
                        color: "#89D7FF"
                    }

                };
                if (backData.data.length > 0) {
                    for (let key in backData.data) {
                        let data = backData.data[key];
                        let time = moment.unix(backData.data[key].time).format("YYYY-MM-DD HH:mm:ss");
                        series_get.data.push([time, data.get]);
                        series_post.data.push([time, data.post]);
                        series_miss.data.push([time, data.miss]);
                        series_rtt.data.push([time, data.rtt]);
                        series_raterx.data.push([time, (data.raterx / 1024).toFixed(4)]);
                        series_ratetx.data.push([time, (data.ratetx / 1024).toFixed(4)]);
                    }
                }
                wanInfoDataSeries.speed.push(series_ratetx);
                wanInfoDataSeries.speed.push(series_raterx);
                wanInfoDataSeries.rttMiss.push(series_miss);
                wanInfoDataSeries.rttMiss.push(series_rtt);
                wanInfoDataSeries.getPost.push(series_get);
                wanInfoDataSeries.getPost.push(series_post);
            }
            yield put({
                type: "update",
                payload: {
                    wanInfoDataSeries: wanInfoDataSeries
                }
            })
        },
        //在页面从负载率跳转过来时,从url数据设定总带宽
        * set_tunnel_bandwidth({payload}, {call, put}) {
            yield put({
                type: "update",
                payload: {
                    selectedTunnelBandwidth: payload.bandwidth
                }
            })
        },
        * get_main_flow({payload}, {call, put}) {
            const backData = yield call(get_main_flow, payload);
            let hasHcpeSpeed = false;
            let speedSeries = [];
            let seriesTx = {
                name: "上行速率",
                data: [],
                type: "line",
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                animation: false,
                lineStyle: {
                    color: "#3B9FF7"
                },
                itemStyle: {
                    color: "#3B9FF7"
                }
            };
            let seriesRx = {
                name: "下行速率",
                data: [],
                type: "line",
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                animation: false,
                lineStyle: {
                    color: "#D396F5"
                },
                itemStyle: {
                    color: "#D396F5"
                }
            };
            if (backData.msg === "ok") {
                for (let key in backData.data) {
                    let data = backData.data[key];
                    let time = moment.unix(backData.data[key].time).format("YYYY-MM-DD HH:mm:ss");
                    seriesRx.data.push([time, (data.raterx * 8 / 1024).toFixed(4)]);
                    seriesTx.data.push([time, (data.ratetx * 8 / 1024).toFixed(4)]);
                }
                if (backData.data.length > 0) {
                    hasHcpeSpeed = true
                }
            }
            speedSeries.push(seriesRx);
            speedSeries.push(seriesTx);
            yield put({
                type: "update",
                payload: {
                    hcpeSpeedSeries: speedSeries,
                    hasHcpeSpeed: hasHcpeSpeed
                }
            })


        },
        * get_tunnel_data({payload}, {call, put, select}) {

            let tunnelInfoSeries = {
                speed: [],
                session: [],
                rttGet: [],
                tunnelStatus: [],
            };
            let tunnelStatusPayloadLink = {
                begin_time: payload.start_tm,
                end_time: payload.end_tm,
                link_id: payload.tid
            };
            //数据获取
            const sessionData = yield call(get_session_ct, payload);
            const rttGetData = yield call(get_tunnel_agent, payload);
            const rttData = yield call(statistics, Object.assign(payload, {item: "tunnel_rtt"}));

            let speedData;
            if (sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff") {
                speedData = yield call(statistics, {
                    item: "tunnel_rate",
                    top: 5,
                    tid: payload.tid,
                    start_tm: payload.start_tm,
                    end_tm: payload.end_tm,
                    companyid: payload.companyid
                })
            } else {
                speedData = yield call(get_multi_band, payload);
            }


            let tunnelStatusData = yield call(get_link_alarm_list, tunnelStatusPayloadLink);
            const bandwidth = yield select(state => state.mi0102Info.selectedTunnelBandwidth);
            //session series 构建
            let sessionSeries = {
                name: "session数量",
                data: [],
                type: "line",
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                animation: false,
                lineStyle: {
                    color: "#B4CECE"
                },
                itemStyle: {
                    color: "#B4CECE"
                }
            };
            if (sessionData.msg === "ok") {
                for (let key in sessionData.data) {
                    let temp = [moment.unix(sessionData.data[key].time).format("YYYY-MM-DD HH:mm:ss"), sessionData.data[key].counts]
                    sessionSeries.data.push(temp);
                }
            }
            tunnelInfoSeries.session.push(sessionSeries);

            //rttGet series 构建
            let rttSeries = {
                name: "网络延迟",
                data: [],
                type: "line",
                yAxisIndex: 0,
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                animation: false,
                lineStyle: {
                    color: "#FF8D23"
                },
                itemStyle: {
                    color: "#FF8D23"
                }

            };
            let getSeries = {
                name: "Get",
                data: [],
                type: "line",
                yAxisIndex: 1,
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                animation: false,
                lineStyle: {
                    color: "#059CAD"
                },
                itemStyle: {
                    color: "#059CAD"
                }
            };
            if (rttGetData.msg === "ok") {
                for (let key in rttGetData.data) {
                    let time = moment.unix(rttGetData.data[key].time).format("YYYY-MM-DD HH:mm:ss");
                    let tempGet = [time, rttGetData.data[key].get];
                    getSeries.data.push(tempGet);
                }
            }
            if (rttData.msg === "ok") {
                for (let key in rttData.data) {
                    let time = moment.unix(rttData.data[key].time).format("YYYY-MM-DD HH:mm:ss");
                    let tempRtt = [time, rttData.data[key].rtt];
                    rttSeries.data.push(tempRtt);
                }
            }
            tunnelInfoSeries.rttGet.push(rttSeries);
            if (sessionStorage.getItem("role") !== "company" && sessionStorage.getItem("role") !== "companystaff") {
                tunnelInfoSeries.rttGet.push(getSeries);
            }
            //speed series 构建
            let speedSeries = [];
            let bandWidthSeries = {
                name: "总带宽",
                data: [[payload.start_tm, bandwidth], [payload.end_tm, bandwidth]],
                type: "line",
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                animation: false,
                lineStyle: {
                    color: "#0375D9"
                },
                itemStyle: {
                    color: "#0375D9"
                }
            };
            speedSeries.push(bandWidthSeries);
            if (speedData.msg === "ok") {
                if (speedData.data.length > 0) {
                    if (sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff") {
                        let tempSeriesTx = {
                            name: "上行速率",
                            data: [],
                            type: "line",
                            showSymbol: false,
                            smoothMonotone: "x",
                            smooth: true,
                            animation: false,
                            lineStyle: {
                                color: "#3B9FF7"
                            },
                            itemStyle: {
                                color: "#3B9FF7"
                            }

                        };
                        let tempSeriesRx = {
                            name: "下行速率",
                            data: [],
                            type: "line",
                            showSymbol: false,
                            smoothMonotone: "x",
                            smooth: true,
                            animation: false,
                            lineStyle: {
                                color: "#D396F5"
                            },
                            itemStyle: {
                                color: "#D396F5"
                            }
                        };
                        for (let key in speedData.data) {
                            let time = moment.unix(speedData.data[key].time).format("YYYY-MM-DD HH:mm:ss");
                            if (speedData.data.length > 0) {
                                tempSeriesTx.data.push([time, (speedData.data[key].ratetx / 1024).toFixed(4)]);
                                tempSeriesRx.data.push([time, (speedData.data[key].raterx / 1024).toFixed(4)]);
                            }
                        }
                        speedSeries.push(tempSeriesTx);
                        speedSeries.push(tempSeriesRx);
                    }
                    else {
                        let dataSource = speedData.data;
                        let firstData = dataSource[0].bands;
                        let name = "";
                        for (let subKey in firstData) {
                            switch (firstData[subKey].nettype) {
                                case 1000:
                                    name = "总速率";
                                    break;
                                case 0:
                                    name = "MPLS";
                                    break;
                                case 1:
                                    name = "INTERNET";
                                    break;
                                case 2:
                                    name = "4G";
                                    break;
                                case 3:
                                    name = "INTERNET_PRIVIATE";
                                    break;
                                case 4:
                                    name = "4G_PRIVIATE";
                                    break;
                                default:
                                    name = "";
                                    break;
                            }
                            let tempSeriesTx = {
                                name: name + "上行",
                                data: [],
                                type: "line",
                                nettype: firstData[subKey].nettype,
                                showSymbol: false,
                                smoothMonotone: "x",
                                smooth: true,
                                animation: false
                            };
                            let tempSeriesRx = {
                                name: name + "下行",
                                data: [],
                                type: "line",
                                nettype: firstData[subKey].nettype,
                                showSymbol: false,
                                smoothMonotone: "x",
                                smooth: true,
                                animation: false
                            };
                            for (let key in dataSource) {
                                let tempData = dataSource[key].bands[subKey];
                                let time = moment.unix(dataSource[key].time).format("YYYY-MM-DD HH:mm:ss");
                                if (tempData) {
                                    tempSeriesTx.data.push([time, (tempData.ratetx / 1024).toFixed(4)]);
                                    tempSeriesRx.data.push([time, (tempData.raterx / 1024).toFixed(4)]);
                                }
                            }
                            speedSeries.push(tempSeriesTx);
                            speedSeries.push(tempSeriesRx);
                        }
                    }
                }
            }
            tunnelInfoSeries.speed = speedSeries;

            //tunnelStatus series 构建
            if (tunnelStatusData.result) {
                let dataSource = tunnelStatusData.result;
                let dataFlag = tunnelStatusData.flag;
                let tempSeries = {
                    type: "line",
                    step: "start",
                    name: "ONLINE-OFFLINE",
                    data: [],
                    showSymbol: false,
                    animation: false,
                    lineStyle: {
                        color: "#59D54F"
                    },
                    itemStyle: {
                        color: "#59D54F"
                    }
                };
                if (dataSource.length > 0) {
                    for (let key in dataSource) {
                        //如果只有一个点的判断
                        if (dataSource.length === 1) {
                            let isBefore = moment(dataSource[key].begin_time).isBefore(payload.start_tm);
                            if (isBefore) {
                                tempSeries.data.push([payload.start_tm, "OFFLINE"]);
                                if (dataSource[key].end_time === "") {
                                    tempSeries.data.push([payload.end_tm, "OFFLINE"]);
                                } else {
                                    tempSeries.data.push([dataSource[key].end_time, "ONLINE"]);
                                    tempSeries.data.push([payload.end_tm, "ONLINE"]);
                                }
                                continue;
                            } else {
                                tempSeries.data.push([payload.start_tm, "ONLINE"]);
                                tempSeries.data.push([dataSource[key].begin_time, "OFFLINE"]);
                                if (dataSource[key].end_time === "") {
                                    tempSeries.data.push([payload.end_tm, "OFFLINE"]);
                                } else {
                                    tempSeries.data.push([dataSource[key].end_time, "ONLINE"]);
                                    tempSeries.data.push([payload.end_tm, "ONLINE"]);
                                }
                                continue;
                            }
                        }

                        if (key === "0") {
                            let isBefore = moment(dataSource[key].begin_time).isBefore(payload.start_tm);
                            if (isBefore) {
                                tempSeries.data.push([payload.start_tm, "OFFLINE"]);
                                tempSeries.data.push([dataSource[key].end_time, "ONLINE"]);
                                continue;
                            } else {
                                tempSeries.data.push([payload.start_tm, "ONLINE"]);
                                tempSeries.data.push([dataSource[key].begin_time, "OFFLINE"]);
                                tempSeries.data.push([dataSource[key].end_time, "ONLINE"]);
                                continue;
                            }
                        }//关于第一个点的开关判断
                        if (key === (dataSource.length - 1).toString()) {
                            if (dataSource[key].end_time === "") {
                                tempSeries.data.push([dataSource[key].begin_time, "OFFLINE"]);
                                tempSeries.data.push([payload.end_tm, "OFFLINE"]);
                                continue;
                            } else {
                                tempSeries.data.push([dataSource[key].begin_time, "OFFLINE"]);
                                tempSeries.data.push([dataSource[key].end_time, "ONLINE"]);
                                tempSeries.data.push([payload.end_tm, "ONLINE"]);
                                continue;
                            }
                        }//关于最后一个点的开关判断
                        tempSeries.data.push([dataSource[key].begin_time, "OFFLINE"]);
                        tempSeries.data.push([dataSource[key].end_time, "ONLINE"])
                    }
                } else if (dataSource.length === 0) {
                    switch (dataFlag) {
                        case "OFFLINE":
                            tempSeries.data.push([payload.start_tm, "OFFLINE"]);
                            tempSeries.data.push([payload.end_tm, "OFFLINE"]);
                            break;
                        case "ONLINE":
                            tempSeries.data.push([payload.start_tm, "ONLINE"]);
                            tempSeries.data.push([payload.end_tm, "ONLINE"]);
                            break;
                        case "no data":
                            break;
                        default:
                            break;
                    }
                }
                tunnelInfoSeries.tunnelStatus = tempSeries;
            } else {
                tunnelInfoSeries = {
                    speed: [],
                    session: [],
                    rttGet: [],
                    tunnelStatus: [],
                }
            }//这里防止在进入下一个tunnel时,如果链路本身没有数据,就会显示上一条链路数据
            yield put({
                type: "update",
                payload: {
                    tunnelInfoSeries: tunnelInfoSeries,
                }
            })
        }
        ,
        * get_days4g({payload}, {call, put}) {
            const backData = yield call(get_days4g, payload);
            let days4gSeries = [{
                type: "line",
                data: [],
                name: "日流量",
                showSymbol: false,
                smoothMonotone: "x",
                smooth: true,
                animation: false,

            }];
            let monthTotal = 0;
            if (backData.msg === "ok") {
                for (let key in backData.data) {
                    let time = moment.unix(backData.data[key].time).format("YYYY-MM-DD");
                    let flow = backData.data[key].flow;
                    monthTotal += flow;
                    flow = (flow / 1024 / 1024).toFixed(2);
                    days4gSeries[0].data.push([time, flow])
                }
            }
            yield put({
                type: "update",
                payload: {
                    days4gSeries: days4gSeries,
                    monthTotal: (monthTotal / 1024 / 1024).toFixed(2)
                }
            })
        },
        * get_wifi_config_file({payload}, {call, put}) {
            const backData=yield call(get_wifi_config_file,payload);
            yield put({
                type:"update",
                payload:{
                    wifiFile:backData.result.replace(/\n/gm,"<br/>").replace(/\t/gm,"&emsp;&emsp;&emsp;&emsp;")
                }
            })
        },
        *get_wifi({payload},{call,put}){
            const backData=yield call(get_wifi,payload);
            yield put({
                type:"update",
                payload:{
                    wifiInfo:backData.result
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