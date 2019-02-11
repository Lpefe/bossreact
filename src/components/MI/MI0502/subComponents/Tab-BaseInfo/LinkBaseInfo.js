import React from 'react';
import './index.scss';
import {Form, Card, Icon} from 'antd';
import {mainBackupMap, parse} from '../../../../../utils/commonUtilFunc';
import TunnelList from '../TunnelList';
import BossTable from "../../../../Common/BossTable";
import {connect} from 'dva';
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import messages from '../../LocaleMsg/messages';
import {injectIntl} from "react-intl";
import {deviceTypeMap} from "../../../../../utils/commonUtilFunc";

class LinkBaseInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkRecord: {},
            ifAddModalShow: false,
            alertInfoShow: false,
        }
    }

    componentDidMount() {
        this.get_link();
        this.get_link_path();
    }


    get_link = () => {
        this.props.dispatch({
            type: "ci0202Info/get_link",
            payload: {
                id: parse(this.props.location.search).id,
            }
        });
    };

    get_link_path = () => {
        this.props.dispatch({
            type: "ci0202Info/get_link_path",
            payload: {
                link_id: parse(this.props.location.search).id,
            }
        });
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
            title: __(messages['设备序列号']),
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
        },{
            title: __(messages['主/备']),
            dataIndex: 'm_b',
            key: 'm_b',
            render:(text)=>{
                return mainBackupMap(text)
            }
        }, {
            title: __(messages['服务等级']),
            dataIndex: 'grade',
            key: 'grade',
        }, {
            title: __(messages['链路类型']),
            dataIndex: 'type',
            key: 'type2',
        }, {
            title: __(messages['计费模式']),
            dataIndex: 'charge_type',
            key: 'charge_type',
        }, {
            title: __(messages['带宽(M)']),
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
        },{
            title: __(messages['人工选路']),
            dataIndex: 'manual-select',
            key: 'manual-select',
            width: 100,
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Icon type="fork"
                              style={record.assign_type === "auto" ? {color: "rgba(0,0,0,0.25)"} : {color: "rgba(0,0,0,0.65)"}}/> {record.assign_type === "auto" ? __(messages["未启用"]) : __(messages["已启用"])}
                    </div>

                )
            }
        }, {
            title: __(messages['智能去重']),
            dataIndex: 'operation',
            key: 'operation',
            width: 100,
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Icon type="safety"
                              style={record.deduplication === "OFF" ? {color: "rgba(0,0,0,0.25)"} : {color: "rgba(0,0,0,0.65)"}}/> {record.deduplication === "OFF" ? __(messages["未启用"]) : __(messages["已启用"])}
                    </div>

                )
            }
        }];

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
                <h3 style={{marginTop: 16}}>{__(messages["链路信息"])}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={linkInfoColumn}
                               dataSource={[this.props.ci0202Info.link_info]}/>
                </Card>
                <h3 style={{marginTop: 16}}>{__(messages["节点信息"])}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={nodeInfoColumns}
                               dataSource={this.props.ci0202Info.agency_list}/>
                </Card>
                <h3 style={{marginTop: 16}}>{__(messages["设备信息"])}</h3>
                <Card className="card">
                    <BossTable bordered={false} pagination={false} columns={deviceInfoColumns}
                               dataSource={this.props.ci0202Info.dataSource}/>
                </Card>
                {sessionStorage.getItem("role") === "company"||sessionStorage.getItem("role") === "companystaff" || sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxpbizadmin" ? "" :
                    <Card>
                        <h3 style={{marginTop: 16}}>{__(messages["路径信息"])}</h3>
                        <div style={{width: 700}}>
                            <TunnelList tunnelData={this.props.ci0202Info.link_path}/>
                        </div>
                    </Card>}
            </div>
        )
    }
}

function mapDispatchToProps({ci0202Info}) {
    return {ci0202Info};
}

const LinkBaseInfoF = Form.create()(withRouter(injectIntl(LinkBaseInfo)));

export default connect(mapDispatchToProps)(LinkBaseInfoF);