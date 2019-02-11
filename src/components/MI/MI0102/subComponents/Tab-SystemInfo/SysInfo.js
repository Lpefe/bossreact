import React from 'react';
import {Card, Form, Select,} from 'antd';
import {connect} from 'dva';
import BossLineChart from "../../../../Common/Charts/Line/BossLineChart";
import moment from 'moment'
import noneData from '../../../../../assets/img/noWan.png'
import {parse} from "../../../../../utils/commonUtilFunc";
import {withRouter} from "react-router-dom";
import CommonMessages from '../../../../../locales/commonMessages';
import {FormattedMessage, injectIntl} from "react-intl";
import messages from "../../LocaleMsg/messages";

const Option = Select.Option;

class SysInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            end_tm: moment().format("YYYY-MM-DD HH:mm:ss"),
            start_tm: moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            intervalType: "0",
            offId: "",
        }
    }

    componentDidMount() {
        this.get_device_info();
    }

    //这里需要先调用get_device_list获取该设备所属公司id,再调用get_system获取系统信息
    get_device_info = () => {
        this.props.dispatch({
            type: "mi0102Info/get_device_list",
            payload: {
                id: parse(this.props.location.search).device_id?parse(this.props.location.search).device_id:parse(this.props.location.search).id
            }
        }).then(() => {
            this.get_system();
        })
    };

    get_system = () => {
        const {deviceInfo} = this.props.mi0102Info;
        this.props.dispatch({
            type: "mi0102Info/get_system",
            payload: {
                sn: deviceInfo.sn || this.props.sn,
                companyid: deviceInfo.company_id || this.props.company_id,
                start_tm: this.state.start_tm,
                end_tm: this.state.end_tm,
                begin_time: this.state.start_tm,
                end_time: this.state.end_tm,
            }
        })
    };

    selectTimeInterval = (value) => {
        let start_tm;
        let end_tm = moment().format("YYYY-MM-DD HH:mm:ss");
        let time = parse(this.props.location.search).time;
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
            case "3":
                start_tm = moment().subtract(7, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "4":
                start_tm = moment(time).subtract(15, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "5":
                start_tm = moment(time).subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "6":
                start_tm = moment(time).subtract(3, 'hours').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(3, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "7":
                start_tm = moment(time).subtract(12, 'hours').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(12, 'hours').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "8":
                start_tm = moment(time).subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(1, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            case "9":
                start_tm = moment(time).subtract(3, 'days').format("YYYY-MM-DD HH:mm:ss");
                end_tm = moment(time).add(3, 'days').format("YYYY-MM-DD HH:mm:ss");
                break;
            default:
                start_tm = moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                break;
        }
        this.setState({
            start_tm: start_tm,
            end_tm: end_tm,
            intervalType: value
        }, () => {
            this.get_system();
        })
    };

    selectRefreshInterval = (value) => {
        let vm = this;
        let timeInterval;
        clearInterval(this.state.offId);
        switch (value) {
            case "0":
                return;
            case "1":
                timeInterval = 15 * 1000;
                break;
            case "2":
                timeInterval = 30 * 1000;
                break;
            case "3":
                timeInterval = 60 * 1000;
                break;
            default:
                return;
        }

        let offId = setInterval(function () {
            vm.selectTimeInterval(vm.state.intervalType)
        }, timeInterval);
        this.setState({
            offId: offId
        })
    };

    render() {
        const __ = this.props.intl.formatMessage;
        let chartProps = {
            id: "one",
            containerHeight: 400,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    min: this.state.start_tm,
                    max: this.state.end_tm,
                    minInterval: 1,
                    axisTick: {show: false},
                },
                yAxis: [
                    {
                        type: 'value',
                        name: __(messages["占用率"]) + "%",
                        max: 100,
                        axisLine: {show: false},
                        axisTick: {show: false}
                    },
                    {
                        type: 'category',
                        data: ["OFFLINE", "ONLINE", ""],
                        boundaryGap: false,
                        axisLine: {show: false},
                        axisTick: {show: false}
                    }
                ],
                series: this.props.mi0102Info.sysInfoDataSeries
            }
        };
        const option = [
            <Option value="0" key="0"><FormattedMessage {...CommonMessages.timeIntervalHalfHour}/></Option>,
            <Option value="1" key="1"><FormattedMessage {...CommonMessages.timeIntervalSixHour}/></Option>,
            <Option value="2" key="2"><FormattedMessage {...CommonMessages.timeInterval24Hour}/></Option>,
            <Option value="3" key="3"><FormattedMessage {...CommonMessages.timeIntervalOneWeek}/></Option>
        ];

        const loadOption = [
            <Option value="4" key="4">{__(messages["前后15分钟"])}</Option>,
            <Option value="5" key="5">{__(messages["前后30分钟"])}</Option>,
            <Option value="6" key="6">{__(messages["前后3小时"])}</Option>,
            <Option value="7" key="7">{__(messages["前后12小时"])}</Option>,
            <Option value="8" key="8">{__(messages["前后1天"])}</Option>,
            <Option value="9" key="9">{__(messages["前后3天"])}</Option>,
        ];
        //前后30分钟、前后1小时、前后6小时、前后24小时、前后2天和前后1周
        const search = parse(this.props.location.search);
        return (
            <Card className="card">
                {this.props.mi0102Info.ifNoSystemData ? <div style={{textAlign: "center"}}>
                    <img src={noneData} alt="" style={{marginTop: 60}}/>
                </div> : <div>
                    <header>
                        <Select style={{width: 200, marginRight: 8}} placeholder={__(messages["请选择时间间隔"])}
                                onChange={this.selectTimeInterval}
                                defaultValue={search.from === "load" || search.ifAlarm === "true" ? "4" : "0"}>
                            {search.from === "load" || search.ifAlarm === "true" ? loadOption : option}
                        </Select>
                        {parse(this.props.location.search).from === "load" ? "" :
                            <Select onChange={this.selectRefreshInterval} style={{width: 150}} defaultValue="0">
                                <Option value="0" key="0">{__(messages["不刷新"])}</Option>
                                <Option value="1" key="1">{__(messages["15秒刷新"])}</Option>
                                <Option value="2" key="2">{__(messages["30秒刷新"])}</Option>
                                <Option value="3" key="3">{__(messages["60秒刷新"])}</Option>
                            </Select>}
                    </header>
                    <BossLineChart {...chartProps}/>
                </div>}
            </Card>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(withRouter(injectIntl(SysInfo))));