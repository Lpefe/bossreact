import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import {Card, Icon, Select} from 'antd';
import {Link} from 'react-router-dom';
import BossTable from "../../Common/BossTable";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";

const Option = Select.Option;

class MI1201 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            company: "",
            status: ""
        }
    }

    componentDidMount() {
        this.getCompanyList();
    }

    getCompanyList() {
        this.props.dispatch({
            type: "bi0101Info/getCompanyList",
            payload: {
                company: this.state.company,
                status: this.state.status,
            }
        })
    }

    search = (value) => {
        this.setState({
            company: value || ""
        }, () => {
            this.getCompanyList();
        })
    };

    handleSelectCompanyStatus = (value) => {
        this.setState({
            status: value || ""
        }, () => {
            this.getCompanyList();
        })
    };


    render() {
        const __ = this.props.intl.formatMessage;
        let columns = [{
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: __(messages['状态']),
            dataIndex: 'status',
            key: 'status',
            render: (text) => {
                return __(messages[text])
            }
        }, {
            title: __(messages['设备流量分析']),
            dataIndex: 'deviceflow',
            key: 'deviceflow',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{pathname: "/main/ci0303", search: "?id=" + record.id}}><Icon
                    type="bar-chart" style={{color: "#1890ff"}}/></Link>
            }
        }, {
            title: __(messages['带宽流量分析']),
            dataIndex: 'bandwidth',
            key: 'bandwidth',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{pathname: "/main/ci0301", search: "?id=" + record.id}}><Icon
                    type="line-chart" style={{color: "#1890ff"}}/></Link>
            }
        }, {
            title: __(messages['流量分时统计']),
            dataIndex: 'flow',
            key: 'flow',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{pathname: "/main/ci0302", search: "?id=" + record.id}}><Icon
                    style={{color: "#1890ff"}} type="dot-chart"/></Link>
            }
        }, {
            title: __(messages['日流量统计']),
            dataIndex: 'dayflow',
            key: 'dayflow',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{pathname: "/main/ci0401", search: "?id=" + record.id}}><Icon
                    style={{color: "#1890ff"}} type="area-chart"/></Link>
            }
        }, {
            title: __(messages['流量压缩分析']),
            dataIndex: 'compress',
            key: 'compress',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{
                    pathname: "/main/mi1201/mi1202",
                    search: "?id=" + record.id + "&company_abbr=" + record.company_abbr + "&status=" + record.status
                }}><Icon
                    style={{color: "#1890ff"}} type="bar-chart"/></Link>
            }
        }, {
            title: __(messages['流量去重分析']),
            dataIndex: 'depress',
            key: 'depress',
            width: 120,
            align: "center",
            render: (index, record) => {
                return <Link to={{
                    pathname: "/main/mi1201/mi1203",
                    search: "?id=" + record.id + "&company_abbr=" + record.company_abbr + "&status=" + record.status
                }}><Icon
                    style={{color: "#1890ff"}} type="bar-chart"/></Link>
            }
        },];
        const options = [
            <Option key="正式" value="正式">{__(messages["正式"])}</Option>,
            <Option key="试用" value="试用">{__(messages["试用"])}</Option>,
            <Option key="停用" value="停用">{__(messages["停用"])}</Option>,
        ];
        return (
            <Card className="card">
                <HeaderBar options={options} hasDelete={false} hasSearch={true} hasSelect={true}
                           selectPlaceHolder={__(messages["请选择客户状态"])}
                           inputPlaceHolder={__(messages["请输入企业名称"])} submit={this.search}
                           selectOneMethod={this.handleSelectCompanyStatus}/>
                <BossTable columns={columns} dataSource={this.props.bi0101Info.companyList}/>
            </Card>
        )
    }
}

export default injectIntl(MI1201);