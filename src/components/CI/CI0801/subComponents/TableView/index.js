import React from 'react';
import {Row, Col, Tabs, Card, Button} from 'antd';
import {connect} from 'dva';
import LinkStat from "../LinkStat";
import Device from "../Device";
import * as echarts from 'echarts';
import {injectIntl, FormattedMessage} from 'react-intl';
import messages from '../../LocaleMsg/message';
import warningIcon from "../../../../../assets/img/warning-icon.png";
import criticalIcon from "../../../../../assets/img/critical-icon.png";
import {withRouter} from "react-router";

const TabPane = Tabs.TabPane;


class TableView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let stat = this.props.ci0801Info;
        let vm = this;
        setTimeout(function () {
            vm.get_stat()
        }, 0);
        const __ = this.props.intl.formatMessage;
        this.linkStat = echarts.init(document.getElementById("link-stat"));
        this.stepDeviceStat = echarts.init(document.getElementById("step-device-stat"));
        this.agencyStat = echarts.init(document.getElementById("agency-stat"));
        this.renderChart(this.linkStat, __(messages.linkStat), stat.linkStat.data, stat.linkStat.legend);
        this.renderChart(this.stepDeviceStat, __(messages.deviceStat), stat.deviceStat.data, stat.deviceStat.legend);
        this.renderChart(this.agencyStat, __(messages.nodeStat), stat.agencyStat.data, stat.agencyStat.legend);

    }

    componentDidUpdate() {
        let stat = this.props.ci0801Info;
        const __ = this.props.intl.formatMessage;
        this.renderChart(this.linkStat, __(messages.linkStat), stat.linkStat.data, stat.linkStat.legend);
        this.renderChart(this.stepDeviceStat, __(messages.deviceStat), stat.deviceStat.data, stat.deviceStat.legend);
        this.renderChart(this.agencyStat, __(messages.nodeStat), stat.agencyStat.data, stat.agencyStat.legend);
    }

    get_stat = () => {
        const __ = this.props.intl.formatMessage;
        this.props.dispatch({
            type: "ci0801Info/get_stat",
            payload: {
                __: __,
                company_id: (sessionStorage.getItem("companyId")) || ''
            }
        })
    };


    renderChart = (el, title, data, legend) => {
        let option = {
            title: {
                text: title,
                padding: [0, 0, 24, 0],
                textStyle: {
                    fontSize: 16,
                    color: "#333",
                    fontWeight: 500
                }
            },
            tooltip: {
                trigger: 'item',// 触发类型，默认数据触发
                backgroundColor: "#fff",
                extraCssText: 'box-shadow: 4px 4px 2px #ddd;',
                formatter: function (data) {
                    return '<div class="statContainer"><span class="statContent"><span class="title" style="color:' + data.color + '">' + data.data.name + ':</span>&nbsp;&nbsp;' + data.data.value + '&nbsp;(&nbsp;' + data.percent + '%&nbsp;)</span></div>';
                }
            },
            legend: {//图例
                orient: 'vertical',
                right: 10,
                top: '38%',
                data: legend,
                itemWidth: 12,
                itemHeight: 8,
                itemGap: 16,
                textStyle: {
                    fontSize: 14,
                    fontFamily: 'PingFangTC-Regular',
                    color: "rgba(0,0,0,0.65)"
                }
            },
            color: function (params) {
                const colorMap={
                    "INIT":"#FFD02D",
                    "ONLINE":"#3B9FF7",
                    "OFFLINE":"#FF395C"
                };
                const colorMapNodes={
                    "1":"#2772A3",
                    "0":"#47CACA"
                };
                return params.name in colorMap?colorMap[params.name]:colorMapNodes[params.dataIndex]
            },
            series: [
                {
                    name: "",
                    type: 'pie',
                    radius: ['40%', '54%'],
                    center: ['25%', '60%'],
                    animation: false,
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: true,
                            position: 'center',
                            formatter: () => {
                                let sum = 0;
                                for (let key in data) {
                                    sum += data[key].value
                                }
                                return sum
                            },
                            fontWeight: "bold",
                            fontSize: 24,
                        },
                    },
                    itemStyle: {
                        normal: {
                            borderWidth: 2,
                            borderColor: '#ffffff',
                        },
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data
                }
            ]
        };
        el.setOption(option);
    };

    goto_alarm_info = (alarm_level) => {
        this.props.history.push("/main/ci2501?alarm_level=" + alarm_level + "&from=dashboard")
    };

    render() {
        const __ = this.props.intl.formatMessage;
        return <div>
            <div className="bread-container">
                <span className="front">{__(messages.frontPage)}</span>
            </div>
            <Card className="header-container card">
                <ul className="content-list">
                    <li><span><FormattedMessage {...messages.totalBandWidth}/>: <span
                        className="value">{this.props.ci0801Info.bandwidthTotal} M</span></span>
                    </li>
                    <li><span>{__(messages.domesticNet)}: <span
                        className="value">{this.props.ci0801Info.bandwidthStat["国内组网"] || 0} M</span></span>
                    </li>
                    <li><span>{__(messages.overseaNet)}: <span
                        className="value">{this.props.ci0801Info.bandwidthStat["全球组网"] || 0} M</span></span>
                    </li>
                    <li>
                        <span>{__(messages.overseaSaas)}: <span
                            className="value">{this.props.ci0801Info.bandwidthStat["全球SaaS加速"] || 0} M</span></span>
                    </li>
                    <li>
                        <span>{__(messages.domesticSaas)}: <span
                            className="value">{this.props.ci0801Info.bandwidthStat["国内SaaS加速"] || 0} M</span></span>
                    </li>
                    <li>
                        <Button style={{float: "right"}} icon="swap" size="small"
                                onClick={() => this.props.switch("map")}>{__(messages.map)}</Button>
                    </li>
                </ul>
            </Card>
            <div className="chart-container">
                <Row gutter={16}>
                    <Col span={6}>
                        <Card className="card">
                            <div className="alarm-title">{__(messages["告警信息"])}</div>
                            <div className="alarm-content" onClick={() => this.goto_alarm_info("Warning")}>
                                <img src={warningIcon} alt="" className="warning-icon"/>
                                <span className="type">Warning</span>
                                <span
                                    className="count">{this.props.ci0801Info.alarmStat.device.Warning || 0 + this.props.ci0801Info.alarmStat.link.Warning || 0}</span>
                            </div>
                            <div className="alarm-content" onClick={() => this.goto_alarm_info("Critical")}>
                                <img src={criticalIcon} alt="" className="critical-icon"/>
                                <span className="type">Critical</span>
                                <span
                                    className="count">{this.props.ci0801Info.alarmStat.device.Critical || 0 + this.props.ci0801Info.alarmStat.link.Critical || 0}</span>
                            </div>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="card">
                            <div id="link-stat"/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="card">
                            <div id="step-device-stat"/>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card className="card">
                            <div id="agency-stat"/>
                        </Card>
                    </Col>
                </Row>
            </div>
            <Card className="card">
                <Tabs defaultActiveKey="1">
                    <TabPane tab={__(messages.link)} key="1">
                        <LinkStat/>
                    </TabPane>
                    <TabPane tab={__(messages.device)} key="2">
                        <Device/>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    }
}

function mapDispatchToProps({ci0801Info}) {
    return {ci0801Info};
}

export default connect(mapDispatchToProps)(injectIntl(withRouter(TableView)));