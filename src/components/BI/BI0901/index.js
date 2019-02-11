/**
 * 技术支持-中心节点
 * */
import React from 'react';
import './index.scss';
import {Card, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {withRouter} from 'react-router-dom';
import BossEditModal from "../../Common/BossEditModal";
import Operations from "../../Common/Operations";
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';
import {commonTranslate, validateIp} from "../../../utils/commonUtilFunc";
import {centerNodeModalOptionsGenerator} from "./modalOptions";

const Option = Select.Option;

class BI0901 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifEditModalShow: false,
            editId: "",
            editRecord: {
                level1_id: 1,
                has_public_ip: 1
            },
            ipTableShow: false,
            selectedCompanyId: "",
            company_id: "",//筛选公司
            name: "",//筛选关键字
            isConverged:true
        }
    }

    componentDidMount() {
        this.get_agency_list();
        this.get_company_list();
        this.get_country();
        this.get_province(1);
    }


    get_country = () => {
        this.props.dispatch({
            type: "bi0901Info/get_address",
            payload: {
                level: 1
            }
        })
    };

    get_province = (parent_id) => {
        this.props.dispatch({
            type: "bi0901Info/get_address",
            payload: {
                level: 2,
                parent_id: parent_id
            }
        })
    };
    get_city = (parent_id) => {
        this.props.dispatch({
            type: "bi0901Info/get_address",
            payload: {
                level: 3,
                parent_id: parent_id
            }
        })
    };

    get_agency_list = () => {
        this.props.dispatch({
            type: "bi0901Info/get_agency_list",
            payload: sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff" ? {
                type: "CSTEP",
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.name
            } : {
                type: "CSTEP",
                company_id: this.state.company_id,
                name: this.state.name
            }
        })
    };

    get_company_list = () => {
        this.props.dispatch({
            type: "bi0901Info/get_company_list",
            payload: {}
        })
    };


    closeAddModal = () => {
        this.setState({
            ifEditModalShow: false,
            editId: "",
            editRecord: {
                level1_id: 1,
                has_public_ip: 1
            },
        })
    };
    handleOpenAddCompanyModal = (record) => {
        this.setState({
            ifEditModalShow: true,
            editId: record.id,
            editRecord: record.id ? record : this.state.editRecord,
            isConverged:record.id?record.converged:true
        }, () => {
            if (record.id) {
                this.get_province(record.level1_id);
                this.get_city(record.level2_id)
            }



        })
    };

    handleOpenIptableModal = (record) => {
        this.setState({
            ipTableShow: true,
            editId: record.id,
            selectedCompanyId: record.company_id
        }, function () {
            this.props.dispatch({
                type: "bi0901Info/get_iptable_list",
                payload: {
                    company_id: this.state.selectedCompanyId,
                    agency_id: this.state.editId
                }
            })
        });
    };

    delete = (record) => {
        this.props.dispatch({
            type: "bi0901Info/delete_agency",
            payload: {
                delete: {
                    ids: [record.id],
                    records: [record]
                },
                init: (sessionStorage.getItem("role") === "company" || sessionStorage.getItem("role") === "companystaff") ? {
                    type: "CSTEP",
                    company_id: sessionStorage.getItem("companyId"),
                    name: this.state.name
                } : {
                    type: "CSTEP",
                    company_id: this.state.company_id,
                    name: this.state.name
                }
            }
        })
    };

    handleSelectCompany = (value) => {
        this.setState({
            company_id: value || "",
        }, function () {
            this.props.dispatch({
                type: "bi0901Info/get_agency_list",
                payload: {
                    type: "CSTEP",
                    company_id: this.state.company_id,
                    name: this.state.name
                }
            })
        })
    };

    handleSubmitSearch = (value) => {
        this.setState({
            name: value || "",
        }, function () {
            this.props.dispatch({
                type: "bi0901Info/get_agency_list",
                payload: {
                    type: "CSTEP",
                    company_id: this.state.company_id,
                    name: this.state.name
                }
            })
        })
    };
    onRef=(modalComponent)=>{
        this.modalComponent=modalComponent
    };

    render() {
        const __ = commonTranslate(this);
        const columns = [{
            title: __(messages['中心节点']),
            dataIndex: 'name',
            key: 'name',
            width: 150,
            fixed: "left"
        }, {
            title: __(messages['所在国家']),
            dataIndex: 'level1',
            key: 'level1',
        }, {
            title: __(messages['所属城市']),
            dataIndex: 'level3_name',
            key: 'level3_name',
            render: (index, record) => {
                return <span>{record.level23.length > 1 ? record.level23[1] : ""}</span>
            }
        }, {
            title: __(messages['收货地址']),
            dataIndex: 'address',
            key: 'address',
        }, {
            title: __(messages['收货联系人']),
            dataIndex: 'receive_name',
            key: 'receive_name',
        }, {
            title: __(messages['联系电话']),
            dataIndex: 'receive_tel',
            key: 'receive_tel',
        }, {
            title: __(messages['公网IP']),
            dataIndex: 'has_public_ip',
            key: 'has_public_ip',
            render: (text) => {
                return text === 1 ? "有" : "无"
            }
        }, {
            title: __(messages['私网IP段']),
            dataIndex: 'iptables',
            key: 'iptables',
        }, {
            title: __(messages['汇聚点']),
            dataIndex: 'converged',
            key: 'converged',
            render:(text)=>{
                return text?"是":"否"
            }
        }, {
            title:"BGP",
            dataIndex: 'bgp',
            key: 'bgp',
            render:(text)=>{
                return text==="OFF"?"关闭":"开启"
            }
        }, {
            title: __(messages['备注']),
            dataIndex: 'remark',
            key: 'remark',
            render: (text) => {
                return <span>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            }
        }, {
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width: 100,
            fixed: "right",
            render: (index, record) => {
                return <Operations hasEdit={true} hasDelete={true}
                                   edit={() => this.handleOpenAddCompanyModal(record)}
                                   delete={() => this.delete(record)}
                />
            }
        }];

        let companyName = {
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_abbr',

        };

        if (sessionStorage.getItem("role") !== "company" && sessionStorage.getItem("role") !== "companystaff") {
            columns.splice(1, 0, companyName);
        }
        const ModalOptions = centerNodeModalOptionsGenerator(this);

        const options = this.props.bi0901Info.companyList.map((item) => {
            return <Option key={item.id} value={item.id}>{item.company_abbr}</Option>
        });
        return <Card className="card BI0901">
            <HeaderBar hasAdd={true}
                       hasSelect={sessionStorage.getItem("role") !== "company" && sessionStorage.getItem("role") !== "companystaff"}
                       hasSearch={true}
                       selectPlaceHolder={__(messages['请选择企业'])}
                       add={this.handleOpenAddCompanyModal} options={options}
                       selectOneMethod={this.handleSelectCompany} submit={this.handleSubmitSearch}/>
            <BossTable columns={columns} dataSource={this.props.bi0901Info.agencyList} scroll={{x: true}}/>
            <BossEditModal {...ModalOptions} refs={this.onRef}/>
        </Card>
    }
}

export default withRouter(injectIntl(BI0901));