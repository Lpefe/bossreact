/**
 * ssid分配
 **/
import React from 'react';
import {Card, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import {commonTranslate} from "../../../utils/commonUtilFunc";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";

const Option = Select.Option;

class BI1903 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            status: "",
            visible: false,
            editRecord: {},
            editId: "",
            company_id: "",
            selectedIds: [],
            selectedRecords: [],
            searchName: "",
            selectCompanyId: ""
        };

    }

    componentDidMount() {
        this.getSsidTemplateAgency();
        this.getCompanyList()
    }

    getSsidTemplateAgency = () => {
        this.props.dispatch({
            type: "bi1903Info/get_ssid_template_agency",
            payload: {
                company_id: this.state.selectCompanyId,
                name: this.state.searchName
            }
        });
    }
    getAgencyList = (exc_stid) => {
        this.props.dispatch({
            type: "bi1903Info/get_agency_list",
            payload: {
                company_id: this.state.company_id,
                exc_stid: exc_stid
            }
        });
    }
    getSsidTemplate = (company_id) => {
        this.props.dispatch({
            type: "bi1903Info/get_ssid_template",
            payload: {
                company_id: company_id
            }
        });
    }
    getCompanyList = () => {
        this.props.dispatch({
            type: "bi1903Info/get_company_list",
            payload: {}
        });
    }
    handleOpenAdd = () => {
        this.setState({
            visible: true,
        })
        this.getCompanyList()
    }

    handleSelectStatus = (value) => {
        this.setState({
            selectCompanyId: value || ""
        }, function () {
            this.props.dispatch({
                type: "bi1903Info/get_ssid_template_agency",
                payload: {
                    company_id: this.state.selectCompanyId,
                    name: this.state.searchName
                }
            })
        })
    };


    search = (value) => {
        this.setState({
            searchName: value || ""
        }, function () {
            this.props.dispatch({
                type: "bi1903Info/get_ssid_template_agency",
                payload: {
                    company_id: this.state.selectCompanyId,
                    name: this.state.searchName
                }
            })
        })
    };
    edit = (record) => {
        this.props.dispatch({
            type: "bi1903Info/update_ssid_template_agency",
            payload: {
                id: {ids: [record.id]},
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
            }
        })
    }
    closeAddModal = () => {
        this.setState({
            visible: false,
            editRecord: {},
            editId: "",
            company_id: ""
        },  ()=> {
            this.getSsidTemplateAgency()
        })
    }
    delete = (record) => {
        this.props.dispatch({
            type: "bi1903Info/delete_ssid_template_agency",
            payload: {
                payload: {
                    ids: [record.id],
                    records: [record]
                },
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
            }
        })
    };
    handleDeleteBatch = () => {
        this.props.dispatch({
            type: "bi1903Info/delete_ssid_template_agency",
            payload: {
                payload: {
                    ids: this.state.selectedIds,
                },
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
            }
        })
    };
    handleUpdate = () => {
        this.props.dispatch({
            type: "bi1903Info/update_ssid_template_agency",
            payload: {
                id: {ids: this.state.selectedIds, records: [this.state.selectedIds]},
                company_id: this.state.selectCompanyId,
                name: this.state.searchName,
            }
        })
    };

    render() {
        const __ = commonTranslate(this);
        var option = []
        this.props.bi1903Info.companyList.map((item) => {
            return option.push(<Option value={item.id} key={item.id}>{item.company}</Option>)
        })

        const ModalOptions = {
            title: this.state.editId ? __(messages["编辑"]) : __(messages["新增"]),
            visible: this.state.visible,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "bi1903Info/update_ssid_template_agency" : "bi1903Info/create_ssid_template_agency",
            onCancel: this.closeAddModal,
            hasSubmitCancel: this.state.editId === undefined,
            extraUpdatePayload: {},
            initPayload: {},
            parentVm: this,
            InputItems: [{
                type: "Select",
                labelName: __(messages['企业名称']),
                valName: "company_id",
                nativeProps: {
                    placeholder: __(messages['请选择企业'])
                },
                rules: [{required: true, message: __(messages['请选择企业'])}],
                children: this.props.bi1903Info.companyList.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.company_abbr}
                    }
                }),
                onChange: (value, vm) => {
                    this.getSsidTemplate(value);
                    vm.props.form.setFieldsValue({
                        st_id: undefined,
                        agency_ids: undefined,

                    });
                    this.setState({
                        company_id: value
                    })
                }
            }, {
                type: "Select",
                labelName: __(messages['SSID模板']),
                valName: "st_id",
                nativeProps: {
                    placeholder: __(messages['请选择SSID模板'])
                },
                rules: [{required: true,}],
                children: this.props.bi1903Info.ssidTemplateList.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.ssid}
                    }
                }),
                onChange: (value, vm) => {
                    this.getAgencyList(value)
                    vm.props.form.setFieldsValue({
                        agency_ids: undefined,
                    });
                    this.setState({
                        company_id: value
                    })
                }
            }, {
                type: "Radio",
                labelName: __(messages["频段"]),
                valName: "band",
                nativeProps: {
                    placeholder: __(messages["请选择频段"])
                },
                rules: [{required: true, message: __(messages["请选择频段"])}],
                children: [{value: "2.4GHz", name: "2.4GHz", key: "1"}, {
                    value: "5GHz",
                    name: "5GHz",
                    key: "0"
                }]
            }, {
                type: "Radio",
                labelName: "VLAN",
                valName: "user_type",
                nativeProps: {
                    placeholder: __(messages["请选择VLAN"])
                },
                rules: [{required: true, message: __(messages["请选择VLAN"])}],
                children: [{value: "vlan100", name: "vlan100", key: "1"},
                    {value: 'vlan200', name: 'vlan200', key: "0"}, {value: "lan", name: "lan", key: "2"}]
            }, {
                type: "Select",
                labelName: __(messages['节点名称']),
                valName: "agency_ids",
                nativeProps: {
                    placeholder: __(messages['请选择节点名称']), mode: "multiple"
                },
                rules: [{required: true,}],
                children: this.props.bi1903Info.agencyList.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.name}
                    }

                })
            },]
        };

        const columns = [{
            title: __(messages['SSID模板']),
            dataIndex: 'ssid',
            key: 'ssid',
        }, {
            title: __(messages['频段']),
            dataIndex: 'band',
            key: 'band',
        }, {
            title: "VLAN",
            dataIndex: 'user_type',
            key: 'user_type',
        }, {
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: __(messages['节点名称']),
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: __(messages['模板更新']),
            dataIndex: 'to_update',
            key: 'to_update',
            render:(text)=>{
                return text?"有":"无"
            }
        }, {
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Operations
                            hasEdit={true} hasDelete={true} delete={() => this.delete(record)}
                            edit={() => this.edit(record)}
                        />
                    </div>
                )
            }
        },];
        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords: selectedRecords,
                })
            }
        };
        return (
            <Card className="card">
                <HeaderBar hasSearch={true}
                           hasSelect={true}
                           selectPlaceHolder={__(messages['请选择状态'])}
                           selectOneWidth={220}
                           selectOneMethod={this.handleSelectStatus}
                           options={option}
                           hasAdd={true}
                           hasDelete={true}
                           delete={this.handleDeleteBatch}
                           add={this.handleOpenAdd}
                           selectedKeys={this.state.selectedIds}
                           submit={this.search}
                           hasExtraBtnThree={true}
                           extraBtnNameThree={__(messages["批量更新"])}
                           btnThreeFunc={this.handleUpdate}
                           filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                           selectOneShowSearch={true}/>

                <BossTable columns={columns} dataSource={this.props.bi1903Info.dataSource} rowSelection={rowSelection}/>
                <BossEditModal {...ModalOptions} />
            </Card>
        )
    }
}

export default injectIntl(BI1903);