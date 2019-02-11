import React from 'react';
import {Select, Icon, Modal,Card} from 'antd';
import BossTable from "../../Common/BossTable";
import {commonTranslate, parse} from '../../../utils/commonUtilFunc';
import moment from 'moment';
import BossLineChart from "../../Common/Charts/Line/BossLineChart";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
const Option = Select.Option;

class MI1202 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top: "5",
            chartModalShow: false,
            start_tm: moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment().format("YYYY-MM-DD HH:mm:ss"),
            appName:"",
            modalStartTm:moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            modalEndTm:moment().format("YYYY-MM-DD HH:mm:ss"),
            selectedDstIp:"",
            selectedDstPort:"",
            selectedProtocol:""
        }
    }

    componentDidMount() {
        this.get_compress_rank();
    }

    get_compress_rank = () => {
        this.props.dispatch({
            type: "mi1201Info/get_compress_rank",
            payload: {
                companyid: parse(this.props.location.search).id,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                top: this.state.top
            }
        })
    };

    get_compress=()=>{
        this.props.dispatch({
            type:"mi1201Info/get_compress",
            payload:{
                companyid: parse(this.props.location.search).id,
                start_tm:this.state.modalStartTm,
                end_tm:this.state.modalEndTm,
                dst_port:this.state.selectedDstPort,
                dst_ip:this.state.selectedDstIp,
                protocol:this.state.selectedProtocol,
            }
        })
    };
    selectTop = (value) => {
        let vm=this;
        this.setState({
            top: value
        }, function () {
            vm.get_compress_rank();
        })
    };

    selectTimeInterval = (type) => {
        let vm=this;
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
            case "4":
                start_tm = moment().subtract(1, 'months').format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                start_tm = moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
        }
        this.setState({
            start_tm: start_tm,
            end_tm: end_tm,
        }, function () {
            vm.get_compress_rank();
        })
    };

    selectModalTimeInterval=(value)=>{
        let vm=this;
        let start_tm = "";
        let end_tm = moment().format("YYYY-MM-DD HH:mm:ss");
        switch (value) {
            case "0":
                start_tm = moment().subtract(30, "minutes").format("YYYY-MM-DD HH:mm:ss");
                break;
            case "1":
                start_tm = moment().subtract(6, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "2":
                start_tm = moment().subtract(24, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                start_tm = moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
        }
        this.setState({
            modalStartTm: start_tm,
            modalEndTm: end_tm,
        }, function () {
            vm.get_compress();
        })
    };

    handleChartModalShow = (record) => {
        let vm=this;
        this.setState({
            chartModalShow: true,
            appName: record.name,
            selectedDstIp:record.dst_ip,
            selectedDstPort:record.dst_port,
            selectedProtocol:record.protocol
        }, function () {
            vm.get_compress();
        })
    };

    handleCancelModal=()=>{
        this.setState({
            chartModalShow: false,
            appName: "",
            modalStartTm:moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            modalEndTm:moment().format("YYYY-MM-DD HH:mm:ss"),
        })
    };


    render() {
        const __=commonTranslate(this);
        const option = [
            <Option value="5" key="5">5{__(messages["条"])}</Option>,
            <Option value="10" key="10">10{__(messages["条"])}</Option>,
            <Option value="20" key="20">20{__(messages["条"])}</Option>,
            <Option value="50" key="50">50{__(messages["条"])}</Option>,
            <Option value="100" key="100">100{__(messages["条"])}</Option>,
        ];

        const columns = [{
            title: __(messages['应用名称']),
            dataIndex: 'name',
            key: 'name',

        }, {
            title: __(messages['目标地址']),
            dataIndex: 'dst_ip',
            key: 'dst_ip',
        }, {
            title: __(messages['目标端口']),
            dataIndex: 'dst_port',
            key: 'dst_port',
        }, {
            title: __(messages['协议']),
            dataIndex: 'protocol',
            key: 'protocol',
        }, {
            title: __(messages['压缩前流量(M)']),
            dataIndex: 'before',
            key: 'before',
            render:(index,record)=>{
                return (record.before/1024/1024).toFixed(4)
            }
        }, {
            title: __(messages['压缩率(%)']),
            dataIndex: 'percent',
            key: 'percent',
        }, {
            title: __(messages['压缩后流量(M)']),
            dataIndex: 'after',
            key: 'after',
            render:(index,record)=>{
                return (record.after/1024/1024).toFixed(4)
            }
        }, {
            title: __(messages['压缩节省流量(M)']),
            dataIndex: 'save',
            key: 'save',
            render:(index,record)=>{
                return ((record.before-record.after)/1024/1024).toFixed(4)
            }
        }, {
            title: __(messages['历史流量']),
            dataIndex: 'historyFlow',
            key: 'historyFlow',
            align: "center",
            render: (text, record) => {
                return <Icon type="dot-chart" onClick={() => this.handleChartModalShow(record)}/>
            }
        },];

        const chartOptions = {
            id:"compressChart",
            containerWidth: 700,
            containerHeight: 500,
            option: {
                tooltip: {
                    trigger: 'axis',
                    backgroundColor: "#fff",
                    formatter: function (data) {
                        let res = "";
                        for (let i = 0; i < data.length; i++) {
                            res += ('<li class="trigger-item" style="color:' + data[i].color + '"><span class="app-item">' + data[i].seriesName + '</span><span class="flow-item">' + data[i].data[1] + '</span></li>')
                        }
                        return '<div class="trigger-container"><div class="content"><li class="trigger-item" style="color:#000;list-style: none"><span class="app-item">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日期</span><span class="flow-item">' + moment(data[0].axisValue).format("YYYY-MM-DD HH:mm:ss") + '</span></li>' + res + '</div></div>'
                    }
                },
                grid: {
                    left: '5%',
                    right: '5%',
                    bottom: '20%',
                },
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    min: this.state.modalStartTm,
                    max: this.state.modalEndTm,
                    axisTick:{show:false},
                    splitLine:{
                        show:false
                    },
                    axisLine:{
                        lineStyle: {
                            color:"rgba(0,0,0,0.45)"
                        }
                    }
                },
                legend: {
                    left: "center",
                    bottom: 0,
                },
                yAxis: [
                    {type: 'value', name: __(messages["流量(MB)"]),axisLine:{show:false},axisTick:{show:false}},
                    {type: 'value', name: __(messages["去重率(%)"]), max: 100,axisLine:{show:false},axisTick:{show:false}}],
                series: [
                    {
                        name: __(messages['压缩前流量(MB)']),
                        type: 'line',
                        yAxisIndex: 0,
                        data: this.props.mi1201Info.compressBefore,
                        lineStyle: {
                            normal: {
                                color: '#EB1A1A',
                            }
                        },
                        smoothMonotone: "x",
                        smooth: true,
                        showSymbol:false,
                    },
                    {
                        name: __(messages['压缩后流量(MB)']),
                        type: 'line',
                        yAxisIndex: 0,
                        data: this.props.mi1201Info.compressAfter,
                        lineStyle: {
                            normal: {
                                color: '#27BB28 ',
                            }
                        },
                        smoothMonotone: "x",
                        smooth: true,
                        showSymbol:false,
                    },
                    {
                        name: __(messages['压缩率(%)']),
                        type: 'line',
                        yAxisIndex: 1,
                        lineStyle: {
                            normal: {
                                color: ' #FFA100',
                                type: 'dashed'
                            }
                        },
                        data: this.props.mi1201Info.compressPercent,
                        smoothMonotone: "x",
                        smooth: true,
                        showSymbol:false,
                    },
                ]
            }
        };
        return <Card className="card">
            <div className="chart-title"><span
                className="title-company-abbr">{parse(this.props.location.search).company_abbr}</span><span
                className="title-status">{parse(this.props.location.search).status}</span></div>
            <section style={{marginBottom: 16}}>
                <Select style={{width: 150, marginRight: 8}} defaultValue="5" onChange={this.selectTop}>
                    {option}
                </Select>
                <Select style={{width: 150}} placeholder={__(messages["请选择时间间隔"])}
                        onChange={this.selectTimeInterval} defaultValue="0">
                    <Option value="0" key='0'>{__(messages["最近30分钟"])}</Option>
                    <Option value="1" key='1'>{__(messages["最近六小时"])}</Option>
                    <Option value="2" key='2'>{__(messages["最近24小时"])}</Option>
                    <Option value="3" key='3'>{__(messages["最近一周"])}</Option>
                </Select>
            </section>
            <BossTable columns={columns} dataSource={this.props.mi1201Info.compressList}/>
            <Modal title={__(messages["流量压缩日统计"])} visible={this.state.chartModalShow} width={750} footer={null} onCancel={this.handleCancelModal} destroyOnClose>
                <div style={{position:"relative"}}>
                    <span>{this.state.appName}{__(messages["应用流量压缩日统计"])}</span>
                    <Select style={{width: 150}} placeholder={__(messages["请选择时间间隔"])}
                            onChange={this.selectModalTimeInterval} defaultValue="0">
                        <Option value="0" key='0'>{__(messages["最近30分钟"])}</Option>
                        <Option value="1" key='1'>{__(messages["最近六小时"])}</Option>
                        <Option value="2" key='2'>{__(messages["最近24小时"])}</Option>
                    </Select>
                </div>
                <BossLineChart {...chartOptions}/>
            </Modal>
        </Card>
    }
}

export default injectIntl(MI1202);