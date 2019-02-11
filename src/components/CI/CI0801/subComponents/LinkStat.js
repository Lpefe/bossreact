import React from 'react';

import {Select,} from 'antd';
import HeaderBar from "../../../Common/HeaderBar";
import {connect} from 'dva';
import {Link} from 'react-router-dom';
import BossTable from "../../../Common/BossTable";
import messages from '../LocaleMsg/message';
import {injectIntl} from 'react-intl';
const Option = Select.Option;

class LinkStat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            type: "",
            name: "",
            status: "",
        }
    }

    componentDidMount() {
        let vm = this;
        setTimeout(function () {
            vm.get_link_list()
        }, 0)
    }

    get_link_list = () => {
        this.props.dispatch({
            type: "ci0201Info/get_link_list",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                link_type: this.state.type,
                name: this.state.name,
                status: this.state.status,
            }
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
                    link_type: this.state.type,
                    name: this.state.name,
                    status: this.state.status,
                }
            })
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
                    link_type: this.state.type,
                    name: this.state.name,
                    status: this.state.status,
                }
            })
        })
    };

    handleSubmit = (value) => {
        this.setState({
            name: value || ""
        }, () => {
            this.props.dispatch({
                type: "ci0201Info/get_link_list",
                payload: {
                    company_id: sessionStorage.getItem("companyId"),
                    link_type: this.state.type,
                    name: this.state.name,
                    status: this.state.status,
                }
            })
        })
    };


    render() {
        const __ = this.props.intl.formatMessage;
        const pagination = {
            pageSize: 20
        };

        const columns = [{
            title:__(messages.linkName),
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <Link to={{
                    pathname: "/main/mi0501/mi0502",
                    search: "?id=" + record.id + "&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id
                }}>{record.name}</Link>
            }
        }, {
            title: __(messages.status),
            dataIndex: 'status',
            key: 'status', render: (index, record) => {
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
            title: __(messages.nodeName),
            dataIndex: 'branch',
            key: 'branch',
        }, {
            title: __(messages.linkType),
            dataIndex: 'type',
            key: 'type',
        }, {
            title: __(messages.bandwidth)+'(M)',
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, ];
        const option = [
            <Option value="ONLINE" key="ONLINE">ONLINE</Option>,
            <Option value="INIT" key="INIT">INIT</Option>,
            <Option value="OFFLINE" key="OFFLINE">OFFLINE</Option>
        ];

        const optionTwo = [
            <Option value="国内组网" key="国内组网">国内组网</Option>,
            <Option value="全球组网" key="全球组网">全球组网</Option>,
            <Option value="国内SaaS加速" key="国内SaaS加速">国内SaaS加速</Option>,
            <Option value="全球SaaS加速" key="全球SaaS加速">全球SaaS加速</Option>
        ];

        return (
            <div>
                <HeaderBar hasAdd={false} hasDelete={false} hasUpload={false} hasSearch={true} hasSelectTwo={true}
                           hasSelect={true} selectPlaceHolder={__(messages.selectStatusPlaceholder)}
                           selectTwoPlaceHolder={__(messages.selectTypePlaceholder)} options={option} optionsTwo={optionTwo}
                           selectTwoMethod={this.handleSelectType} selectOneMethod={this.handleSelectStatus}
                           submit={this.handleSubmit}/>
                <BossTable pagination={pagination} columns={columns}
                           dataSource={this.props.ci0201Info.dataSource}/>
            </div>
        )
    }
}


function mapDispatchToProps({ci0201Info}) {
    return {ci0201Info};
}

export default connect(mapDispatchToProps)(injectIntl(LinkStat));