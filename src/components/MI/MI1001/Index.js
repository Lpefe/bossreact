/**
 * 运维模组-关系人信息模块
 * */

import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import {Tabs, Card,Select} from 'antd';
import BossTable from "../../Common/BossTable";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
import {commonTranslate} from "../../../utils/commonUtilFunc";
const  Option=Select.Option;

const TabPane = Tabs.TabPane;

class MI1001 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            agencyNm: "",
            company_id:"",
        }
    }

    componentDidMount() {
        this.get_agency_list();
        this.get_company_contact();
        this.get_company_list();
    }

    get_agency_list = () => {
        this.props.dispatch({
            type: "mi1001Info/get_agency_list",
            payload: {
                name: this.state.agencyNm
            }
        })
    };
    get_company_contact = () => {
        this.props.dispatch({
            type: "mi1001Info/get_company_contact",
            payload: {
                name: this.state.name,
                company_id:this.state.company_id,
            }
        })
    };

    get_company_list=()=>{
        this.props.dispatch({
            type: "mi1001Info/get_company_list",
            payload: {

            }
        })
    };

    handleSearchAgency = (value) => {
        let vm=this;
        this.setState({
            agencyNm: value
        }, function () {
            vm.get_agency_list();
        })
    };
    handleSearchRelatedPerson = (value) => {
        this.setState({
            name: value
        }, ()=> {
            this.get_company_contact()
        })
    };

    handleSelectCompany=(value)=>{
        this.setState({
            company_id:value||""
        },()=>{
            this.get_company_contact()
        })
    };

    render() {
        const __=commonTranslate(this);
        const columnsReceiver = [
            {
                title: __(messages['企业名称']),
                dataIndex: 'company_abbr',
                key: 'company_name',
            }, {
                title: __(messages['节点名称']),
                dataIndex: 'name',
                key: 'name',
            }, {
                title: __(messages['收货人']),
                dataIndex: 'receive_name',
                key: 'receive_name',
            }, {
                title: __(messages['联系电话']),
                dataIndex: 'receive_tel',
                key: 'receive_tel',
            }, {
                title: __(messages['收货地址']),
                dataIndex: 'address',
                key: 'address',
            },
        ];
        const columnsContact = [
            {
                title: __(messages['企业名称']),
                dataIndex: 'company_abbr',
                key: 'company_name',
            }, {
                title: __(messages['联系人']),
                dataIndex: 'name',
                key: 'name',
            }, {
                title: __(messages['职务']),
                dataIndex: 'title',
                key: 'title',
            }, {
                title: __(messages['联系电话']),
                dataIndex: 'tel',
                key: 'tel',
            }, {
                title: __(messages['邮箱']),
                dataIndex: 'mail',
                key: 'mail',
            }, {
                title: __(messages['联系地址']),
                dataIndex: 'address',
                key: 'address',
            }, {
                title: __(messages['备注']),
                dataIndex: 'remark',
                key: 'remark',
            },
        ];
        const pagination = {
            pageSize: 20
        };

        const options=this.props.mi1001Info.companyList.map((item)=>{
            return <Option value={item.id} key={item.id}>{item.company_abbr}</Option>
        });
        return (
            <Card className="card">
                <Tabs defaultActiveKey="1">
                    <TabPane key="1" tab={__(messages["收货人信息"])}>
                        <HeaderBar hasSearch={true} hasDelete={false}
                                   submit={this.handleSearchAgency}/>
                        <BossTable pagination={pagination} columns={columnsReceiver}
                                   dataSource={this.props.mi1001Info.agencyList}/>
                    </TabPane>
                    <TabPane key="2" tab={__(messages["联系人信息"])}>
                        <HeaderBar hasSearch={true} hasDelete={false}
                                   submit={this.handleSearchRelatedPerson} hasSelect={true} selectOneMethod={this.handleSelectCompany} options={options} selectPlaceHolder="请选择公司"/>
                        <BossTable pagination={pagination} columns={columnsContact}
                                   dataSource={this.props.mi1001Info.relatedPersonList}/>
                    </TabPane>
                </Tabs>
            </Card>
        )
    }
}

export default injectIntl(MI1001);