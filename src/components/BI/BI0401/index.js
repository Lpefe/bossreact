/**
 * 商务-链路信息*/
import React from 'react';
import '../../CI/CI0101New/index.scss';
import { Select, Card} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import cMessages from "../../../locales/commonMessages";
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';
import {domain} from '../../../utils/commonConsts'
import {parse} from '../../../utils/commonUtilFunc';
import BossDataHeader from "../../Common/BossDataHeader";


const Option = Select.Option;

class BI0401 extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.location.search);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            link_type: "",
            name: "",
            status: search.status||"",
            id: search.id||"",
            deduplication: "",
            assign_type: ""
        }
    }

    componentDidMount() {
        this.get_link_list();
        this.get_link_stat();
    }

    get_link_list = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_list",
            payload: {
                link_type: this.state.link_type,
                name: this.state.name,
                status: this.state.status,
                deduplication: this.state.deduplication,
                assign_type: this.state.assign_type,
                company_id:this.state.id,
            }
        })
    };

    checkLink = (status) => {
        this.props.dispatch({
            type: "ci0201Info/get_link_list",
            payload: {
                link_type: this.state.link_type,
                name: this.state.name,
                status: status,
                deduplication: this.state.deduplication,
                assign_type: this.state.assign_type
            }
        })
    };

    get_link_stat = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_stat",
            payload: {}
        })
    };

    handleSelectStatus = (value) => {
        this.setState({
            status: value || ""
        }, () => {
            this.get_link_list();
        })
    };


    handleSelectType = (value) => {
        this.setState({
            link_type: value || ""
        }, () => {
            this.get_link_list();
        })
    };

    handleSearchSubmit = (value) => {
        this.setState({
            name: value
        }, () => {
            this.get_link_list();
        })
    };

    //根据去重方式筛选
    handleSelectDeDuplication = (value) => {
        this.setState({
            deduplication: value || ""
        }, () => {
            this.get_link_list();
        })
    };

    //根据人工选路筛选
    handleSelectManualLink = (value) => {
        this.setState({
            assign_type: value || ""
        }, () => {
            this.get_link_list();
        })
    };

    gotoLink = (record) => {
        if(!record.device_id){
            return;
        }
        window.open(domain+"/index."+window.appLocale.locale+ ".html#/main/bi0401/bi0402?id=" + record.id + "&from=link&bandwidth=" + record.bandwidth+"&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id)
    };
    render() {
        const __=this.props.intl.formatMessage;
        const columns = [{
            title: __(messages['链路名称']),
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span onClick={()=>this.gotoLink(record)} className={record.device_id?"common-link-icon":""}>{record.name}</span>
            }
        }, {
            title: __(messages['状态']),
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
        }, {
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: __(messages['节点名称']),
            dataIndex: 'branch',
            key: 'branch',
        }, {
            title: __(messages['服务等级']),
            dataIndex: 'grade',
            key: 'grade',
            render: (index, record) => {
                return record.grade === "CLOUD_VPN" ? __(messages["云VPN"]) : (record.grade === "CLOUD_SPLINE" ? __(messages["云专线"]) : __(messages["超级云专线"]))
            }

        }, {
            title: __(messages['链路类型']),
            dataIndex: 'link_type',
            key: 'link_type',
        }, {
            title: __(messages['带宽(M)']),
            dataIndex: 'bandwidth',
            key: 'charge_type',
        }, {
            title: __(messages['RTT基准值'])+'(ms)',
            dataIndex: 'rtt_limit',
            key: 'rtt_limit',
        }, ];

        const pagination = {
            pageSize: 20
        };
        const option = [
            <Option value="ONLINE" key="ONLINE">ONLINE</Option>,
            <Option value="INIT" key="INIT">INIT</Option>,
            <Option value="OFFLINE" key="OFFLINE">OFFLINE</Option>,
        ];

        const optionTwo = [
            <Option value="国内组网" key="国内组网">{__(messages["国内组网"])}</Option>,
            <Option value="全球组网" key="全球组网">{__(messages["全球组网"])}</Option>,
            <Option value="国内SaaS加速" key="国内SaaS加速">{__(messages["国内SaaS加速"])}</Option>,
            <Option value="全球SaaS加速" key="全球SaaS加速">{__(messages["全球SaaS加速"])}</Option>
        ];

        const optionThree = [
            <Option value="ON" key="ON">{__(messages["去重"])}</Option>,
            <Option value="OFF" key="OFF">{__(messages["不去重"])}</Option>,
        ];

        const optionFour = [
            <Option value="manual" key="manual">{__(messages["人工选路"])}</Option>,
            <Option value="auto" key="auto">{__(messages["自动选路"])}</Option>,
        ];

        return (
            <div>

                <BossDataHeader offLine={this.props.ci0201Info.linkStat.OFFLINE}
                                init={this.props.ci0201Info.linkStat.INIT}
                                onLine={this.props.ci0201Info.linkStat.ONLINE}
                                total={this.props.ci0201Info.total}
                                checkLink={this.checkLink}
                                TotalLink="链路总数"
                                changeImg = {true}
                />
                <Card>
                    <HeaderBar hasDelete={false} hasSelect={true} hasSelectTwo={true}
                               hasSearch={true}
                               selectPlaceHolder={__(cMessages['请选择状态'])} selectTwoPlaceHolder={__(messages["请选择链路类型"])}
                               selectOneMethod={this.handleSelectStatus} selectTwoMethod={this.handleSelectType}
                               optionsTwo={optionTwo} options={option} submit={this.handleSearchSubmit}
                               hasSelectThree={true} hasSelectFour={true} selectThreePlaceHolder={__(messages["请选择去重方式"])}
                               selectFourPlaceHolder={__(messages["请选择选路方式"])} selectThreeMethod={this.handleSelectDeDuplication}
                               optionsThree={optionThree}
                               selectFourMethod={this.handleSelectManualLink} optionsFour={optionFour}/>
                    <BossTable pagination={pagination} columns={columns}
                               dataSource={this.props.ci0201Info.dataSource}/>
                </Card>
            </div>
        )
    }
}

export default injectIntl(BI0401);