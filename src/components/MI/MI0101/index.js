/**
 * 运维-设备信息
 * */
import React from 'react';
import './index.scss';
import {Button, Card, Dropdown, Icon, Menu, Modal, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import moment from 'moment';
import BossTable from "../../Common/BossTable";
import cMessages from "../../../locales/commonMessages";
import {injectIntl} from "react-intl";
import messages from "./LocaleMsg/messages";
import {domain} from '../../../utils/commonConsts';
import {commonTranslate, deviceTypeMap, deviceTypeMapReverse, parse} from '../../../utils/commonUtilFunc';
import BossEditModal from "../../Common/BossEditModal";
import BossDataHeader from "../../Common/BossDataHeader";

const Option = Select.Option;
const url = domain;

class MI0101 extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.location.search);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            net_type: "",
            name: "",
            status: search.status || "",
            alertModalShow: false,
            type: deviceTypeMapReverse(search.type) || "STEP,CSTEP,AP",
            model: search.model || "",
            deviceModalShow: false,
            exchangeDeviceModalShow: false,
            editId: "",
            editRecord: {},
            page_no: 1,
            page_size: 20,
            selectedSns: [],
            selectedCmd: "",
            company_id:""
        }
    }

    componentDidMount() {
        this.get_device_list();
        this.get_device_stat();
        this.get_cmd_list();
        this.get_company_list();
        this.get_device_model();
    }

    get_device_model = () => {
        this.props.dispatch({
            type: "mi0101Info/get_device_model",
            payload: {}
        })
    };

    get_company_list = () => {
        this.props.dispatch({
            type: "mi0101Info/getCompanyList",
            payload: {}
        })
    };

    get_cmd_list = () => {
        this.props.dispatch({
            type: "ci0101Info/get_cmd_list",
            payload: {}
        })
    };

    get_pop_device_list = (record) => {
        this.props.dispatch({
            type: "ci0101Info/get_pop_device_list",
            payload: {
                status: "ONLINE",
                agency_id: record.agency_id,
            }
        })
    };

    //获取设备清单
    get_device_list = () => {
        this.props.dispatch({
            type: "ci0101Info/getDeviceList",
            payload: {
                net_type: this.state.net_type || "",
                name: this.state.name || "",
                status: this.state.status || "",
                type: this.state.type,
                model: this.state.model,
                page_no: this.state.page_no,
                page_size: this.state.page_size,
                company_id:this.state.company_id
            }
        })
    };

    //根据关键字搜索设备
    searchDevice = (value) => {
        this.setState({
            name: value || "",
            page_no: 1
        }, () => {
            this.get_device_list();
        })
    };

    //获取设备统计数据
    get_device_stat = () => {
        this.props.dispatch({
            type: "ci0101Info/get_device_stat",
            payload: {}
        })
    };


    //根据设备状态获取设备列表
    handleChangeStatus = (value) => {
        this.setState({
            status: value || "",
            page_no: 1
        }, () => this.get_device_list())
    };


    //获取设备警告信息
    handleAlertModalShow = (record) => {
        this.props.dispatch({
            type: "ci0101Info/get_alarm_list",
            payload: {
                sn: record.sn,
                begin_time: moment().subtract(1, 'days').format("YYYY-MM-DD HH:mm:ss"),
                end_time: moment().format("YYYY-MM-DD HH:mm:ss")
            }
        })
    };

    //关闭警告信息弹出框
    handleCloseAlertModal = () => {
        this.props.dispatch({
            type: "ci0101Info/closeAlertModal"
        })
    };
    //删除设备
    delete_device = (record) => {
        const __ = commonTranslate(this);
        Modal.confirm({
            title: __(messages["确定要回收该设备吗?"]),
            onOk: () => {
                this.props.dispatch({
                    type: "ci0101Info/delete_device",
                    payload: {
                        init: {
                            net_type: this.state.net_type || "",
                            name: this.state.name || "",
                            status: this.state.status || "",
                            type: this.state.type,
                            model: this.state.model,
                            page_no: this.state.page_no,
                            page_size: this.state.page_size,
                            company_id:this.state.company_id
                        },
                        delete: {
                            ids: [record.id],
                            records: [record]
                        }
                    }
                })
            }
        })
    };
    //根据统计数据筛选设备
    checkLink = (status) => {
        this.setState({
            status: status,
            page_no: 1
        }, () => this.get_device_list())
    };
    //根据设备类型获取设备列表
    handleSelectType = (value) => {
        this.setState({
            type: value || "STEP,CSTEP,AP",
            page_no: 1
        }, () => this.get_device_list())
    };

    handleSelectCompany=(value)=>{
        this.setState({
            company_id:value||"",
            page_no: 1
        }, () => this.get_device_list())
    };
    handleSelectModel = (value) => {
        this.setState({
            model: value || "",
            page_no: 1
        }, () => this.get_device_list())
    };

    gotoDevice = (record) => {
        window.open(url + "/index." + window.appLocale.locale + ".html#/main/mi0101/mi0102?id=" + record.id + "&sn=" + record.sn + "&type=" + record.type + "&from=device")
    };
    handleOpenSSHConsole = (record) => {
        window.open(url + "/index." + window.appLocale.locale + ".html#/main/mi0103?sn=" + record.sn)
    };

    get_agency_list = (company_id) => {
        this.props.dispatch({
            type: "ci0101Info/get_agency_list",
            payload: {
                company_id: company_id
            }
        })
    };

    handleOpenDeviceMoveModal = (record) => {
        this.setState({
            deviceModalShow: true,
            editRecord: record,
            editId: record.id
        }, () => {
            this.get_agency_list(this.state.editRecord.company_id)
        })
    };

    handleCloseDeviceMoveModal = () => {
        this.setState({
            deviceModalShow: false,
            editRecord: {},
            editId: ""
        })
    };

    handleOpenExchangeDeviceModal = (record) => {
        this.setState({
            exchangeDeviceModalShow: true,
            editRecord: record,
            editId: record.id
        }, () => {
            this.get_pop_device_list(this.state.editRecord)
        })
    };

    handleCloseExchangeDeviceModal = () => {
        this.setState({
            exchangeDeviceModalShow: false,
            editRecord: {},
            editId: ""
        })
    };

    operationMenuRender = (index, record) => {
        const __ = this.props.intl.formatMessage;
        return <Menu>
            <Menu.Item key="1"
                       onClick={() => this.handleOpenExchangeDeviceModal(record)}>{__(messages['设备更换'])}</Menu.Item>
            <Menu.Item key="2" onClick={() => this.delete_device(record)}>{__(messages['设备回收'])}</Menu.Item>
            {record.has_link ? "" : <Menu.Item key="3"
                                               onClick={() => this.handleOpenDeviceMoveModal(record)}>{__(messages['设备迁移'])}</Menu.Item>}
            <Menu.Item key="4" onClick={() => this.handleOpenSSHConsole(record)}>{'远程登录'}</Menu.Item>
        </Menu>
    };

    handleSelectCommand = (value) => {
        this.setState({
            selectedCmd: value
        })
    };

    send_command = () => {
        if (this.state.selectedSns.length > 0) {
            Modal.confirm({
                title: "确认执行该命令?",
                onOk: () => {
                    this.props.dispatch({
                        type: "mi0101Info/send_command",
                        payload: {
                            sns: this.state.selectedSns,
                            cmd: this.state.selectedCmd,
                        }
                    })
                }
            })
        } else {
            Modal.warning({
                title: "请至少选择一台设备"
            })
        }
    };

    render() {
        const __ = this.props.intl.formatMessage;
        const search = parse(this.props.location.search);
        const columns = [{
            title: __(messages['设备名称']),
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span className="common-link-icon" onClick={() => this.gotoDevice(record)}>{record.name}</span>
            }
        }, {
            title: __(messages['状态']),
            dataIndex: 'status',
            key: 'status',
            width: 80,
            render: (index, record) => {
                switch (record.status) {
                    case "INIT":
                        return <span style={{color: "#FFD02D"}}>{record.status}</span>;
                    case "ONLINE":
                        return <span style={{color: "#0EC80E"}}>{record.status}</span>;
                    case "OFFLINE":
                        return <span style={{color: "#ff0002"}}>{record.status}</span>;
                    default:
                        break;
                }
            }
        }, {
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: __(messages['节点名称']),
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: __(messages['设备类型']),
            dataIndex: 'type',
            key: 'type',
            width: 80,
            render: (text) => {
                return deviceTypeMap(text)
            }
        }, {
            title: __(messages['设备序列号']),
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: "操作",
            dataIndex: 'operation',
            key: 'operation',
            width: 75,
            align: 'center',
            render: (index, record) => {
                return <Dropdown overlay={this.operationMenuRender(index, record)}>
                    <Icon type="ellipsis"/>
                </Dropdown>
            }
        }];

        const option = [
            <Option value="ONLINE" key="ONLINE">ONLINE</Option>,
            <Option value="INIT" key="INIT">INIT</Option>,
            <Option value="OFFLINE" key="OFFLINE">OFFLINE</Option>
        ];

        const optionTwo = [
            <Option value="STEP" key="STEP">BCPE</Option>,
            <Option value="CSTEP" key="CSTEP">HCPE</Option>,
            <Option value="AP" key="AP">AP</Option>,
        ];

        const optionFour = this.props.mi0101Info.companyList.map((company) => {
            return <Option value={company.id} key={company.id}>{company.company_abbr}</Option>
        });
        const optionThree = this.props.mi0101Info.deviceModelList.map((model) => {
            return <Option value={model.model} key={model.id}>{model.model}</Option>
        });

        const modalOptions = {
            title: __(messages["设备迁移"]),
            visible: this.state.deviceModalShow,
            onCancel: this.handleCloseDeviceMoveModal,
            dispatch: this.props.dispatch,
            submitType: "ci0101Info/move_device",
            extraUpdatePayload: {id: this.state.editRecord.id},
            initialValues: {name: this.state.editRecord.name, type: this.state.editRecord.type},
            initPayload: {
                net_type: this.state.net_type || "",
                name: this.state.name || "",
                status: this.state.status || "",
                type: this.state.type,
                model: this.state.model,
                company_id:this.state.company_id,
                page_no: this.state.page_no,
                page_size: this.state.page_size,
            },
            InputItems: [{
                type: "Plain",
                labelName: "设备序列号",
                content: this.state.editRecord.sn,
                height: 32
            }, {
                type: "Radio",
                labelName: "设备类型",
                valName: "type",
                rules: [{required: true, message: "请选择设备类型",}],
                children: [{value: "CSTEP", name: "HCPE", key: "HCPE"}, {
                    value: "STEP",
                    name: "BCPE",
                    key: "BCPE"
                }]
            }, {
                type: "Input",
                labelName: __(messages["设备名称"]),
                valName: "name",
                nativeProps: {
                    placeholder: __(messages["请输入设备名称"]),
                },
                rules: [{required: true, message: __(messages["请输入设备名称"])}, {
                    max: 128,
                    message: __(messages["请输入设备名称最多输入128字符"])
                }],
            }, {
                type: "Plain",
                labelName: "当前所属企业",
                content: this.state.editRecord.company_abbr,
                height: 32
            }, {
                type: "Select",
                labelName: "目标企业",
                valName: "target_company_id",
                nativeProps: {
                    placeholder: "请选择目标企业",
                },
                onChange: (value, modalComponent) => {
                    this.get_agency_list(value);
                    modalComponent.props.form.setFieldsValue({
                        agency_id: undefined
                    })
                },
                rules: [{required: true, message: __(messages["请选择目标节点名称"])}],
                children: this.props.mi0101Info.companyList.map((item) => {
                    return {name: item.company_abbr, value: item.id, key: item.id}
                })
            }, {
                type: "Plain",
                labelName: __(messages["目前节点名称"]),
                content: this.state.editRecord.agency_name,
                height: 32
            }, {
                type: "Select",
                labelName: __(messages["目标节点名称"]),
                valName: "agency_id",
                nativeProps: {
                    placeholder: __(messages["请选择目标节点名称"]),
                },
                rules: [{required: true, message: __(messages["请选择目标节点名称"])}],
                children: this.props.ci0101Info.agencyList.map((item) => {
                    return {name: item.name, value: item.id, key: item.id}
                })
            },]
        };

        const exchangeDeviceModalOption = {
            title: __(messages["设备更换"]),
            visible: this.state.exchangeDeviceModalShow,
            onCancel: this.handleCloseExchangeDeviceModal,
            dispatch: this.props.dispatch,
            submitType: "ci0101Info/exchange_device",
            initPayload: {
                net_type: this.state.net_type || "",
                name: this.state.name || "",
                status: this.state.status || "",
                type: this.state.type,
                company_id:this.state.company_id,
                model: this.state.model,
                page_no: this.state.page_no,
                page_size: this.state.page_size,
            },
            initialValues: {},
            extraUpdatePayload: {old_sn: this.state.editRecord.sn},
            InputItems: [{
                type: "Select",
                labelName: __(messages["设备"]),
                valName: "new_sn",
                nativeProps: {
                    placeholder: __(messages["请选择设备"]),
                    notFoundContent: "无可更换设备",
                },
                children: this.props.ci0101Info.popDeviceList.map((item) => {
                    return {name: item.name + "-" + item.sn, value: item.sn, key: item.id}
                })
            },]
        };
        const MultipleExecute = <div>
            <Select style={{width: 180, marginRight: 8}} placeholder="请选择要执行的命令" onChange={this.handleSelectCommand}>
                {this.props.ci0101Info.cmdList.map((cmd) => {
                    return <Option key={cmd.id} value={cmd.cmd}>{cmd.cmd}</Option>
                })}
            </Select>
            <Button onClick={this.send_command}>批量执行</Button>
        </div>;
        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedSns: selectedRecords.map((item) => {
                        return item.sn
                    })
                })
            }
        };
        return (
            <div>
                <BossDataHeader offLine={this.props.ci0101Info.OFFLINE}
                                init={this.props.ci0101Info.INIT}
                                onLine={this.props.ci0101Info.ONLINE}
                                total={this.props.ci0101Info.INIT + this.props.ci0101Info.OFFLINE + this.props.ci0101Info.ONLINE}
                                checkLink={this.checkLink}
                                TotalLink="设备总数"
                                changeImg={false}
                />
                <Card className="card">
                    <HeaderBar hasDelete={false} hasSelect={true} hasSelectTwo={true} hasSelectThree={true}
                               selectThreePlaceHolder={__(messages["请选择设备型号"])}
                               hasSearch={true} selectOneMethod={this.handleChangeStatus}
                               selectPlaceHolder={__(cMessages['请选择状态'])} submit={this.searchDevice}
                               selectTwoPlaceHolder={__(messages["请选择设备类型"])} optionsThree={optionThree}
                               options={option} optionsTwo={optionTwo} selectTwoMethod={this.handleSelectType}
                               selectTwoDefaultValue={parse(this.props.location.search).type === "BCPE" ? "STEP" : (parse(this.props.location.search).type ? "CSTEP" : undefined)}
                               selectThreeMethod={this.handleSelectModel} selectThreeDefaultValue={search.model}
                               extraSlot={MultipleExecute} selectOneWidth={120} selectTwoWidth={140}
                               selectThreeWidth={140} hasSelectFour={true} selectFourWidth={140}
                               selectFourPlaceHolder="请选择企业" optionsFour={optionFour} selectFourMethod={this.handleSelectCompany}/>
                    <BossTable columns={columns}
                               dataSource={this.props.ci0101Info.deviceData} component={this}
                               getData={this.get_device_list} total={this.props.ci0101Info.total} paging={true}
                               rowSelection={rowSelection}/>
                </Card>
                <BossEditModal {...modalOptions} />
                <BossEditModal {...exchangeDeviceModalOption}/>
            </div>
        )
    }
}

export default injectIntl(MI0101);