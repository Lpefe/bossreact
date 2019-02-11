import React from 'react';
import {Tabs, DatePicker, Checkbox, Card} from 'antd';
import Reports from "./subComponent/Reports";
import moment from 'moment';
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';
const TabPane = Tabs.TabPane;
const {MonthPicker, WeekPicker} = DatePicker;
const CheckboxGroup = Checkbox.Group;

class MI1401 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tabKey: "1",
            company_stat: "正式,试用",
            start_tm: moment().subtract(1, 'days').startOf("day").format("YYYY-MM-DD HH:mm:ss"),
            end_tm: moment().subtract(1, 'days').endOf("day").format("YYYY-MM-DD HH:mm:ss")
        }
    }

    componentDidMount() {

    }


    handleTabChange = (key) => {
        let vm = this;
        switch (key) {
            case "1":
                this.setState({
                    tabKey: key,
                    start_tm: moment().subtract(1, 'days').startOf("day").format("YYYY-MM-DD HH:mm:ss"),
                    end_tm: moment().subtract(1, 'days').endOf("day").format("YYYY-MM-DD HH:mm:ss")
                }, function () {
                    vm.ref1.get_band_load_all();
                });
                break;
            case "2":
                this.setState({
                    tabKey: key,
                    start_tm: moment().subtract(1, 'days').startOf("week").format("YYYY-MM-DD HH:mm:ss"),
                    end_tm: moment().subtract(1, 'days').endOf("week").format("YYYY-MM-DD HH:mm:ss")
                }, function () {
                    vm.ref2.get_band_load_all();
                });
                break;
            case "3":
                this.setState({
                    tabKey: key,
                    start_tm: moment().subtract(1, 'days').startOf("month").format("YYYY-MM-DD HH:mm:ss"),
                    end_tm: moment().subtract(1, 'days').endOf("month").format("YYYY-MM-DD HH:mm:ss")

                }, function () {
                    vm.ref3.get_band_load_all();
                });
                break;
            default:
                break;
        }

    };


    handleDayChange = (value) => {
        let startTime = moment(value).startOf("day").format("YYYY-MM-DD HH:mm:ss");
        let endTime = moment(value).endOf("day").format("YYYY-MM-DD HH:mm:ss");
        this.setState({
            start_tm: startTime,
            end_tm: endTime,
        },()=>{
            switch (this.state.tabKey) {
                case "1":
                    this.ref1.get_band_load_all();
                    break;
                case "2":
                    this.ref2.get_band_load_all();
                    break;
                case "3":
                    this.ref3.get_band_load_all();
                    break;
                default:
                    break;
            }
        })
    };

    handleWeekChange = (value) => {
        let startTime = moment(value).startOf("week").format("YYYY-MM-DD HH:mm:ss");
        let endTime = moment(value).endOf("week").format("YYYY-MM-DD HH:mm:ss");
        this.setState({
            start_tm: startTime,
            end_tm: endTime,
        },()=>{
            switch (this.state.tabKey) {
                case "1":
                    this.ref1.get_band_load_all();
                    break;
                case "2":
                    this.ref2.get_band_load_all();
                    break;
                case "3":
                    this.ref3.get_band_load_all();
                    break;
                default:
                    break;
            }
        })
    };

    handleMonthChange = (value) => {
        let startTime = moment(value).startOf("month").format("YYYY-MM-DD HH:mm:ss");
        let endTime = moment(value).endOf("month").format("YYYY-MM-DD HH:mm:ss");
        this.setState({
            start_tm: startTime,
            end_tm: endTime,
        },()=>{
            switch (this.state.tabKey) {
                case "1":
                    this.ref1.get_band_load_all();
                    break;
                case "2":
                    this.ref2.get_band_load_all();
                    break;
                case "3":
                    this.ref3.get_band_load_all();
                    break;
                default:
                    break;
            }
        })
    };

    handleChangeCompanyStat = (values) => {
        let vm = this;
        this.setState({
            company_stat: values.join(",")
        }, function () {
            switch (this.state.tabKey) {
                case "1":
                    vm.ref1.get_band_load_all();
                    break;
                case "2":
                    vm.ref2.get_band_load_all();
                    break;
                case "3":
                    vm.ref3.get_band_load_all();
                    break;
                default:
                    break;
            }
        })
    };
    onRef1 = (vm) => {
        this.ref1 = vm;
    };
    onRef2 = (vm) => {
        this.ref2 = vm;
    };
    onRef3 = (vm) => {
        this.ref3 = vm;
    };

    render() {
        const __=this.props.intl.formatMessage;
        const plainOptions = [
            {label: __(messages['仅统计正式用户']), value: '正式'},
            {label: __(messages['仅统计试用用户']), value: '试用'},
        ];
        return <div>
            <Card className="card">
                <div>
                    {(() => {
                        switch (this.state.tabKey) {
                            case "1":
                                return <DatePicker defaultValue={moment().subtract(1, "day")}
                                                   onChange={this.handleDayChange}/>;
                            case "2":
                                return <WeekPicker defaultValue={moment().subtract(1, "day")}
                                                   onChange={this.handleWeekChange}/>;
                            case "3":
                                return <MonthPicker defaultValue={moment().subtract(1, "day")}
                                                    onChange={this.handleMonthChange}/>;
                            default:
                                return <DatePicker defaultValue={moment().subtract(1, "day")}
                                                   onChange={this.handleDayChange}/>;
                        }
                    })()}
                    <CheckboxGroup options={plainOptions} style={{marginLeft: 48}}
                                   defaultValue={this.state.company_stat.split(",")}
                                   onChange={this.handleChangeCompanyStat}/>
                </div>
            </Card>
            <Card className="card">
                <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                    <TabPane tab={__(messages["日报表"])} key="1" forceRender>
                        <Reports onRef1={this.onRef1} company_stat={this.state.company_stat}
                                 start_tm={this.state.start_tm}
                                 end_tm={this.state.end_tm} tabKey="1" selectedTabKey={this.state.tabKey}/>
                    </TabPane>
                    <TabPane tab={__(messages["周报表"])} key="2" forceRender>
                        <Reports onRef2={this.onRef2} company_stat={this.state.company_stat}
                                 start_tm={this.state.start_tm}
                                 end_tm={this.state.end_tm} tabKey="2" selectedTabKey={this.state.tabKey}/>
                    </TabPane>
                    <TabPane tab={__(messages["月报表"])} key="3" forceRender>
                        <Reports onRef3={this.onRef3} company_stat={this.state.company_stat}
                                 start_tm={this.state.start_tm}
                                 end_tm={this.state.end_tm} tabKey="3" selectedTabKey={this.state.tabKey}/>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    }
}

export default injectIntl(MI1401);