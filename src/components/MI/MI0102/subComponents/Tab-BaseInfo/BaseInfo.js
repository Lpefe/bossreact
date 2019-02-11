import React from 'react';
import BossTable from "../../../../Common/BossTable";
import TunnelList from "./TunnelList";
import {Radio, Form, Card} from 'antd';
import {connect} from 'dva';
import moment from "moment";
import {injectIntl} from "react-intl";
import messages from "../../LocaleMsg/messages";
import {deviceTypeMap} from "../../../../../utils/commonUtilFunc";
const RadioGrp = Radio.Group;

class BaseInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    handleSelectLink = (e) => {
        this.props.dispatch({
            type: "mi0102Info/handleSelectLink",
            payload: {
                link_id: e.target.value
            }
        })
    };

    render() {
        const __=this.props.intl.formatMessage;
        const deviceInfoColumns = [{
            title: __(messages['设备类型']),
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                return deviceTypeMap(text)
            }
        }, {
            title: __(messages['型号']),
            dataIndex: 'model',
            key: 'model',
        }, {
            title: __(messages['设备名称']),
            dataIndex: 'name',
            key: 'name',
        }, {
            title: __(messages['所在节点']),
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: __(messages['状态']),
            dataIndex: 'status',
            key: 'status',
        }, {
            title: __(messages['部署方式']),
            dataIndex: 'mode',
            key: 'mode',
        }, {
            title: __(messages['持续工作时间']),
            dataIndex: 'run_time',
            key: 'run_time',
        }, {
            title: __(messages['序列号']),
            dataIndex: 'sn',
            key: 'sn',
        },];

        const linkInfoColumn = [{
            title: __(messages['创建时间']),
            dataIndex: 'create_time',
            key: 'create_time',
            render: (index, record) => {
                return record.create_time ? moment(record.create_time).format("YYYY-MM-DD HH:mm:ss") : ""
            }
        }, {
            title: __(messages['链路名称']),
            dataIndex: 'name',
            key: 'name',
        }, {
            title: __(messages['链路状态']),
            dataIndex: 'status',
            key: 'status',
        }, {
            title: __(messages['服务等级']),
            dataIndex: 'grade',
            key: 'grade',
            render: (index, record) => {
                return record.grade === "CLOUD_VPN" ? __(messages["云VPN"]) : (record.grade === "CLOUD_SPLINE" ? __(messages["云专线"]) : __(messages["超级云专线"]))
            }
        }, {
            title: __(messages['链路类型']),
            dataIndex: 'type',
            key: 'type2',
        }, {
            title: __(messages['计费模式']),
            dataIndex: 'charge_type',
            key: 'charge_type',
        }, {
            title: __(messages["带宽"])+'(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        },{
            title: __(messages['RTT基准值'])+"(ms)",
            dataIndex: 'rtt_limit',
            key: 'rtt_limit',
        },{
            title: __(messages['协议']),
            dataIndex: 'path_proto',
            key: 'path_proto',
            render:(text)=>{
                const protoMap={
                    "1":"TCP",
                    "2":"UDP",
                    "3":"TCP+UDP"
                };
                return protoMap[text]
            }
        },];

        const nodeInfoColumns = [{
            title: __(messages['节点类型']),
            dataIndex: 'type',
            key: 'type',
            render: (index, record) => {
                return record.type === "STEP" ? __(messages["边缘"]) : __(messages["中心"])
            }
        }, {
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: __(messages['名称']),
            dataIndex: 'name',
            key: 'name',
        }, {
            title: __(messages['IP/IP段']),
            dataIndex: 'iptables',
            key: 'iptables',
        }, {
            title: __(messages['外网IP']),
            dataIndex: 'isp',
            key: 'isp',
        }, {
            title: __(messages['所在国家']),
            dataIndex: 'level1_name',
            key: 'level1_name',
        }, {
            title: __(messages['所属城市']),
            dataIndex: 'level3_name',
            key: 'level3_name',
        }];
        return (
            <div>
                {this.props.type === "STEP" ?
                    <RadioGrp value={this.props.mi0102Info.selectedLinkId} onChange={this.handleSelectLink}>
                        {this.props.mi0102Info.linkList.map((item) => {
                            return <Radio key={item.id} value={item.id}>{item.name}</Radio>
                        })}
                    </RadioGrp> : ""}
                {this.props.type === "STEP" && this.props.mi0102Info.linkList.length > 0 ?
                    <h3 style={{marginTop: 16}}>{__(messages["链路信息"])}</h3> : ""}
                {this.props.type === "STEP" && this.props.mi0102Info.linkList.length > 0 ?
                    <Card className="card"><BossTable bordered={false} pagination={false} columns={linkInfoColumn}
                                                      dataSource={this.props.mi0102Info.linkInfo}/></Card> : ""}
                <h3 style={{marginTop: 16}}>{__(messages["节点信息"])}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={nodeInfoColumns}
                               dataSource={this.props.type === "STEP" ? (this.props.mi0102Info.agencyinfo.length === 0 ? [this.props.mi0102Info.deviceInfo] : this.props.mi0102Info.agencyinfo) : [this.props.mi0102Info.deviceInfo]}/></Card>
                <h3 style={{marginTop: 16}}>{__(messages["设备信息"])}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={deviceInfoColumns}
                               dataSource={this.props.type ==="STEP" ? (this.props.mi0102Info.deviceList.length > 0 ? this.props.mi0102Info.deviceList : [this.props.mi0102Info.deviceInfo]) : [this.props.mi0102Info.deviceInfo]}/>
                </Card>
                {this.props.type === "STEP" && this.props.mi0102Info.linkList.length > 0 &&(sessionStorage.getItem('role')!=="company"&&sessionStorage.getItem('role')!=="companystaff")?
                    <h3 style={{marginTop: 16}}>{__(messages["路径信息"])}</h3> : ""}
                {this.props.type === "STEP" && this.props.mi0102Info.linkList.length > 0&&(sessionStorage.getItem('role')!=="company"&&sessionStorage.getItem('role')!=="companystaff") ? <Card className="card">
                    <div style={{width: 700}}>
                        <TunnelList tunnelData={this.props.mi0102Info.link_path}/>
                    </div>
                </Card> : ""}
            </div>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(injectIntl(BaseInfo)));