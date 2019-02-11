import React from 'react';
import './index.scss';
import {Switch, Select, Modal, Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import Operations from "../../Common/Operations";
import BossTable from "../../Common/BossTable";
import BossEditModal from '../../Common/BossEditModal';
import {validateIp, validatePort} from "../../../utils/commonUtilFunc";
import messages from './LocaleMsg/messages';
import cMessages from '../../../locales/commonMessages';
import {injectIntl} from 'react-intl';
import {BossMessage} from "../../Common/BossMessages";

const Option = Select.Option;

class CI0501 extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            room_id: "",
            name: "", 
            aclConfigId: "",
            editModalShow: false,
            editRecord: {},
            selectedIds: [],
            selectedRecords:[],
            srcIpType: "1",
            dstIpType: "1",
            srcPortType: "1",
            dstPortType: "1",
            hasPort: "1",
        }
    }

    componentDidMount() {
        this.getAclConfigList();
        this.get_ip_groups();
        this.get_port_groups();
    }

    getAclConfigList=()=>{
        this.props.dispatch({
            type:"ci0501Info/getAclConfigList",
            payload:this.state.is_active === undefined ? {
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.name,
            } : {
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.name,
                is_active: this.state.is_active,
            }
        })
    };

    get_ip_groups=()=>{
        this.props.dispatch({
            type:"ci0501Info/get_ip_groups",
            payload:{
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };

    get_port_groups=()=>{
        this.props.dispatch({
            type:"ci0501Info/get_port_groups",
            payload:{
                company_id: sessionStorage.getItem("companyId")
            }
        })
    };


    addAclConfig = () => {
        let vm = this;
        this.setState({
            editModalShow: true
        });
        setTimeout(function () {
            vm.setState({
                srcIpType: "1",
                dstIpType: "1",
                srcPortType: "1",
                dstPortType: "1",
                hasPort: "1",
            })
        }, 0)

    };

    editAclConfig = (record) => {
        let vm = this;
        this.setState({
            editModalShow: true,
            aclConfigId: record.id,
            editRecord: record,
        });
        setTimeout(function () {
            vm.setState({
                srcIpType: record.srcIpType,
                dstIpType: record.dstIpType,
                srcPortType: record.srcPortType,
                dstPortType: record.dstPortType,
                hasPort: record.hasPort,
            })
        }, 0)//这四个参数控制表单的两类输入项的切换,因为setState的异步属性,如果写在一个setState中可能在打开modal之后才会切换type,导致validator报错,故使用setTimeout保证执行顺序,可能把这三个参数写在modal里会好一点.
    };

    cancelModal = () => {
        this.props.form.resetFields();
        this.setState({
            editModalShow: false,
            aclConfigId: "",
            editRecord: {},
        })
    };


    deleteAclConfig = (record) => {
        if (record.is_active) {
            BossMessage(false, "删除失败:仅能删除禁用状态安全配置")
        } else {
            this.props.dispatch({
                type: "ci0501Info/deleteAclConfig",
                payload: {
                    ids: [record.id],
                    company_id: sessionStorage.getItem("companyId"),
                    records:[record]
                }
            })
        }

    };

    searchAclConfig = (value) => {
        this.setState({
            name: value || "",
        }, ()=> {
            this.getAclConfigList();
        })

    };

    handleSelectStatus = (value) => {
        this.setState({
            is_active: value
        },  ()=> {
            this.getAclConfigList();
        })
    };
    switchStatus = (checked, record) => {
        let vm = this;
        Modal.confirm({
            title: '确认要修改所选中安全配置吗?',
            onOk() {
                vm.props.dispatch({
                    type: "ci0501Info/switchStatus",
                    payload: {
                        is_active: checked,
                        id: record.id,
                        record:record,
                    }
                })
            },
            onCancel() {

            },
        });

    };

    deleteAclConfigBatch = () => {
        this.props.dispatch({
            type: "ci0501Info/deleteAclConfig",
            payload: {
                ids: this.state.selectedIds,
                company_id: sessionStorage.getItem("companyId"),
                records:this.state.selectedRecords,
            }
        })
    };

    batch_change_acl_activity_on = () => {
        this.props.dispatch({
            type: "ci0501Info/batch_change_acl_activity",
            payload: {
                ids: this.state.selectedIds,
                company_id: sessionStorage.getItem("companyId"),
                is_active: true,
                records:this.state.selectedRecords,
            }
        })
    };

    batch_change_acl_activity_off = () => {
        this.props.dispatch({
            type: "ci0501Info/batch_change_acl_activity",
            payload: {
                ids: this.state.selectedIds,
                company_id: sessionStorage.getItem("companyId"),
                is_active: false,
                records:this.state.selectedRecords,
            }
        })
    };

    render() {
        const __ = this.props.intl.formatMessage;
        const columns = [{
            title: __(messages.priority),
            dataIndex: 'priority',
            key: 'priority',
            width: 75,
        }, {
            title: __(messages.strategyNm),
            dataIndex: 'name',
            key: 'name',
            width: 250
        }, {
            title: __(messages.srcIp),
            dataIndex: 'src_ip_rule',
            key: 'src_ip_rule',
            render: (index, record) => {
                if (record.src_ip_group.length > 0) {
                    return record.src_ip_group_names.join(',')
                } else {
                    return record.src_ip_rule
                }
            }
        }, {
            title: __(messages.dstIp),
            dataIndex: 'dst_ip_rule',
            key: 'dst_ip_rule',
            render: (index, record) => {
                if (record.dst_ip_group.length > 0) {
                    return record.dst_ip_group_names.join(',')
                } else {
                    return record.dst_ip_rule;
                }
            }

        }, {
            title: __(messages.srcPort),
            dataIndex: 'src_port',
            key: 'src_port',
            width: 100,
            render: (index, record) => {
                if (record.src_port_group.length > 0) {
                    return record.src_port_group_names.join(',')
                } else {
                    return record.src_port
                }
            }
        }, {
            title: __(messages.dstPort),
            dataIndex: 'dst_port',
            key: 'dst_port',
            width: 100,
            render: (index, record) => {
                if (record.dst_port_group.length > 0) {
                    return record.dst_port_group_names.join(',')
                } else {
                    return record.dst_port
                }
            }
        }, {
            title: __(messages.protocol),
            dataIndex: 'protocol',
            key: 'protocol',
            width: 75,
        }, {
            title: __(messages.action),
            dataIndex: 'action',
            key: 'action',
            width: 75,
        }, {
            title: __(messages.status),
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (index, record) => {
                return <Switch checkedChildren={__(messages.open)} unCheckedChildren={__(messages.close)}
                               checked={record.is_active}
                               onChange={(checked) => this.switchStatus(checked, record)}/>
            }
        }, {
            title: __(messages.operation),
            dataIndex: 'operation',
            key: 'operation',
            width: 100,
            align: "center",
            render: (index, record) => {
                return (
                    <Operations hasExtra={false} hasDelete={true} hasEdit={true}
                                edit={() => this.editAclConfig(record)} delete={() => this.deleteAclConfig(record)}/>
                )
            }
        }];


        const pagination = {
            pageSize: 20
        };

        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys,selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords:selectedRecords
                })
            }
        };
        const options = [
            <Option key="1" value={1}>{__(cMessages['启用'])}</Option>,
            <Option key="0" value={0}>{__(cMessages['禁用'])}</Option>
        ];

        const ModalOptions = {
            title: this.state.appConfigId ? "编辑应用配置" : "新增应用配置",
            visible: this.state.editModalShow,
            onCancel: this.cancelModal,
            dispatch: this.props.dispatch,
            submitType: this.state.aclConfigId ? "ci0501Info/editAclConfig" : "ci0501Info/createAclConfig",
            extraUpdatePayload: {company_id: sessionStorage.getItem("companyId"), id: this.state.aclConfigId,},
            initialValues: Object.assign({}, this.state.editRecord),
            initPayload: {
                company_id: sessionStorage.getItem("companyId")
            },
            InputItems: [{
                type: "InputNumber",
                labelName: __(messages.priority),
                valName: "priority",
                nativeProps: {
                    placeholder: __(messages.priorityInput),//priorityInput
                    min: 1,
                    max: 65535,
                    style: {width: 130}
                },
                rules: [{required: true, message: "请输入优先级"}],
            }, {
                type: "Input",
                labelName: __(messages.aclNm),
                valName: "name",
                nativeProps: {
                    placeholder: __(messages.aclNmInput)
                },
                rules: [{required: true, message: __(messages.aclNmInput)}, {
                    max: 50,
                    message: __(messages.aclNmInput)
                }],
            }, {
                type: "Select",
                labelName: __(messages.protocol),
                valName: "protocol",
                nativeProps: {
                    placeholder: __(messages.selectProtocol),
                },
                rules: [{required: true, message: __(messages.selectProtocol)}],
                children: [{key: "IP", value: "IP", name: "IP"}, {key: "TCP", value: "TCP", name: "TCP"}, {
                    key: "UDP",
                    value: "UDP",
                    name: "UDP"
                }, {key: "ICMP", value: "ICMP", name: "ICMP"}],
                onChange: (value) => {
                    if (value === "IP" || value === "ICMP") {
                        this.setState({
                            hasPort: "0"
                        })
                    } else {
                        this.setState({
                            hasPort: "1"
                        })
                    }
                }
            }, {
                type: "Radio",
                labelName: __(messages.srcIp),
                valName: "srcIpType",
                nativeProps: {},
                rules: [{required: true}],
                children: [{key: "1", value: "1", name: __(cMessages["ip段"])}, {key: "2", value: "2", name: __(cMessages["ip组"])}],
                onChange: (e) => {
                    this.setState({
                        srcIpType: e.target.value,
                    })
                }
            }, this.state.srcIpType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "src_ip_rule",
                nativeProps: {
                    placeholder: __(messages.srcIpInput)
                },
                rules: [{required: true, message: __(messages.srcIpInput)}, {validator: validateIp}],
            } : {
                type: "Select",
                labelName: "",
                valName: "src_ip_group",
                nativeProps: {
                    placeholder: __(messages.srcIpGroupInput),
                    mode: "multiple"
                },
                rules: [{required: true, message: __(messages.srcIpGroupInput)}],
                children: this.props.ci0501Info.ipGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })
            }, this.state.hasPort === "1" ? {
                type: "Radio",
                labelName: __(messages.srcPort),
                valName: "srcPortType",
                nativeProps: {},
                rules: [{required: true}],
                children: [{key: "1", value: "1", name: __(cMessages["port段"])}, {
                    key: "2",
                    value: "2",
                    name: __(cMessages["port组"])
                }],
                onChange: (e) => {
                    this.setState({
                        srcPortType: e.target.value,
                    })
                }
            } : {}, this.state.hasPort === "1" ? this.state.srcPortType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "src_port",
                nativeProps: {
                    placeholder: __(messages.srcPortInput)
                },
                rules: [{required: true, message: __(messages.srcPortInput)}, {validator: validatePort}],
            } : {
                type: "Select",
                labelName: "",
                valName: "src_port_group",
                nativeProps: {
                    placeholder: __(messages.srcPortGroupInput),
                    mode: "multiple"
                },
                rules: [{required: true, message: __(messages.srcPortGroupInput)}],
                children: this.props.ci0501Info.portGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })
            } : {}, {
                type: "Radio",
                labelName: __(messages.dstIp),
                valName: "dstIpType",
                nativeProps: {},
                rules: [{required: true}],
                children: [{key: "1", value: "1", name: __(cMessages["ip段"])}, {key: "2", value: "2", name:__(cMessages["ip组"])}],
                onChange: (e) => {
                    this.setState({
                        dstIpType: e.target.value,
                    })
                }
            }, this.state.dstIpType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "dst_ip_rule",
                nativeProps: {
                    placeholder: __(messages.dstIpInput)
                },
                rules: [{required: true, message: __(messages.dstIpInput)}, {validator: validateIp}],
            } : {
                type: "Select",
                labelName: "",
                valName: "dst_ip_group",
                nativeProps: {
                    placeholder: __(messages.dstIpGrpInput),
                    mode: "multiple"
                },
                rules: [{required: true, message: __(messages.dstIpGrpInput),}],
                children: this.props.ci0501Info.ipGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })

            }, this.state.hasPort === "1" ? {
                type: "Radio",
                labelName: __(messages.dstPort),//dstPort
                valName: "dstPortType",
                nativeProps: {},
                rules: [{required: true}],
                children: [{key: "1", value: "1", name:__(cMessages["port段"])}, {key: "2", value: "2", name:__(cMessages["port组"])}],
                onChange: (e) => {
                    this.setState({
                        dstPortType: e.target.value,
                    })
                }
            } : {}, this.state.hasPort === "1" ? this.state.dstPortType === "1" ? {
                type: "GroupInput",
                labelName: "",
                valName: "dst_port",
                nativeProps: {
                    placeholder: __(messages.dstPortInput)//dstPortInput
                },
                rules: [{required: true, message: "请输入目标端口"}, {validator: validatePort}],
            } : {
                type: "Select",
                labelName: "",
                valName: "dst_port_group",
                nativeProps: {
                    placeholder: "请选择目标端口组",
                    mode: "multiple"
                },
                rules: [{required: true, message: "请选择目标端口组"}],
                children: this.props.ci0501Info.portGroupData.map((item) => {
                    return {key: item.id.toString(), value: item.id, name: item.name}
                })

            } : {}, {
                type: "Select",
                labelName: __(messages.action),
                valName: "action",
                nativeProps: {
                    placeholder: __(messages.actionInput),
                },
                rules: [{required: true, message: __(messages.actionInput),}],
                children: [
                    {key: "ACCEPT", value: "ACCEPT", name: "ACCEPT"}, {key: "DROP", value: "DROP", name: "DROP"}
                ]
            },]
        };

        return (

            <Card className="card">
                <HeaderBar hasAdd={true} hasDelete={true} hasSearch={true} hasSelect={true} selectPlaceHolder={__(cMessages['请选择状态'])}
                           add={this.addAclConfig} submit={this.searchAclConfig}
                           selectOneMethod={this.handleSelectStatus} options={options}
                           delete={this.deleteAclConfigBatch} selectedKeys={this.state.selectedIds} hasExtraBtn={true}
                           extraBtnName={__(messages.batchClose)} hasExtraBtnTwo={true}
                           extraBtnNameTwo={__(messages.batchOpen)}
                           extraConfirmMethodTwo={this.batch_change_acl_activity_on}
                           extraConfirmMethod={this.batch_change_acl_activity_off}
                           confirmTitle={__(messages.closeAclConfirm)} confirmContent="" confirmContentTwo=""
                           confirmTitleTwo={__(messages.openAclConfirm)}
                />
                <BossTable pagination={pagination} columns={columns}
                           dataSource={this.props.ci0501Info.dataSource} rowSelection={rowSelection}/>
                <BossEditModal {...ModalOptions}/>
            </Card>
        )
    }
}

export default injectIntl(CI0501);