/**
 * ssid模板
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

class BI1902 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            status:"",
            visible:false,
            editRecord:{},
            editId: "",
            selectCompanyId:"",
            searchName:"",
            disabled:false,
        };

    }

    componentDidMount() {
       this.getSsidTemplate();
       this.getCompanyList()
    }
    getSsidTemplate=()=>{
        this.props.dispatch({
            type: "bi1902Info/get_ssid_template",
            payload: {
                company_id:this.state.selectCompanyId,
                name:this.state.searchName
            }
        });
    }
    getCompanyList=()=>{
        this.props.dispatch({
            type: "bi1902Info/get_company_list",
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
    handleSelectStatus = (value) => {
        this.setState({
            selectCompanyId:value||""
        },function(){
            this.props.dispatch({
                type: "bi1902Info/get_ssid_template",
                payload: {
                    company_id:this.state.selectCompanyId,
                    name:this.state.searchName
            }})
        })
        
    };
    search = (value) => {
        this.setState({
            searchName:value||""
        },function(){
            this.props.dispatch({
                type: "bi1902Info/get_ssid_template",
                payload: {
                    company_id:this.state.selectCompanyId,
                    name:this.state.searchName
            }})
        })
    };
    edit = (record)=>{
        if(record.encryption==="None"){
            this.setState({
                disabled:true,
            })
        }
        this.getCompanyList()
        this.setState({
            visible:true,
            editRecord: record,
            editId: record.id,
        })
    }
    closeAddModal=()=>{
        this.setState({
            visible:false,
            editRecord:{},
            editId: "",
            disabled:false,
        },function(){
            this.getSsidTemplate()
        })
    }
    delete = (record) => {
        this.props.dispatch({
            type: "bi1902Info/delete_ssid_template",
            payload: {
                ids: [record.id],
                records:[record],
                init:{
                    company_id:this.state.selectCompanyId,
                    name:this.state.searchName
                }
            }
        })
    };
    render() {
        const __ = commonTranslate(this);
        var option = []
        this.props.bi1902Info.companyList.map((item) => {
                return option.push(<Option value={item.id} key={item.id}>{item.company_abbr}</Option>)
            })
        const ModalOptions = {
            title:this.state.editId ? __(messages["编辑"]) :__(messages["新增"]),
            visible:this.state.visible,
            initialValues:this.state.editRecord,
            dispatch:this.props.dispatch,
            submitType:this.state.editId ?"bi1902Info/update_ssid_template":"bi1902Info/create_ssid_template",
            onCancel: this.closeAddModal,
            extraUpdatePayload: {id:this.state.editId},
            initPayload: {company_id:this.state.selectCompanyId,
                name:this.state.searchName},
            InputItems: [{
                type: "Select",
                labelName: __(messages["企业名称"]),
                valName: "company_id",
                nativeProps: {
                    placeholder:__(messages["请选择企业名称"]),
                    disabled:this.state.editId!=="",
                },
                rules: [{required: true, message: __(messages["请选择企业名称"])}],
                children: this.props.bi1902Info.companyList.map((item) => {
                    return {key: "id", value: item.id, name: item.company_abbr}
                })
            },{
                type: "Select",
                labelName: __(messages["认证方式"]),
                valName: "encryption",
                nativeProps: {
                    placeholder:__(messages["请选择认证方式"])
                },
                rules: [{required: true, message: __(messages["请选择认证方式"])}],
                children:[{key: "1", value: "None", name: "None"},{key: "encryption", value: "WPA2-PSK", name: "WPA2-PSK"},
                    {key: "2", value: "WPA-PSK", name: "WPA-PSK"},
                    {key: "3", value: "WPA-PSK/WPA2-PSK", name: "WPA-PSK/WPA2-PSK"},],
                onChange: (value,vm) => {
                    if(value==="None"){
                        this.setState({
                            disabled:true
                        },vm.props.form.setFieldsValue({
                            password: "",
                        }))
                    }else{
                        this.setState({
                            disabled:false
                        },vm.props.form.setFieldsValue({
                            password: this.state.editRecord.password,
                        }))
                    }

                },
            },{
                type: "Input",
                labelName: __(messages["SSID"]),
                valName: "ssid",
                nativeProps: {
                    placeholder: __(messages["请输入SSID"])
                },
                rules: [{required: true, message:__(messages["请输入SSID"])},{max: 32, message: 'SSID最多输入32字符'},{min: 8, message: 'SSID最少输入8字符'}],
            }, {
                type: "Input",
                labelName: __(messages["密码"]),
                valName: "password",
                nativeProps: {
                    placeholder: this.state.disabled?"":__(messages["请输入密码"]),
                    disabled:this.state.disabled,
                },
                rules: [{required: !this.state.disabled, message:__(messages["请输入密码"])},{max: 32, message: '密码最多输入16字符'},{min: 8, message: '密码最少输入8字符'}],

            },
        ]
        }
        const columns = [{
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        },{
            title: __(messages['SSID']),
            dataIndex: 'ssid',
            key: 'ssid',
        },{
            title: __(messages['认证方式']),
            dataIndex: 'encryption',
            key: 'encryption',
        },{
            title: __(messages['密码']),
            dataIndex: 'password',
            key: 'password',
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

        return (
            <Card className="card">
                            <HeaderBar hasSearch={true} 
                            hasSelect={true}
                            selectPlaceHolder={__(messages['请选择企业名称'])}
                            selectOneWidth={220}
                            selectOneMethod={this.handleSelectStatus}
                            options={option}
                            hasAdd={true}
                            hasDelete={false}
                            add={this.handleOpenAdd}
                            submit={this.search}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            selectOneShowSearch={true}/>
                <BossTable columns={columns} dataSource={this.props.bi1902Info.dataSource} />
                <BossEditModal {...ModalOptions} />
            </Card>
        )
    }
}

export default injectIntl(BI1902);