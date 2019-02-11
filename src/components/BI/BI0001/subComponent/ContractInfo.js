import React from 'react';
import { Button, Icon, Form, Modal, Upload} from 'antd';
import './subStyle.scss';
import {connect} from 'dva';
import HeaderBar from "../../../Common/HeaderBar";
import AddContractModal from "./ContractSub/AddContractModal";
import Operations from "../../../Common/Operations";
import BossTable from "../../../Common/BossTable";
import {domain} from "../../../../utils/commonConsts";
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";
class ContractInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifAttachmentModalShow: false,
            record: {},
            ifEditContract: false,
            recordId: ""
        };
        this.isBusiness = sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin"

    }

    componentDidMount() {
        this.get_contract_list();
    }

    get_contract_list = () => {
        this.props.dispatch({
            type: "bi0001Info/get_contract_list",
            payload: {
                company_id: this.props.id
            }
        })
    };

    handleOpenCheckAttachmentModal = (record) => {
        this.setState({
            ifAttachmentModalShow: true,
            record: record,
        },)
    };
    handleCloseCheckAttachmentModal = () => {
        this.setState({
            ifAttachmentModalShow: false,
            record: {},
        })
    };

    hanldeOpenEditContractModal = (record) => {
        this.setState({
            ifEditContract: true,
            record: record,
            recordId: record.id
        })
    };
    hanldeCloseEditContractModal = () => {
        this.setState({
            ifEditContract: false,
        })
    };

    handleUploadComplete = ({file}) => {
        if (file.status === "done") {
            this.get_contract_list();
        }
    };
    deleteContract=(record)=>{
        this.props.dispatch({
            type:"bi0001Info/delete_contract",
            payload:{
                id:record.id,
                company_id:this.props.id,
                record:record,
            }
        })
    };


    render() {
        const __=this.props.intl.formatMessage;
        let columns = [{
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: __(messages['合同名称']),
            dataIndex: 'name',
            key: 'name',
        }, {
            title: __(messages['开始时间']),
            dataIndex: 'begin_time',
            key: 'begin_time',
        }, {
            title: __(messages['结束时间']),
            dataIndex: 'end_time',
            key: 'end_time',
        }, {
            title: __(messages['签订时间']),
            dataIndex: 'time',
            key: 'time',
        }, {
            title: __(messages['附件']),
            dataIndex: 'attachment',
            key: 'attachment',
            align: "center",
            render: (index, record) => {
                return <Icon type="file-text" className="common-link-icon" onClick={() => this.handleOpenCheckAttachmentModal(record)}/>
            }
        }, {
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            render: (index, record) => {
                return <Operations hasDelete={true} hasEdit={true} edit={() => this.hanldeOpenEditContractModal(record)}
                                   delete={() => this.deleteContract(record)}/>
            }
        },
        ];
        return (
            <div>
                <HeaderBar hasDelete={false} hasAdd={true}
                           add={this.hanldeOpenEditContractModal}/>
                <BossTable columns={columns} dataSource={this.props.bi0001Info.contractList}/>
                <Modal visible={this.state.ifAttachmentModalShow} title={__(messages["合同详情"])}
                       onCancel={this.handleCloseCheckAttachmentModal} bodyStyle={{textAlign: "left"}} footer={null}>
                    <Upload onChange={this.handleUploadComplete} beforeUpload={this.handleBeforeUpload}
                            action={domain + "/v1/company/update_contract/"}
                            data={{id: this.state.record.id, company_id: this.props.id}} showUploadList={false}><Button
                        type="primary">{__(messages["上传附件"])}</Button></Upload>
                    <div style={{textAlign: "left", marginTop: 24}}>{
                        this.props.bi0001Info.contractList.map((item)=>{
                            if(item.id===this.state.record.id){
                                return item.file_list ? item.file_list.map((item,index) => {
                                    return <div style={{display: "inline-block",width:"100%"}} key={index}><Icon type="paper-clip"/><span
                                        style={{marginRight: 32}}>{item}</span> <a
                                        href={domain + "/v1/company/download_attachment/?company_id=" + this.props.id + "&contract_id=" + this.state.record.id + "&filename=" + item}>{__(messages["下载"])}</a>
                                    </div>
                                }) : "";

                            }else{
                                return <span key="0"/>
                            }
                        })
                    }</div>
                </Modal>
                <AddContractModal id={this.props.id} visible={this.state.ifEditContract}
                                  cancel={this.hanldeCloseEditContractModal} record={this.state.record}
                                  recordId={this.state.recordId}/>
            </div>)
    }
}

function mapDispatchToProps({bi0001Info}) {
    return {bi0001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(ContractInfo)));