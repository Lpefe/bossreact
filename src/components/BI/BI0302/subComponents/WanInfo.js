import React from 'react';
import {Form} from 'antd';
import {connect} from 'dva';
import BossTable from "../../../Common/BossTable";

class WanInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const columns = [{
            title: 'WAN口',
            dataIndex: 'interface',
            key: 'interface',
        }, {
            title: '运营商',
            dataIndex: 'isp',
            key: 'isp',
        }, {
            title: '带宽(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, {
            title: '接入方式',
            dataIndex: 'intype',
            key: 'intype',
        }, {
            title: '连接状态',
            dataIndex: 'linkstatus',
            key: 'linkstatus',
        }, {
            title: 'IP地址',
            dataIndex: 'ip',
            key: 'ip',
        }, {
            title: '子网掩码',
            dataIndex: 'netmask',
            key: 'netmask',
        },{
            title: '网关地址',
            dataIndex: 'gateway',
            key: 'gateway',
        },{
            title: '首选DNS服务器',
            dataIndex: 'dns',
            key: 'dns',
        },];
        return (
            <div>
                <header className="device-info-header">WAN口信息</header>
                <BossTable columns={columns} dataSource={this.props.ci0102Info.wanInfo}/>
            </div>
        )
    }
}

function mapDispatchToProps({ci0102Info}) {
    return {ci0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(WanInfo));