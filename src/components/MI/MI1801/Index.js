/**
 * 运维-报警信息组件
 **/
import React from 'react';
import {Card, Modal, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import moment from 'moment';
import BossEditModal from "../../Common/BossEditModal";
import {commonTranslate, deviceTypeMap, MomentFormatter, parse} from "../../../utils/commonUtilFunc";
import {domain} from "../../../utils/commonConsts";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";

const Option = Select.Option;

class MI1801 extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.location.search);
        this.state = {
            selectedIds: [],
            ignoreModalShow: false,
            processModalShow: false,
            confirmModalShow: false,
            editId: "",
            start_time: search.from !== 'dashboard' ? MomentFormatter(moment().startOf('month')) : "",
            end_time: search.from !== 'dashboard' ? MomentFormatter(moment()) : "",
            status: "TODO",
            alarm_level: search.alarm_level || "",
            alarm_type: search.alarm_type || "",
            name: "",
            editRecord: {},
            selectedRecords: [],
            ifIgnoreAll: false,
            ifIgnoreCurrent: false,
            page_size: 20,
            page_no: 1
        };

    }

    componentDidMount() {
        this.get_redis_alarm();
    }

    get_redis_alarm = () => {
        let payload = {
            start_time: this.state.start_time,
            end_time: this.state.end_time,
            status: this.state.status,
            alarm_level: this.state.alarm_level,
            alarm_type: this.state.alarm_type,
            name: this.state.name,
            page_no: this.state.page_no,
            page_size: this.state.page_size
        };
        if (sessionStorage.getItem('role') === 'company' || sessionStorage.getItem('role') === 'companystaff') {
            payload.company_id = sessionStorage.getItem('companyId');
        }
        this.props.dispatch({
            type: "mi1801Info/get_redis_alarm",
            payload: payload
        })
    };


    handleIgnoreModalShow = (record) => {
        this.setState({
            ignoreModalShow: true,
            editId: record.id,
            ifIgnoreAll: false,
            ifIgnoreCurrent: false
        })
    };
    handleIgnoreModalBatchShow = () => {
        this.setState({
            ignoreModalShow: true,
            ifIgnoreAll: false,
            ifIgnoreCurrent: false
        })
    };

    handleProcessModalShow = (record) => {
        if (record.deal_status === "DOING") {
            return;
        }
        this.setState({
            processModalShow: true,
            editId: record.id,
            editRecord: record,
        })
    };

    handleCloseIgnoreModal = () => {
        this.setState({
            ignoreModalShow: false,
            editId: "",

        })
    };

    handleCloseProcessModal = () => {
        this.setState({
            processModalShow: false,
            editId: ""
        })
    };

    handleCloseConfirmModal = () => {
        this.setState({
            confirmModalShow: false,
            processModalShow: false,
            editId: ""
        })
    };

    handleSelectRange = (moments) => {
        this.setState({
            start_time: moments[0] ? MomentFormatter(moments[0], "YYYY-MM-DD 00:00:00") : "",
            end_time: moments[1] ? MomentFormatter(moments[1], "YYYY-MM-DD 23:59:59") : "",
            page_size: 20,
            page_no: 1
        }, () => {
            this.get_redis_alarm();
        })
    };

    handleSelectAlarmType = (value) => {
        this.setState({
            alarm_type: value || "",
            page_size: 20,
            page_no: 1
        }, () => {
            this.get_redis_alarm();
        })
    };

    handleSelectAlarmLevel = (value) => {
        this.setState({
            alarm_level: value || "",
            page_size: 20,
            page_no: 1
        }, () => {
            this.get_redis_alarm();
        })
    };

    handleSelectAlarmStatus = (value) => {
        this.setState({
            status: value || "",
            page_size: 20,
            page_no: 1
        }, () => {
            this.get_redis_alarm();
        })
    };
    handelSearchSubmit = (value) => {
        this.setState({
            name: value,
            page_size: 20,
            page_no: 1
        }, () => {
            this.get_redis_alarm();
        })
    };

    handleIgnoreModalShowBatch = () => {
        const __ = this.props.intl.formatMessage;
        if (this.state.selectedIds.length > 0) {
            this.setState({
                editId: this.state.selectedIds
            }, () => {
                this.handleIgnoreModalBatchShow()
            })
        } else {
            Modal.warning({
                title: __(messages["请选择至少一项"])
            })
        }
    };

    handleCheckAlarm = (record) => {
        if (record.status === 'DONE') {
            window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi1801/mi1802?alarm_id=" + record.id)
        }
    };
    gotoLinkInfo = (record) => {
        if (record.company_id) {
            if (record.alarm_type === "link") {
                window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi0501/mi0502?id=" + record.link_id + "&company_id=" + record.company_id + "&sn=" + record.sn + "&device_id=" + record.device_id + "&from=link&bandwidth=" + record.bandwidth + "&ifAlarm=true&name=" + record.link_name + "&time=" + record.time + "&remark=" + record.remark + "&alarm_level=" + record.alarm_level)
            } else {
                window.open(domain + "/index." + window.appLocale.locale + ".html#/main/mi0101/mi0102?id=" + record.device_id + "&sn=" + record.sn + "&type=" + record.device_type + "&from=device&ifAlarm=true&name=" + record.device_name + "&time=" + record.time + "&remark=" + record.remark + "&alarm_level=" + record.alarm_level)
            }
        }
    };
    onRef = (ignoreModalComponent) => {
        this.ignoreModalComponent = ignoreModalComponent;
    };

    validateIgnore = (rule, value, callback) => {
        let ignore_all = this.ignoreModalComponent.props.form.getFieldValue("ignore_all");
        let ignore_current = this.ignoreModalComponent.props.form.getFieldValue("ignore_current");
        if (!(ignore_all || ignore_current)) {
            callback("请选择忽略当前消息或全部消息")
        }
        callback();
    };

    render() {
        const __ = commonTranslate(this);
        const search = parse(this.props.location.search);
        const ifCompany = sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff";
        let payload = {
            start_time: this.state.start_time,
            end_time: this.state.end_time,
            status: this.state.status,
            alarm_level: this.state.alarm_level,
            alarm_type: this.state.alarm_type,
            name: this.state.name,
        };
        if (ifCompany) {
            payload.company_id = sessionStorage.getItem('companyId');
        }
        const columns = [{
            title: __(messages["时间"]),
            dataIndex: "time",
            key: "time",
        }, {
            title: __(messages["名称"]),
            dataIndex: "name",
            key: "name",
            render: (text, record) => {
                return <span onClick={() => this.gotoLinkInfo(record)}
                             className={record.company_id ? "common-link-icon" : ""}>{record.alarm_type === 'device' ? record.device_name : record.link_name}</span>
            }
        }, {
            title: __(messages["企业名称"]),
            dataIndex: "company_abbr",
            key: "company_abbr",
        }, {
            title: __(messages["状态"]),
            dataIndex: "status",
            key: "status",
            render: (text) => {
                return text === "TODO" ? __(messages["新消息"]) : __(messages["历史消息"])
            }
        }, {
            title: __(messages["对象"]),
            dataIndex: "alarm_type",
            key: "alarm_type",
            render: (text) => {
                return text === "link" ? __(messages["链路"]) : __(messages["设备"])
            }
        }, {
            title: __(messages["类型"]),
            dataIndex: "alarm_level",
            key: "alarm_level",
        }, {
            title: __(messages["详细描述"]),
            dataIndex: "remark",
            key: "remark",
        }, {
            title: __(messages["操作"]),
            dataIndex: "operation",
            key: "operation",
            width: 150,
            align: "center",
            render: (text, record) => {
                return <div className="common-link-icon">{record.status === "TODO" ? <span style={{marginRight: 8}}
                                                                                           onClick={() => this.handleIgnoreModalShow(record)}>{__(messages["忽略"])}</span> : ""}{record.device_type === "STEP" ?
                    <span
                        style={record.status === "DOING" ? {
                            marginRight: 8,
                            color: "rgba(0,0,0,0.25)"
                        } : {marginRight: 8}}
                        onClick={() => this.handleProcessModalShow(record)}>{__(messages["处理"])}</span> : ""}<span
                    onClick={() => this.handleCheckAlarm(record)}
                    style={record.status === "TODO" ? {color: "rgba(0,0,0,0.25)"} : {}}>{__(messages["详情"])}</span>
                </div>
            }
        },];
        const companyCol = [{
            title: __(messages["时间"]),
            dataIndex: "time",
            key: "time",
        }, {
            title: __(messages["名称"]),
            dataIndex: "name",
            key: "name",
            render: (text, record) => {
                return <span onClick={() => this.gotoLinkInfo(record)}
                             className="common-link-icon">{record.alarm_type === 'device' ? record.device_name : record.link_name}</span>
            }
        }, {
            title: __(messages["状态"]),
            dataIndex: "status",
            key: "status",
            render: (text) => {
                return text === "TODO" ? __(messages["新消息"]) : __(messages["历史消息"])
            }
        }, {
            title: __(messages["对象"]),
            dataIndex: "alarm_type",
            key: "alarm_type",
            render: (text) => {
                return text === "link" ? __(messages["链路"]) : __(messages["设备"])
            }
        }, {
            title: __(messages["类型"]),
            dataIndex: "alarm_level",
            key: "alarm_level",
        }, {
            title: __(messages["详细描述"]),
            dataIndex: "remark",
            key: "remark",
        },];
        const options = [
            <Option value="link" key="link">{__(messages["链路"])}</Option>,
            <Option value="device" key="device">{__(messages["设备"])}</Option>,
        ];
        const optionsTwo = [
            <Option value="TODO" key="TODO">{__(messages["新消息"])}</Option>,
            <Option value="DONE" key="DONE">{__(messages["历史消息"])}</Option>,
        ];
        const optionsThree = [
            <Option value="Warning" key="Warning">Warning</Option>,
            <Option value="Critical" key="Critical">Critical</Option>,
        ];

        const rowSelection = {
            selectedRowKeys: this.state.selectedIds,
            fixed: true,
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords: selectedRecords,
                })
            }
        };

        const IgnoreModalOptions = {
            title: __(messages["忽略"]),
            visible: this.state.ignoreModalShow,
            onCancel: this.handleCloseIgnoreModal,
            dispatch: this.props.dispatch,
            submitType: "mi1801Info/ignore",
            initPayload: payload,
            hasSubmitCancel: true,
            submitCancel: () => {
                this.setState({
                    ignoreModalShow: false,
                    editId: "",
                    selectedIds: [],
                    selectedRecords: [],
                })
            },
            extraUpdatePayload: {ids: typeof this.state.editId === 'number' ? [this.state.editId] : this.state.editId},
            initialValues: {
                restrain_type:"current"
            },
            bodyHeight: 500,
            InputItems: [{
                type: "Radio",
                labelName: '',
                valName: "restrain_type",
                children: [{value: "current", name: "忽略当前消息", key: "1"}, {
                    value: "all",
                    name: "忽略所有消息",
                    key: "0"
                }],
            }, {
                type: "InputNumber",
                labelName: "忽略时间",
                valName: "restrain_hours",
                nativeProps: {
                    placeholder: "请输入忽略时间",
                    style: {
                        width: 120
                    },
                    disabled: this.state.ifIgnoreAll,
                },
                unit: "小时",
                rules: [{pattern: /^\d+$/, message: "只能输入正整数"}, {required: !this.state.ifIgnoreAll,message:"请输入忽略时间"}],
            }, {
                type: "TextArea",
                labelName: __(messages["说明"]),
                valName: "remark",
                nativeProps: {
                    placeholder: __(messages["请输入说明"]),
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{max: 256, message: __(messages["说明最多不超过256字符"])}]
            },]
        };

        const ProcessModalOptions = {
            title: __(messages["消息处理"]),
            visible: this.state.processModalShow,
            dispatch: this.props.dispatch,
            submitType: "mi1801Info/process",
            extraUpdatePayload: {alarm_id: this.state.editId, sn: this.state.editRecord.sn},
            initialValues: {},
            hasSubmitCancel: true,
            onCancel: this.handleCloseProcessModal,
            submitCancel: (modal) => {
                let values = modal.props.form.getFieldsValue();
                if (values.debug === "1" && values.process === undefined) {
                    Modal.warning({
                        title: __(messages["请至少选择一项操作"])
                    })
                } else {
                    this.setState({
                        confirmModalShow: true
                    })
                }

            },
            width: 535,
            InputItems: [{
                type: "Plain",
                labelName: __(messages["设备名称"]),
                content: this.state.editRecord.device_name
            }, {
                type: "Plain",
                labelName: __(messages["设备序列号"]),
                content: this.state.editRecord.sn
            }, {
                type: "Plain",
                labelName: __(messages["设备类型"]),
                content: deviceTypeMap(this.state.editRecord.device_type)
            }, {
                type: "Plain",
                labelName: __(messages["链路名称"]),
                content: this.state.editRecord.link_name
            }, {
                type: "Radio",
                labelName: __(messages["处理"]),
                valName: "debug",
                style: {
                    background: "#f2f2f2",
                    marginBottom: 0,
                    paddingBottom: 16
                },
                children: [{
                    name: __(messages["关闭Debug日志"]),
                    value: "close_step_main_debug",
                    key: "6"
                }, {
                    name: __(messages["开启Debug日志"]),
                    value: "open_step_main_debug",
                    key: "5"
                }, {name: __(messages["重启step_main服务"]), value: "restart_step_main", key: "1"}, {
                    name: __(messages["获取step_main日志"]),
                    value: "up_step_main_log", key: "2"
                }, {name: __(messages["重启dyagent服务"]), value: "restart_dyagent", key: "3"}, {
                    name: __(messages["获取dyagent日志"]),
                    value: "up_dyagent_log", key: '4'
                }]
            }, {
                type: "TextArea",
                labelName: __(messages["说明"]),
                valName: "remark",
                style: {
                    background: "#f2f2f2",
                    marginBottom: 0,
                    paddingBottom: 32
                },
                nativeProps: {
                    placeholder: __(messages["请输入说明"]),
                    autosize: {minRows: 6, maxRows: 12},
                },
                rules: [{max: 256, message: __(messages["说明最多不超过256字符"])}]
            }]
        };

        const ConfirmModalOptions = {
            title: __(messages["请输入验证密码"]),
            visible: this.state.confirmModalShow,
            onCancel: this.handleCloseConfirmModal,
            dispatch: this.props.dispatch,
            submitType: "mi1801Info/confirm",
            extraUpdatePayload: {id: this.state.editId},
            initPayload: payload,
            initialValues: {
                userNm: sessionStorage.getItem("userNm")
            },
            bodyHeight: 200,
            InputItems: [{
                type: "Input",
                labelName: __(messages["用户名"]),
                valName: "userNm",
                nativeProps: {
                    disabled: true,
                },
            }, {
                type: "Input",
                labelName: __(messages["密码"]),
                valName: "password",
                rules: [{required: true, message: __(messages["请输入密码"])}],
                nativeProps: {
                    type: 'password',
                },
            }]
        };

        return (
            <Card className="card">
                <HeaderBar hasSearch={true} hasSelect={true} hasRangePicker={true} hasSelectTwo={true}
                           hasSelectThree={true} selectPlaceHolder={__(messages["请选择对象"])}
                           selectTwoPlaceHolder={__(messages["请选择状态"])} selectTwoDefaultValue={this.state.status}
                           selectOneDefaultValue={search.alarm_type}
                           selectThreeDefaultValue={search.alarm_level}
                           selectThreePlaceHolder={__(messages["请选择类型"])} hasExtraBtnThree={true}
                           extraBtnNameThree={ifCompany ? __(messages["设为历史消息"]) : __(messages["批量忽略"])}
                           btnThreeFunc={this.handleIgnoreModalShowBatch}
                           dateRange={search.from !== 'dashboard' ? [moment().startOf('month'), moment()] : []}
                           options={options} optionsTwo={optionsTwo}
                           optionsThree={optionsThree} rangePickerMethod={this.handleSelectRange}
                           selectOneMethod={this.handleSelectAlarmType} selectTwoMethod={this.handleSelectAlarmStatus}
                           selectThreeMethod={this.handleSelectAlarmLevel} submit={this.handelSearchSubmit}
                           selectedKeys={this.state.selectedRecords} selectOneWidth={120} selectTwoWidth={90}
                           hasDownload={true} downloadBtnNm={__(messages["导出"])}
                           downloadUrl={domain + "/v1/company/get_redis_alarm/?to_export=1&start_time=" + this.state.start_time + "&end_time=" + this.state.end_time + "&status=" + this.state.status + "&alarm_level=" + this.state.alarm_level + "&alarm_type=" + this.state.alarm_type + "&name=" + this.state.name}
                           selectThreeWidth={130}/>
                <BossTable component={this}
                    columns={sessionStorage.getItem("role") === 'company' || sessionStorage.getItem("role") === 'companystaff' ? companyCol : columns}
                    paging={true} dataSource={this.props.mi1801Info.alarmList} total={this.props.mi1801Info.total}
                    getData={this.get_redis_alarm} rowSelection={rowSelection}/>
                <BossEditModal {...IgnoreModalOptions} refs={this.onRef}/>
                <BossEditModal {...ProcessModalOptions}/>
                <BossEditModal {...ConfirmModalOptions}/>
            </Card>
        )
    }
}

export default injectIntl(MI1801);