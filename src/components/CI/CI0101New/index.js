/**
 * 客户-设备信息*/
import React from 'react';
import './index.scss';
import {Modal, Select, Card} from 'antd';

import HeaderBar from "../../Common/HeaderBar";
import moment from 'moment';
import BossTable from "../../Common/BossTable";
import cMessages from "../../../locales/commonMessages";
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';
import {domain} from "../../../utils/commonConsts";
import {deviceTypeMap} from "../../../utils/commonUtilFunc";
import BossDataHeader from "../../Common/BossDataHeader";

const Option = Select.Option;

class CI0101 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            net_type: "",
            name: "",
            status: "",
            alertModalShow: false,
            page_no: 1,
            page_size: 20,
        }
    }

    componentDidMount() {
        this.get_device_list();
        this.get_device_stat();
    }


    get_device_list = () => {
        this.props.dispatch({
            type: "ci0101Info/getDeviceList",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                net_type: this.state.net_type || "",
                name: this.state.name || "",
                status: this.state.status || "",
                page_no: this.state.page_no,
                page_size: this.state.page_size
            }
        })
    };


    searchDevice = (value) => {
        this.setState({
            name: value,
            page_no: 1,
            page_size: 20,
        }, ()=> {
            this.get_device_list();
        })
    };

    get_device_stat = () => {
        this.props.dispatch({
            type: "ci0101Info/get_device_stat",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
            }
        })
    };

    handleChangeStatus = (value) => {
        this.setState({
            status: value,
            page_no: 1,
            page_size: 20,
        },  ()=> {
            this.get_device_list();
        })
    };
    handleChangeMode = (value) => {
        this.setState({
            net_type: value,
            page_no: 1,
            page_size: 20,
        }, ()=> {
            this.get_device_list();
        })
    };

    handleAlertModalShow = (record) => {
        const __ = this.props.intl.formatMessage;
        this.props.dispatch({
            type: "ci0101Info/get_alarm_list",
            payload: {
                __: __,
                sn: record.sn,
                begin_time: moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss"),
                end_time: moment().format("YYYY-MM-DD HH:mm:ss")
            }
        })
    };

    handleCloseAlertModal = () => {
        this.props.dispatch({
            type: "ci0101Info/closeAlertModal"
        })
    };

    checkDevice = (status) => {
        this.setState({
            status:status,
            page_no: 1,
            page_size: 20,
        },()=>{
            this.get_device_list()
        })
    };

    gotoDevice=(record)=> {
        window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi0101/mi0102?id=" + record.id + "&sn=" + record.sn + "&type=" + record.type + "&from=device")
    };

    render() {
        const __ = this.props.intl.formatMessage;
        const columns = [{
            title: __(messages['设备名称']),
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span onClick={() => this.gotoDevice(record)} className="common-link-icon">
                    {record.name}
                </span>
            }
        }, {
            title: __(messages['状态']),
            dataIndex: 'status',
            key: 'status',
            render: (index, record) => {
                switch (record.status) {
                    case "INIT":
                        return <span style={{color: "#FFD02D"}}>{record.status}</span>
                    case "ONLINE":
                        return <span style={{color: "#0EC80E"}}>{record.status}</span>
                    case "OFFLINE":
                        return <span style={{color: "#ff0002"}}>{record.status}</span>
                    default:
                        break;
                }
            }
        }, {
            title: __(messages['节点名称']),
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: __(messages['设备类型']),
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                return deviceTypeMap(text)
            }
        }, {
            title: __(messages['设备序列号']),
            dataIndex: 'sn',
            key: 'sn',
        },];

        const pagination = {
            pageSize: 20
        };

        const option = [
            <Option value="ONLINE" key="ONLINE">ONLINE</Option>,
            <Option value="INIT" key="INIT">INIT</Option>,
            <Option value="OFFLINE" key="OFFLINE">OFFLINE</Option>
        ];

        const optionTwo = [
            <Option value="Router" key="Router">路由</Option>,
            <Option value="Inline" key="Inline">串接</Option>,
            <Option value="Bypass" key="Bypass">旁路</Option>
        ];

        const alertColumns = [
            {
                title: '开始时间',
                dataIndex: 'begin_time',
                key: 'begin_time',
            }, {
                title: '结束时间',
                dataIndex: 'end_time',
                key: 'end_time',
            }, {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
            },
        ];

        return (
            <div>
                <BossDataHeader offLine={this.props.ci0101Info.OFFLINE}
                                init={this.props.ci0101Info.INIT}
                                onLine={this.props.ci0101Info.ONLINE}
                                total={this.props.ci0101Info.INIT + this.props.ci0101Info.OFFLINE + this.props.ci0101Info.ONLINE}
                                checkLink={this.checkDevice}
                                TotalLink="设备总数"
                                changeImg={false}
                />
                <Card className="card">
                    <HeaderBar hasDelete={false} hasSelect={true} hasSelectTwo={false}
                               hasSearch={true} selectOneMethod={this.handleChangeStatus}
                               selectPlaceHolder={__(cMessages['请选择状态'])} submit={this.searchDevice}
                               options={option} optionsTwo={optionTwo}/>
                    <BossTable pagination={pagination} columns={columns}
                               dataSource={this.props.ci0101Info.deviceData}/>
                    <Modal maskClosable={false} visible={this.props.ci0101Info.alertModalShow}
                           onCancel={this.handleCloseAlertModal} title="24小时报警"
                           size="middle" bordered>
                        <BossTable component={this} paging={true} total={this.props.ci0101Info.total} getData={this.get_device_list} columns={alertColumns} dataSource={this.props.ci0101Info.alarmList}/>
                    </Modal>
                </Card>
            </div>
        )
    }
}

export default injectIntl(CI0101);