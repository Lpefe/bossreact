/**
 * wifi管理
 **/
import React from 'react';
import {Card, Modal, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import Operations from "../../Common/Operations";
import BossEditModal from "../../Common/BossEditModal";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";

const Option = Select.Option;

class BI1091 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            status:"",
            visible:false,
            editRecord:{},
            wifiId:[],
            selectedIds: [],
            selectedRecords:[],
        };

    }

    componentDidMount() {
       this.getWifi();

    }
    getWifi=()=>{
        this.props.dispatch({
            type: "bi1901Info/getWifi",
            payload: {
                name:this.state.name,
                status:this.state.status
            }
        });
    }
    handleSelectStatus = (value) => {
        this.setState({
            status: value || ""
        }, () => {
            this.getWifi()
        })
    };
    search = (value) => {
        this.setState({
            name: value || ""
        }, ()=>{
            this.getWifi();
        })
    };
    edit = (record)=>{
        this.setState({
            visible:true,
            editRecord:{new_key:record.key,new_ssid:record.ssid},
            wifiId:[record.id]
        })
    }
    closeAddModal=()=>{
        this.setState({
            visible:false,
            editRecord:{},
            wifiId:""
        },function(){
            this.getWifi()
        })
    }
    
    render() {
        const option = [
            <Option value="ONLINE" key="ONLINE">ONLINE</Option>,
            <Option value="INIT" key="INIT">INIT</Option>,
            <Option value="OFFLINE" key="OFFLINE">OFFLINE</Option>
        ];
        const ModalOptions = {
            title:"编辑",
            visible:this.state.visible,
            initialValues:this.state.editRecord,
            dispatch:this.props.dispatch,
            submitType:"bi1901Info/updateWifi",
            onCancel: this.closeAddModal,
            extraUpdatePayload: {ids:this.state.wifiId,},
            InputItems: [{
                type: "Input",
                labelName: "SSID",
                valName: "new_ssid",
                nativeProps: {
                    placeholder: "请输入设备名称"
                },
                rules: [{required: true, message:"请输入设备名称"}],
            }, {
                type: "Input",
                labelName: "密码",
                valName: "new_key",
                nativeProps: {
                    placeholder: "请输入设备名称"
                },
                rules: [{required: true, message:"请输入设备名称"}],
            }, ]
        }
        const columns = [{
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '设备状态',
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
        },{
            title: '企业名称',
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        },{
            title: '节点名称',
            dataIndex: 'agency_name',
            key: 'agency_name',
        },{
            title: '设备型号',
            dataIndex: 'model',
            key: 'model',
        },{
            title: 'SSID(32)',
            dataIndex: 'ssid',
            key: 'ssid',
        },{
            title: '密码',
            dataIndex: 'key',
            key: 'key',
        },{
            title: '操作',
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
        const rowSelection = {
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
                                hasSelect={true}
                                selectPlaceHolder='请选择状态'
                                selectOneWidth={120}
                                selectOneMethod={this.handleSelectStatus}
                                options={option}
                               hasAdd={true}
                               hasDelete={false}
                               add={this.handleOpenAddCompanyModal}
                               submit={this.search}/>
                <BossTable columns={columns} dataSource={this.props.bi1901Info.dataSource} rowSelection={rowSelection}/>
                <BossEditModal {...ModalOptions} />
            </Card>
        )
    }
}

export default injectIntl(BI1091);