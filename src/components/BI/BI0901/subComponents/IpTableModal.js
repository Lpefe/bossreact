import React from 'react';
import {connect} from 'dva';
import {Modal, Form} from 'antd';
import HeaderBar from "../../../Common/HeaderBar";
import Operations from "../../../Common/Operations";
import AddIpTableModal from "./AddIpTableModal";
import BossTable from "../../../Common/BossTable";
import {injectIntl} from "react-intl";
import messages from '../LocaleMsg/messages';
class IpTableModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addIptableModalShow: false,
            record: {},
            recordId: ""
        };
    }

    componentDidMount() {

    }

    delete_iptable = (record) => {
        this.props.dispatch({
            type: "bi0901Info/delete_iptable",
            payload: {
                ids: [record.id],
                agency_id:this.props.agency_id,
                company_id:this.props.company_id,
                records:[record]
            }
        })
    };

    handleAddIptableModalShow = (record) => {
        this.setState({
            addIptableModalShow: true,
            record: record,
            recordId: record.id
        })
    };

    cancelAddIptableModalShow = () => {
        this.setState({
            addIptableModalShow: false,
            record: {},
            recordId: ""
        })
    };


    render() {
        const __ = this.props.intl.formatMessage;
        const columns = [{
            title: __(messages['IP段']),
            dataIndex: 'iptable',
            key: 'iptable',
        }, {
            title: __(messages['备注']),
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            width: 150,
            align: "center",
            render: (index, record) => {
                return <Operations hasEdit={true} hasDelete={true} delete={() => this.delete_iptable(record)}
                                   edit={() => this.handleAddIptableModalShow(record)}/>
            }
        },];
        return <Modal visible={this.props.visible} title={__(messages['IP段'])} onCancel={this.props.cancel} destroyOnClose footer={null}>
            <HeaderBar hasAdd={true} add={this.handleAddIptableModalShow}/>
            <BossTable columns={columns} dataSource={this.props.bi0901Info.ipTableList}/>
            <AddIpTableModal visible={this.state.addIptableModalShow} recordId={this.state.recordId}
                             record={this.state.record} cancel={this.cancelAddIptableModalShow} company_id={this.props.company_id} agency_id={this.props.agency_id}/>
        </Modal>
    }
}

function mapDispatchToProps({bi0901Info}) {
    return {bi0901Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(IpTableModal)));