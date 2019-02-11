import moment from 'moment';
import {get_multi_band, get_rtt_data} from "../../services/rate/rateS";

export default {
    namespace: "ci0203Info",
    state: {
        multiBandData: [],
        rttData: []
    },
    effects: {
        * get_multi_band({payload}, {call, put}) {
            const backData = yield call(get_multi_band, payload);
            let speedSeries = [];
            if (backData.msg === "ok" ) {
                if (backData.data.length > 0) {
                    let dataSource = backData.data;
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
                                name = "PRIV";
                                break;
                            case 2:
                                name = "INTER";
                                break;
                            case 3:
                                name = "4G";
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
                        };
                        let tempSeriesRx = {
                            name: name + "下行",
                            data: [],
                            type: "line",
                            nettype: firstData[subKey].nettype,
                            showSymbol: false,
                            smoothMonotone: "x",
                            smooth: true,
                        };
                        for (let key in dataSource) {
                            let tempData = dataSource[key].bands[subKey];
                            let time = moment.unix(dataSource[key].time).format("YYYY-MM-DD HH:mm:ss");
                            tempSeriesTx.data.push([time, (tempData.ratetx / 1024).toFixed(4)]);
                            tempSeriesRx.data.push([time, (tempData.raterx / 1024).toFixed(4)]);
                        }
                        speedSeries.push(tempSeriesTx);
                        speedSeries.push(tempSeriesRx);
                    }

                    yield put({
                        type: "update",
                        payload: {
                            multiBandData: speedSeries
                        }
                    })
                }
            }

        },
        * get_rtt_data({payload}, {call, put}) {
            const backData = yield call(get_rtt_data, payload);
            let dataSource = [{type: 'line', name: "RTT", data: [],smooth:true,showSymbol: false,
                smoothMonotone:"x"}];
            for (let key in backData.data) {
                dataSource[0].data.push([moment.unix(backData.data[key].time).format("YYYY-MM-DD HH:mm:ss"), (backData.data[key].rtt)])
            }
            yield put({
                type: "update",
                payload: {
                    rttData: dataSource
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