/**
 * 客户-流量分析-设备流量
 * */
import React from 'react';
import './index.scss';
import {Button, Select, Input, Card} from 'antd';
import * as echarts from 'echarts'
import moment from "moment";
import {withRouter} from 'react-router-dom';
import {pieChartColor} from "../../../utils/commonConsts";
import {parse} from '../../../utils/commonUtilFunc';
import { injectIntl, FormattedMessage} from 'react-intl';
import CommonMessages from '../../../locales/commonMessages';
import messages from './LocaleMsg/messages';
const Option = Select.Option;

class CI0303 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chartWidth: (document.body.clientWidth > 1366 ? document.body.clientWidth - 320 : 1366 - 320),
            tunnel_dir: "2",
            start_tm: moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment().format("YYYY-MM-DD HH:mm:ss"),
            top: 5,
            name: "",
        };
        this.search = parse(this.props.location.search);
        this.ifCompany = (sessionStorage.getItem("role") === 'supercxpbusiness' || sessionStorage.getItem("role") === 'supercxptechnology' || sessionStorage.getItem("role") === 'supercxptechsupport' || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin")
    }

    componentDidMount() {
        let vm = this;
        this.get_steps_beta();
        this.element = echarts.init(document.getElementById('device-flow-container'));
        this.element.on('click', function (params) {
            let tunnel_dir;
            switch (vm.state.tunnel_dir) {
                case "2":
                    tunnel_dir = "全部";
                    break;
                case "1":
                    tunnel_dir = "隧道内流量";
                    break;
                case "0":
                    tunnel_dir = "隧道外流量";
                    break;
                default:
                    tunnel_dir = "";
                    break;
            }
            vm.props.history.push("/main/ci0303/ci0304?start_tm=" + vm.state.start_tm + "&end_tm=" + vm.state.end_tm + "&tunnel_dir=" + tunnel_dir + "&tunnel_dir_id=" + vm.state.tunnel_dir + "&device_name=" + params.data[3] + "&sn=" + params.data[2] + "&flow=" + params.data[0] + "&id=" + vm.search.id)
        });
        this.renderChart(this.element);
        window.addEventListener('resize', this.onWindowResize)
    }

    componentWillUnmount(){

    }

    componentDidUpdate() {
        this.renderChart(this.element)
    }

    handleInputChange = (e) => {
        this.setState({
            name: e.target.value
        }, () => {
            if (!this.state.name) {
                this.get_steps_beta();
            }
        })
    };


    //获取设备流量排行
    get_steps_beta = () => {
        this.props.dispatch({
            type: "ci0303Info/get_steps_beta",
            payload: {
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                companyid: this.ifCompany ? this.search.id : sessionStorage.getItem("companyId"),
                company_id: this.ifCompany ? this.search.id : sessionStorage.getItem("companyId"),
                tunnel_dir: this.state.tunnel_dir,
                top: this.state.top,
                name: this.state.name,
            }
        })
    };

    //选择隧道内或隧道外流量
    selectTunnelDir = (value) => {
        let vm = this;
        this.setState({
            tunnel_dir: value || "2"
        }, function () {
            vm.get_steps_beta();
        })
    };

    //选择时间间隔
    selectTimeInterval = (type) => {
        let vm = this;
        let start_tm = "";
        let end_tm = moment().format("YYYY-MM-DD HH:mm:ss");
        switch (type) {
            case "0":
                start_tm = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "1":
                start_tm = moment().subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "2":
                start_tm = moment().subtract(24, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "3":
                start_tm = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                start_tm = moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
        }
        this.setState({
            start_tm: start_tm,
            end_tm: end_tm,
        }, function () {
            vm.get_steps_beta();
        })
    };

    //选择数据条数
    selectDataNum = (value) => {
        let vm = this;
        this.setState({
            top: value || "0"
        }, function () {
            vm.get_steps_beta();
        })
    };

    //绘制图表
    renderChart = (el) => {
        let option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '0',
                right: '6%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisTick: {show: false},
                name: "MB",
                splitLine: {
                    lineStyle: {
                        type: "dashed"
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: "rgba(0,0,0,0.45)"
                    }
                },

            },
            yAxis: {
                type: 'category',
                axisLabel: {
                    interval: 0,
                    formatter: function (params) {
                        let newParamsName = "";
                        let paramsNameNumber = params.length;
                        let provideNumber = 8;
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
                    },
                    align: "left",
                    margin: 100,

                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        type: "dashed",
                        color: "rgba(0,0,0,0.45)"
                    }
                }
            },
            series: [
                {
                    name: '流量',
                    type: 'bar',
                    data: this.props.ci0303Info.steps_beta_flow,
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                return pieChartColor[params.dataIndex % pieChartColor.length]
                            }
                        },
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'right'
                        }
                    },
                    barCategoryGap: "60%",
                    barMinHeight: "10",
                    barMaxWidth:32
                },
            ],
            color: ["red", "yellow"]
        };
        el.setOption(option);
        el.resize({width: this.state.chartWidth, height: 720})
    };

    //在窗口拉伸时自适应
    onWindowResize = () => {
        this.setState({
            chartWidth: (document.body.clientWidth > 1366 ? document.body.clientWidth - 320 : 1366 - 320)
        })
    };


    render() {
        const __ = this.props.intl.formatMessage;
        return (
            <div>
                <Card className="card">
                    <header>
                        <Select placeholder="请选择时间间隔" style={{width: 200, marginRight: 8}} className="input"
                                onChange={this.selectTimeInterval} defaultValue="0">
                            <Option value="0"><FormattedMessage {...CommonMessages.timeIntervalHalfHour}/></Option>
                            <Option value="1"><FormattedMessage {...CommonMessages.timeIntervalSixHour}/></Option>
                            <Option value="2"><FormattedMessage {...CommonMessages.timeInterval24Hour}/></Option>
                            <Option value="3"><FormattedMessage {...CommonMessages.timeIntervalOneWeek}/></Option>
                        </Select>
                        <Select placeholder="请选择数据条数" style={{width: 120, marginRight: 8}} className="input"
                                onChange={this.selectDataNum} defaultValue="5">
                            <Option value="5">5{__(messages['条'])}</Option> 
                            <Option value="10">10{__(messages['条'])}</Option>
                            <Option value="15">15{__(messages['条'])}</Option>
                            <Option value="20">20{__(messages['条'])}</Option>
                        </Select>
                        <Select placeholder="请选择流量类型" style={{width: 120, marginRight: 8}} className="input"
                                onChange={this.selectTunnelDir} defaultValue="2">
                            <Option value="2">{__(CommonMessages.all)}</Option>
                            <Option value="1">{__(CommonMessages.inTunnelFlow)}</Option>
                            <Option value="0">{__(CommonMessages.outTunnelFlow)}</Option>
                        </Select>
                        <Input placeholder={__(CommonMessages.searchInputPlaceHolder)} style={{width: 240, marginRight: 8}} className="input"
                               onChange={this.handleInputChange}/>
                        <Button onClick={this.get_steps_beta}>{__(CommonMessages.search)}</Button>
                    </header>
                    <div id="device-flow-container" style={{height: 720, width: this.state.tableWidth}}>

                    </div>
                </Card>
            </div>
        )
    }
}

export default withRouter(injectIntl(CI0303));