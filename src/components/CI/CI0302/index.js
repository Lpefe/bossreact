import React from 'react';
import './index.scss';
import { Select, Tabs,Card} from 'antd';
import * as echarts from 'echarts'
import moment from "moment";
import AgencyFlowStat from "./subComponents/AgencyFlowStat";
import AppFlowStat from "./subComponents/AppFlowStat";
import CustomAppFlowStat from "./subComponents/CustomAppFlowStat";
import {parse} from "../../../utils/commonUtilFunc";
import {chartColor} from "../../../utils/commonConsts";
import CommonMessages from '../../../locales/commonMessages';
import {injectIntl,FormattedMessage} from "react-intl";
import messages from './LocaleMsg/messages';
const Option = Select.Option;
const TabPane = Tabs.TabPane;


class CI0302 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start_tm: moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment().format("YYYY-MM-DD HH:mm:ss"),
            timeInterval: "",
            data_num: 5,
            appName: "",
        };
        let companyid = "";
        if (parse(this.props.location.search).id) {
            companyid = parse(this.props.location.search).id
        } else {
            companyid = sessionStorage.getItem("companyId")
        }
        this.companyid = companyid;
    }

    componentDidMount() {
        this.histogramElA = echarts.init(document.getElementById("chartA"));
        this.getDataA();
        this.getDataB();
        this.getDataC();
    }

    componentDidUpdate() {
        const __=this.props.intl.formatMessage;
        this.renderHistogramA(this.histogramElA, __(messages['应用名称'])); 
    }

    getDataA(){
        this.props.dispatch({
            type: "ci0302Info/getStatisticsA",
            payload: {
                item: "apprank",
                companyid:  this.companyid,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.data_num,
                counts:100
            }
        })
    }

    getDataB() {
        this.props.dispatch({
            type: "ci0302Info/getStatisticsB",
            payload: {
                item: "steps",
                companyid: this.companyid,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.data_num,
                counts:100
            }
        })
    }

    getDataC() {
        this.props.dispatch({
            type: "ci0302Info/getStatisticsC",
            payload: {
                item: "apprank",
                companyid:  this.companyid,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.data_num,
                defined: true,
                counts:100
            }
        })
    }

    renderHistogramA(el, yName) {
        let histogram = el;
        let option = {
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                name: "MB",
                axisTick:{show:false},
                splitLine:{
                    show:false
                },
                axisLine:{
                    lineStyle: {
                        color:"rgba(0,0,0,0.45)"
                    }
                },

            },
            yAxis: {
                type: 'category',
                data: this.props.ci0302Info.yNameA,
                name: yName,
                axisLabel: {
                    fontSize: 14,
                    align: "right",
                    formatter: function (params) {
                        let newParamsName = "";
                        let paramsNameNumber = params.length;
                        let provideNumber = 6;
                        let rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                        if (paramsNameNumber > provideNumber) {
                            for (let p = 0; p < rowNumber; p++) {
                                let tempStr = "";
                                let start = p * provideNumber;
                                let end = start + provideNumber;
                                if (p === rowNumber - 1) {
                                    tempStr = params.substring(start, paramsNameNumber);
                                } else {
                                    tempStr = params.substring(start, end) + "\n";
                                }
                                newParamsName += tempStr;
                            }
                        } else {
                            newParamsName = params;
                        }
                        return newParamsName
                    }
                },axisLine:{show:false},axisTick:{show:false}
            },
            grid: {
                x: 120
            },
            series: [
                {
                    type: 'bar',
                    data: this.props.ci0302Info.xDataA,
                    barMinHeight: 10,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                return chartColor[params.dataIndex % chartColor.length]
                            }
                        },
                        emphasis: {
                            color: "#5D9AE6",
                            label: {
                                color: "#5D9AE6"
                            }
                        }
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right',
                            formatter: '{c} MB',
                            color: "#E4E4E4"
                        },
                    },
                },]
        };
        histogram.setOption(option);
    }


    selectTimeIntervalA = (value) => {
        let vm=this;
        let start_tm_temp = "";
        let end_tm_temp = moment().format("YYYY-MM-DD HH:mm:ss");
        switch (value) {
            case "0":
                start_tm_temp = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "1":
                start_tm_temp = moment().subtract(6, "hours").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "2":
                start_tm_temp = moment().subtract(24, "hours").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "3":
                start_tm_temp = moment().subtract(7, "days").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "4":
                start_tm_temp = moment().subtract(1, "months").format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                start_tm_temp = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
        }
        this.setState({
            start_tm: start_tm_temp,
            end_tm: end_tm_temp,
        }, function () {
            vm.getDataA();
            vm.getDataB();
            vm.getDataC();
        });
    };

    selectTimeRangeA = (dateValue) => {
        let vm=this;
        this.setState({
            start_tm: dateValue[0].format("YYYY-MM-DD HH:mm:ss"),
            end_tm: dateValue[1].format("YYYY-MM-DD HH:mm:ss"),
        }, function () {
            vm.getDataA();
            vm.getDataB();
            vm.getDataC();
        });
    };

    selectDataNumA = (value) => {
        let vm=this;
        this.setState({
            data_num: value
        }, function () {
            vm.getDataA();
            vm.getDataB();
            vm.getDataC();
        });
    };


    render() {
        const __=this.props.intl.formatMessage;
        return (
            <Card className="card">
                <header style={{marginBottom:16}}>
                    <Select placeholder="请选择时间间隔" style={{width: 200, marginRight: 8}} className="input"
                            onChange={this.selectTimeIntervalA} defaultValue="0">
                        <Option value="0"><FormattedMessage {...CommonMessages.timeIntervalHalfHour}/></Option>
                        <Option value="1"><FormattedMessage {...CommonMessages.timeIntervalSixHour}/></Option>
                        <Option value="2"><FormattedMessage {...CommonMessages.timeInterval24Hour}/></Option>
                        <Option value="3"><FormattedMessage {...CommonMessages.timeIntervalOneWeek}/></Option>
                    </Select>
                    <Select placeholder="请选择数据条数" style={{width: 120, marginRight: 8}} className="input"
                            onChange={this.selectDataNumA} defaultValue="5">
                        <Option value="5">5{__(messages['条'])}</Option>
                        <Option value="10">10{__(messages['条'])}</Option>
                        <Option value="15">15{__(messages['条'])}</Option>
                        <Option value="20">20{__(messages['条'])}</Option>
                    </Select>
                </header>
                <section>
                    <Tabs defaultActiveKey="1" onChange={this.tabChange}>
                        <TabPane tab={__(messages['应用程序流量分析'])} key="1">
                            <AppFlowStat start_tm={this.state.start_tm} end_tm={this.state.end_tm}
                                         data_num={this.state.data_num} companyid={this.companyid}/>
                        </TabPane>
                        <TabPane tab={__(messages['边缘节点流量分析'])} key="2">
                            <AgencyFlowStat start_tm={this.state.start_tm} end_tm={this.state.end_tm}
                                            data_num={this.state.data_num} companyid={this.companyid}/>
                        </TabPane>
                        <TabPane tab={__(messages['自定义应用程序'])} key="3">
                            <CustomAppFlowStat start_tm={this.state.start_tm} end_tm={this.state.end_tm}
                                               data_num={this.state.data_num} companyid={this.companyid}/>
                        </TabPane>
                    </Tabs>
                </section>
            </Card>
        )
    }
}

export default injectIntl(CI0302);