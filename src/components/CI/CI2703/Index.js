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

class CI2703 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            status:"",
            visible:false,
            editRecord:{},
            editId: "",
            company_id:sessionStorage.getItem("companyId"),
            selectedIds:[],
            selectedRecords:[],
            selectName:""
        };

    }

    componentDidMount() {
       this.getSsidTemplateAgency();
       this.getSsidTemplate();

    }
    getSsidTemplateAgency=()=>{
        this.props.dispatch({
            type: "ci2703Info/get_ssid_template_agency",
            payload: {
                company_id:this.state.company_id,
                name:this.state.selectName
            }
        });
    }
    getAgencyList=(exc_stid)=>{
        this.props.dispatch({
            type: "ci2703Info/get_agency_list",
            payload: {
                company_id:this.state.company_id,
                exc_stid:exc_stid
            }
        });
    }
    getSsidTemplate=()=>{
        this.props.dispatch({
            type: "ci2703Info/get_ssid_template",
            payload: {
                company_id:this.state.company_id
            }
        });
    }
    getCompanyList=()=>{
        this.props.dispatch({
            type: "ci2703Info/get_company_list",
            payload: {

            }
        });
    }
    handleOpenAdd=()=>{
        this.setState({
            visible:true,
        })
        this.getCompanyList()
    }

    search = (value) => {
        this.setState({
            selectName:value||""
        },function(){
            this.props.dispatch({
                type: "ci2703Info/get_ssid_template_agency",
                payload: {
                    company_id:this.state.company_id,
                    name:this.state.selectName
                }})
        })
    };
    edit = (record)=>{
        this.props.dispatch({
            type: "ci2703Info/update_ssid_template_agency",
            payload: {
                record:record,
                ids:[record.id],
                selectName:this.state.selectName,
                companyId:parseInt(this.state.company_id),
            }
        })
    }
    closeAddModal=()=>{
        this.setState({
            visible:false,
            editRecord:{},
            editId: "",
        },function(){
            this.getSsidTemplateAgency()
        })
    }
    delete = (record) => {
        this.props.dispatch({
            type: "ci2703Info/delete_ssid_template_agency",
            payload: {
                records:[record],
                ids: [record.id],
                selectName:this.state.selectName,
                companyId:parseInt(this.state.company_id),
            }
        })
    };
    handleDeleteBatch = () => {
        this.props.dispatch({
            type: "ci2703Info/delete_ssid_template_agency",
            payload: {
                ids: this.state.selectedIds,
                selectName:this.state.selectName,
                records: this.state.selectedRecords,
                companyId:parseInt(this.state.company_id),
            }
        })
    };
    handleUpdate = () => {
        this.props.dispatch({
            type: "ci2703Info/update_ssid_template_agency",
            payload: {
                ids: this.state.selectedIds,
                records: this.state.selectedRecords,
                selectName:this.state.selectName,
                companyId:parseInt(this.state.company_id),
            }
        })
    };
    render() {
        const __ = commonTranslate(this);
        const ModalOptions = {
            title: this.state.editId ? __(messages["编辑"]) :__(messages["新增"]),
            visible: this.state.visible,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci2703Info/update_ssid_template_agency" : "ci2703Info/create_ssid_template_agency",
            onCancel: this.closeAddModal,
            hasSubmitCancel: this.state.editId === undefined,
            extraUpdatePayload: {company_id:sessionStorage.getItem("companyId")},
            initPayload: {
                name:this.state.selectName
            },
            parentVm: this,
            InputItems: [{
                type: "Select",
                labelName: __(messages['SSID模板']),
                valName: "st_id",
                nativeProps: {
                    placeholder: __(messages['请选择SSID模板'])
                },
                rules: [{required: true,}],
                children: this.props.ci2703Info.ssidTemplateList.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.ssid}
                    }
                }),
                onChange: (value, vm) => {
                    this.getAgencyList(value)
                    vm.props.form.setFieldsValue({
                        agency_ids: undefined,
                    });
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
                labelName: 'VLAN',
                valName: "user_type",
                nativeProps: {
                    placeholder: "请选择VLAN"
                },
                rules: [{required: true, message:"请选择VLAN"}],
                children: [{value: "vlan100", name: "vlan100", key: "1"},
                    {value: 'vlan200',name: 'vlan200',key: "0"},{value: "lan",name:"lan",key: "2"}]
            }, {
                type: "Select",
                labelName: __(messages['节点名称']),
                valName: "agency_ids",
                nativeProps: {
                    placeholder: __(messages['请选择节点名称']),mode:"multiple"
                },
                rules: [{required: true,}],
                children: this.props.ci2703Info.agencyList.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.name}
                    }

                })
            }, ]
        };

        const columns = [{
            title: __(messages['SSID模板']),
            dataIndex: 'ssid',
            key: 'ssid',
        },{
            title: __(messages['频段']),
            dataIndex: 'band',
            key: 'band',
        },{
            title: "VLAN",
            dataIndex: 'user_type',
            key: 'user_type',
        },{
            title: __(messages['节点名称']),
            dataIndex: 'agency_name',
            key: 'agency_name',
        },{
            title: __(messages['模板更新']),
            dataIndex: 'to_update',
            key: 'to_update',
            render:(text)=>{
                return text?"有":"无"
            }
        },{
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
        },]
        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys,selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords:selectedRecords,
                })
            }
        };
        return (
            <Card className="card">
                            <HeaderBar hasSearch={true} 
                            selectPlaceHolder={__(messages['请选择状态'])}
                            selectOneWidth={220}
                            hasAdd={true}
                            hasDelete={true}
                            delete={this.handleDeleteBatch}
                            add={this.handleOpenAdd}
                            selectedKeys={this.state.selectedIds}
                            submit={this.search}
                            hasExtraBtnThree={true}
                            extraBtnNameThree={__(messages["批量更新"])}
                            btnThreeFunc={this.handleUpdate}
                            selectOneShowSearch={true}/>
                            
                <BossTable columns={columns} dataSource={this.props.ci2703Info.dataSource} rowSelection={rowSelection}/>
                <BossEditModal {...ModalOptions} />
            </Card>
        )
    }
}

export default injectIntl(CI2703);