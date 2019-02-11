import React from 'react';
import './index.scss';
import {Form, Card, Radio, Select} from 'antd';
import {commonTranslate, parse} from '../../../../../utils/commonUtilFunc';
import {connect} from 'dva';
import {withRouter} from 'react-router-dom'
import messages from '../../LocaleMsg/messages';
import {FormattedMessage, injectIntl} from "react-intl";
import BossLineChart from "../../../../Common/Charts/Line/BossLineChart";
import noWan from "../../../../../assets/img/noWan.png";
import CommonMessages from "../../../../../locales/commonMessages";
import moment from "moment";
const Option = Select.Option;
const RadioGrp = Radio.Group;

class PathInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            end_tm: parse(this.props.location.search).from === "load" ? moment(parse(this.props.location.search).time).add(15, 'minutes').format("YYYY-MM-DD HH:mm:ss") : moment().format("YYYY-MM-DD HH:mm:ss"),
            start_tm: parse(this.props.location.search).from === "load" ? moment(parse(this.props.location.search).time).subtract(15, 'minutes').format("YYYY-MM-DD HH:mm:ss") : moment().subtract(30, 'minutes').format("YYYY-MM-DD HH:mm:ss"),
            intervalType: parse(this.props.location.search).from === "load" ? "4" : "0"
        }
    }

    componentDidMount() {
        this.get_path_rtt()
        this.get_path_miss()
    }
    //路径信息网络延迟
    get_path_rtt=()=>{
        this.props.dispatch({
            type: "mi0102Info/get_path_rtt",
            payload: {
                start_tm:this.state.start_tm,
                end_tm:this.state.end_tm,
                tid: parse(this.props.location.search).id
            }
        })
    }
    //路径信息网络丢包
    get_path_miss=()=>{
        this.props.dispatch({
            type: "mi0102Info/get_path_miss",
            payload: {
                start_tm:this.state.start_tm,
                end_tm:this.state.end_tm,
                tid: parse(this.props.location.search).id
            }
        })
    }
    selectRefreshInterval = (value) => {
        let vm = this;
        let timeInterval;
        clearInterval(this.state.offId);
        this.props.mi0102Info.refreshType = value;
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
            vm.get_path_rtt()
            vm.get_path_miss()

        }, timeInterval);
        this.setState({
            offId: offId
        });
        sessionStorage.setItem("tunnelOffId", offId.toString())
    };

    selectTimeInterval = (value) => {
        let start_tm = "";
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
        },  ()=> {
            this.get_path_rtt()
            this.get_path_miss()
        })
    };

    render() {
        const __=commonTranslate(this);
        const {mi0102Info} = this.props;
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
        const tunnelId = parse(this.props.location.search).id;
        const chartPropsI = {
            id: "pathRtt",
            containerHeight: 400,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: true,
                    name: __(messages["时间"]),
                    min: this.state.start_tm,
                    max: this.state.end_tm,
                },
                yAxis: {type: 'value', name: "网络延迟(ms)",},

                series: this.props.mi0102Info.pathRtt
            }
        };
        const chartPropsII = {
            id: "pathMiss",
            containerHeight: 400,
            option: {
                xAxis: {
                    type: 'time',
                    boundaryGap: false,
                    name: __(messages["时间"]),
                    min: this.state.start_tm,
                    max: this.state.end_tm,
                },
                yAxis: [
                    {type: 'value', name:"网络丢包(%)", axisLine: {show: false}, axisTick: {show: false}},
                ],
                series:this.props.mi0102Info.pathMiss
            }
        };
        return (
            <Card className="card">
                {this.props.mi0102Info.pathRtt.length !== 0 ? <div>
                    <RadioGrp style={{marginBottom: 16}} value={mi0102Info.selectedTunnel}
                              onChange={this.handleSelectTunnelType}>
                        {search.from === "device" ? mi0102Info.tunnelList.map((item) => {
                            return <Radio key={item.value} value={item.value}>{item.name}</Radio>
                        }) : <Radio key={tunnelId} value={tunnelId}>{"tunnel_" + tunnelId}</Radio>}
                    </RadioGrp>
                    <header style={{marginBottom: 16}}>
                        <Select style={{width: 150, marginRight: 8}} placeholder={__(messages["请选择时间间隔"])}
                                onChange={this.selectTimeInterval}
                                defaultValue={search.from === "load"||search.ifAlarm==='true' ? "4" : "0"}>
                            {search.from === "load"|| search.ifAlarm === "true"  ? loadOption : option}
                        </Select>
                        {parse(this.props.location.search).from === "load"?"":<Select onChange={this.selectRefreshInterval} style={{width: 150}} defaultValue="0">
                            <Option value="0" key="0">{__(messages["不刷新"])}</Option>
                            <Option value="1" key="1">{__(messages["15秒刷新"])}</Option>
                            <Option value="2" key="2">{__(messages["30秒刷新"])}</Option>
                            <Option value="3" key="3">{__(messages["60秒刷新"])}</Option>
                        </Select>}
                    </header>
                    <Card style={{marginBottom: 16}} className="card">
                        <BossLineChart {...chartPropsI} ifNotMerge={true}/>
                    </Card>
                    <Card style={{marginBottom: 16}} className="card">
                        <BossLineChart {...chartPropsII} ifNotMerge={true}/>
                    </Card>
                </div> : <div style={{textAlign: "center"}}>
                    <img src={noWan} alt="" style={{marginTop: 60}}/>
                </div>}
            </Card>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}

let PathInfoF = Form.create()(withRouter(injectIntl(PathInfo)));

export default connect(mapDispatchToProps)(PathInfoF);