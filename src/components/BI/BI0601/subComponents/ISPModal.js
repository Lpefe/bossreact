import React from 'react';
import {connect} from 'dva';
import {Modal, Form} from 'antd';
import HeaderBar from "../../../Common/HeaderBar";
import Operations from "../../../Common/Operations";
import CreateIspModal from "./CreateIspModal";
import BossTable from "../../../Common/BossTable";
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";
class ISPModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifAddIspModalShow: false,
            selectedId: "",
            selectedRecord: {},

        }
    }

    handleOpenCreateIspModal = (record) => {
        this.setState({
            ifAddIspModalShow: true,
            selectedId: record.id,
            selectedRecord: record,
        },function(){
            this.props.dispatch({
                type:"ci1401Info/get_isp_dict",
                payload:{

                }
            })
        })
    };

    handleCloseCreateIspModal = () => {
        this.setState({
            ifAddIspModalShow: false,
            selectedId: "",
            selectedRecord: {},
        })
    };

    delete_isp_of_cstep=(record)=>{
        this.props.dispatch({
            type:"ci1401Info/delete_isp_of_cstep",
            payload:{
                ids:[record.id],
                sn:this.props.sn
            }
        })
    };

    render() {
        const __=this.props.intl.formatMessage;
        const columns = [
            {
                title: __(messages['运营商']),
                dataIndex: 'isp',
                key: 'isp',
            }, {
                title: __(messages['IP地址']),
                dataIndex: 'ip',
                key: 'ip',
            }, {
                title: __(messages['带宽(M)']),
                dataIndex: 'bandwidth',
                key: 'bandwidth',
            }, {
                title: __(messages['备注']),
                dataIndex: 'remark',
                key: 'remark',
            }, {
                title: __(messages['操作']),
                dataIndex: 'operation',
                key: 'operation',
                align: "center",
                width:150,
                render: (index, record) => {
                    return <Operations hasDelete={true} hasEdit={true}
                                       edit={() => this.handleOpenCreateIspModal(record)}
                    delete={()=>this.delete_isp_of_cstep(record)}/>
                }
            }
        ];
        return <Modal maskClosable={false} visible={this.props.visible} title={__(messages["ISP配置"])} onCancel={this.props.cancel} width={700} size="small" footer={null}
                      bordered>
            <HeaderBar hasDelete={false} hasAdd={true} add={this.handleOpenCreateIspModal}/>
            <BossTable columns={columns} dataSource={this.props.ci1401Info.modalDataSource}/>
            <CreateIspModal cancel={this.handleCloseCreateIspModal} sn={this.props.sn}
                            visible={this.state.ifAddIspModalShow} id={this.state.selectedId}
                            record={this.state.selectedRecord}/>
        </Modal>
    }

}

function mapDispatchToProps({ci1401Info}) {
    return {ci1401Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(ISPModal)));