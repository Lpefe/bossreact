/**
 * wifi设备
 **/
import React from 'react';
import {Card, Select,Modal} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import messages from './LocaleMsg/messages';
import {commonTranslate} from "../../../utils/commonUtilFunc";
import {injectIntl} from "react-intl";
const Option = Select.Option;
class BI1904 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible:false,
            editRecord: {},
            editId: "",
            disabled:false,
            configvisible:false,
            selectStatus:"",
            searchName:""
        };

    }
    componentDidMount() {
        this.get_wifi();
        this.props.dispatch({
            type: "bi1904Info/get_company_list",
            payload: {

            }
        });
     }
    get_wifi=()=>{
        this.props.dispatch({
            type: "bi1904Info/get_wifi",
            payload: {
                company_id:this.state.selectStatus,
                name:this.state.searchName
            }
        });
    }
    edit = (record)=>{
        if(record.encryption==="none"){
            this.setState({
                disabled:true,
            })
        }
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
            this.get_wifi()
        })
    }
    search = (value) => {
        this.setState({
            searchName:value?value:""
        },function(){
            this.get_wifi()
        })
    };
    configCancel=()=>{
        this.setState({
            configvisible:false
        },function(){
            this.get_wifi()
        })
    }
    gotoConfig = (value) =>{
        this.props.dispatch({
            type: "bi1904Info/get_wifi_config_file",
            payload: {
                sn:value.sn
            }}).then(
                this.setState({
                    configvisible:true
                })
            )
    }
    configSubmit = ()=>{
        this.setState({
            configvisible:false
        })
    }
    handleSelectStatus = (value) => {
        this.setState({
            selectStatus:value?value:""
        },  function(){
                this.get_wifi()
            }
        )

    };
    render() {
        const __ = commonTranslate(this);
        var option = []
        console.log(this.props.bi1904Info.companyList)
        this.props.bi1904Info.companyList.map((item) => {
                return option.push(<Option value={item.id} key={item.id}>{item.company_abbr}</Option>)
            })

        const columns = [{
            title: __(messages['设备名称']),
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span className="common-link-icon" onClick={() => this.gotoConfig(record)}>{record.name}</span>
            }
        },{
            title: __(messages['状态']),
            dataIndex: 'status',
            key: 'status',
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
            dataIndex: 'key',
            key: 'key',
        },{
            title: __(messages['信道']),
            dataIndex: 'channel',
            key: 'channel',
        },{
            title: __(messages['频段']),
            dataIndex: 'hwmode',
            key: 'hwmode',
        },{
            title: 'VLAN',
            dataIndex: 'network',
            key: 'network',
        }, {
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        },{
            title: __(messages['节点名称']),
            dataIndex: 'agency_name',
            key: 'agency_name',
        },{
            title: __(messages['设备型号']),
            dataIndex: 'model',
            key: 'model',
        },{
            title: __(messages['设备序列号']),
            dataIndex: 'sn',
            key: 'sn',
        },{
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Operations 
                        hasEdit={true} edit={() => this.edit(record)}
                        />
                    </div>
                )
            }
        },]
        const ghzChannel2_4=[
            {key: "channel", value: "none", name: "AUTO"},
            {key: "1", value: "1", name: "1"},
            {key: "2", value: "2", name: "2"},
            {key: "3", value: "3", name: "3"},
            {key: "4", value: "4", name: "4"},
            {key: "5", value: "5", name: "5"},
            {key: "6", value: "6", name: "6"},
            {key: "7", value: "7", name: "7"},
            {key: "8", value: "8", name: "8"},
            {key: "9", value: "9", name: "9"},
            {key: "0", value: "10", name: "10"},
            {key: "11", value: "11", name: "11"}]

        const ghzChannel5=[
            {key: "1", value: "none", name: "AUTO"},
            {key: "2", value: "36", name: "36"},
            {key: "3", value: "40", name: "40"},
            {key: "4", value: "44", name: "44"},
            {key: "5", value: "48", name: "48"},
            {key: "6", value: "149", name: "149"},
            {key: "7", value: "153", name: "153"},
            {key: "8", value: "157", name: "157"},
            {key: "9", value: "161", name: "161"},
            {key: "0", value: "165", name: "165"},
           ]
        const ModalOptions={
            title: __(messages["个性化配置"]),
            visible: this.state.visible,
            initialValues: this.state.editRecord,
            dispatch: this.props.dispatch,
            submitType:"bi1904Info/update_wifi" ,
            onCancel: this.closeAddModal,
            hasSubmitCancel: this.state.editId === undefined,
            extraUpdatePayload: {
                ids:[this.state.editRecord.id],
                records:[this.state.editRecord]
            },
            initPayload: {
                company_id:this.state.selectStatus,
                name:this.state.searchName
            },
            parentVm: this,
            InputItems: [{
                type: "Input",
                labelName: __(messages['SSID']),
                valName: "ssid",
                rules: [{required: true,}],
                nativeProps: {
                    disabled:true,
                },
            },{
                type: "Input",
                labelName: __(messages['频段']),
                valName: "hwmode",
                rules: [{required: true,}],
                nativeProps: {
                    disabled:true,
                },
            },{
                type: "Select",
                labelName: __(messages["认证方式"]),
                valName: "encryption",
                nativeProps: {
                    placeholder:__(messages["请选择认证方式"])
                },
                rules: [{required: true, message: __(messages["请选择认证方式"])}],
                children:[
                    {key: "1", value: "None", name: "None"},{key: "encryption", value: "WPA2-PSK", name: "WPA2-PSK"},
                    {key: "2", value: "WPA-PSK", name: "WPA-PSK"},
                    {key: "3", value: "WPA-PSK/WPA2-PSK", name: "WPA-PSK/WPA2-PSK"},],
                onChange: (value, vm) => {
                    if(value==="none"){
                        this.setState({
                            disabled:true
                        },vm.props.form.setFieldsValue({
                            key: "",
                        }))
                    }else{
                        this.setState({
                            disabled:false
                        },vm.props.form.setFieldsValue({
                            key: this.state.editRecord.key,
                        }))
                    }
                }
            },{
                type: "Input",
                labelName: __(messages['密码']),
                valName: "key",
                rules: [{required: !this.state.disabled,}, {min: 8, message: __(messages['密码长度不得小于8位'])}],
                nativeProps: {
                    disabled:this.state.disabled,
                },
            },{
                type: "Select",
                labelName: __(messages["信道"]),
                valName: "channel",
                nativeProps: {
                    placeholder:__(messages["请选择信道"])
                },
                rules: [{required: true, message: __(messages["请选择信道"])}],
                children:this.state.editRecord.channel===2.4?ghzChannel2_4:ghzChannel5,

            },
        ]
        };
        return (
            <Card className="card">
 <HeaderBar hasSearch={true} 
                            hasSelect={true}
                            selectPlaceHolder='请选择企业'
                            selectOneWidth={220}
                            selectOneMethod={this.handleSelectStatus}
                            options={option}
                            hasDelete={false}
                            submit={this.search}
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                            selectOneShowSearch={true}/> 
                <BossTable columns={columns} dataSource={this.props.bi1904Info.dataSource} />
                <BossEditModal {...ModalOptions} />
                {/* 点击设备名称弹出wifi配置 */}
                <Modal          
                title="WIFI Config"
                visible={this.state.configvisible}
                onOk={this.configSubmit}
                onCancel={this.configCancel}>
                    <div dangerouslySetInnerHTML={{__html:this.props.bi1904Info.configSource}}></div>
                </Modal>
            </Card>
        )
    }
}

export default injectIntl(BI1904);