/**
 * 客户-链路信息*/
import React from 'react';
import '../CI0101New/index.scss';
import {Card, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import cMessages from "../../../locales/commonMessages";
import {injectIntl} from "react-intl";
import messages from "./LocaleMsg/messages";
import {domain} from "../../../utils/commonConsts";
import BossDataHeader from "../../Common/BossDataHeader";

const Option = Select.Option;

class CI0201 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            type: "",
            name: "",
            status: "",
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
                company_id: sessionStorage.getItem("companyId"),
                type: this.state.type,
                name: this.state.name,
                status: this.state.status,
            }
        })
    };

    get_link_stat = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_stat",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
            }
        })
    };

    handleSelectStatus = (value) => {
        this.setState({
            status: value || ""
        }, () => {
            this.props.dispatch({
                type: "ci0201Info/get_link_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    type: this.state.type,
                    name: this.state.name,
                    status: this.state.status,
                }
            })
        })
    };


    handleSelectType = (value) => {
        this.setState({
            type: value || ""
        }, () => {
            this.props.dispatch({
                type: "ci0201Info/get_link_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    type: this.state.type,
                    name: this.state.name,
                    status: this.state.status,
                }
            })
        })
    };

    handleSearchSubmit = (value) => {
        this.setState({
            name: value
        }, () => {
            this.props.dispatch({
                type: "ci0201Info/get_link_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    type: this.state.type,
                    name: this.state.name,
                    status: this.state.status,
                }
            })
        })

    };

    checkLink = (status) => {
        this.props.dispatch({
            type: "ci0201Info/get_link_list",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                type: this.state.type,
                name: this.state.name,
                status: status,
            }
        })
    };

    gotoLink=(record)=>{
        if(!record.device_id){
            return;
        }
        window.open(domain+"/index."+window.appLocale.locale+".html#/main/mi0501/mi0502?id=" + record.id +"&from=link&bandwidth=" + record.bandwidth+ "&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id)
    };

    render() {
        const __ = this.props.intl.formatMessage;
        const columns = [{
            title: __(messages['链路名称']),
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span onClick={()=>this.gotoLink(record)} className={record.device_id?"common-link-icon":""}>
                    {record.name}
                </span>
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
            title: __(messages['节点名称']),
            dataIndex: 'branch',
            key: 'branch',
        }, {
            title: __(messages['链路类型']),
            dataIndex: 'type',
            key: 'type',
        }, {
            title: __(messages['带宽']) + '(M)',
            dataIndex: 'bandwidth',
            key: 'charge_type',
        }];

        const pagination = {
            pageSize: 20
        };
        const option = [
            <Option value="ONLINE" key="ONLINE">ONLINE</Option>,
            <Option value="INIT" key="INIT">INIT</Option>,
            <Option value="OFFLINE" key="OFFLINE">OFFLINE</Option>
        ];

        const optionTwo = [
            <Option value="国内组网" key="国内组网">{__(messages['国内组网'])}</Option>,
            <Option value="全球组网" key="全球组网">{__(messages['全球组网'])}</Option>,
            <Option value="国内SaaS加速" key="国内SaaS加速">{__(messages['国内SaaS加速'])}</Option>,
            <Option value="全球SaaS加速" key="全球SaaS加速">{__(messages['全球SaaS加速'])}</Option>
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
                <Card className="card" style={{marginBottom: 32}}>
                    <HeaderBar hasDelete={false} hasSelect={true} hasSelectTwo={true}
                               hasSearch={true}
                               selectPlaceHolder={__(cMessages['请选择状态'])} selectTwoPlaceHolder={__(messages['请选择链路类型'])}
                               selectOneMethod={this.handleSelectStatus} selectTwoMethod={this.handleSelectType}
                               optionsTwo={optionTwo} options={option} submit={this.handleSearchSubmit}/>
                    <BossTable pagination={pagination} columns={columns}
                               dataSource={this.props.ci0201Info.dataSource}/>
                </Card>
            </div>

        )
    }
}

export default injectIntl(CI0201);