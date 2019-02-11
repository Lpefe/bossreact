/**
 * 技术支持-管理链路
 * */
import React from 'react';
import './index.scss';
import {Card, Dropdown, Icon, Menu, Modal, Select,} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {withRouter} from 'react-router-dom';
import BossEditModal from "../../Common/BossEditModal";
import moment from 'moment';
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
import BossDataHeader from "../../Common/BossDataHeader";
import cMessages from "../../../locales/commonMessages";
import {domain} from "../../../utils/commonConsts";
import {commonTranslate} from "../../../utils/commonUtilFunc";
import {editModalOptionsGenerator, HAModalOptionsGenerator, multipleAddModalOptionsGenerator} from "./modalOptions";

const Option = Select.Option;
const page_size=20;
const page_no=1;
class BI1101 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifEditModalShow: false,
            editId: "",
            editRecord: {
                charge_type: "固定计费",
            },
            ifMultipleAddModalShow: false,
            company_id: "",
            name: "",
            link_type: "",
            status: "",
            selectedIds: [],
            selectedRecords: [],
            ifBackUpLine: false,
            addModalInitialCompanyId: undefined,
            ifEditHAModalShow: false,
            ifCenterHA: false,
            editHARecord: {},
            editHAId:"",
            page_no:page_no,
            page_size:page_size
        }
    }

    componentDidMount() {
        this.get_company_list();
        this.get_link_list();
        this.get_link_stat();
    }

    checkLink = (status) => {
        this.setState({
            page_no:page_no,
            page_size:page_size,
            status:status
        },()=>{
            this.get_link_list();
        })

    };

    get_link_stat = () => {
        this.props.dispatch({
            type: "bi1101Info/get_link_stat",
            payload: {}
        })
    };

    get_link_list = () => {
        this.props.dispatch({
            type: "bi1101Info/get_link_list",
            payload: {
                link_type: this.state.link_type,
                name: this.state.name,
                status: this.state.status,
                company_id: this.state.company_id,
                page_no:this.state.page_no,
                page_size:this.state.page_size
            }
        })
    };

    get_company_list = () => {
        this.props.dispatch({
            type: "bi1101Info/get_company_list",
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
    //添加时获取中心节点
    get_center_agency_list = (company_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_agency_list",
            payload: {
                company_id: company_id,
                type: "CSTEP",
            }
        })
    };
    //添加时获取边缘节点
    get_edge_agency_list = (company_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_agency_list",
            payload: {
                company_id: company_id
            }
        })
    };
    //批量添加是获取中心节点
    get_center_agency_list_batch = (company_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_agency_list_batch",
            payload: {
                company_id: company_id,
                type: "CSTEP",
            }
        })
    };
    //批量添加时获取边缘节点
    get_edge_agency_list_batch = (company_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_agency_list_batch",
            payload: {
                company_id: company_id,
                has_link: 0,
            }
        })
    };

    get_device_list = (agency_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_device_list",
            payload: {
                agency_id: agency_id,
                type:"STEP,CSTEP"
            }
        })
    };

    get_speed_rule = (company_id) => {
        this.props.dispatch({
            type: "bi1101Info/get_speed_rule",
            payload: {
                company_id: company_id
            }
        })
    };

    closeAddModal = () => {
        this.setState({
            ifEditModalShow: false,
            editId: "",
            editRecord: {
                charge_type: "固定计费"
            },
            ifBackUpLine: false,
        })
    };

    closeMultipleAddModal = () => {
        this.setState({
            ifMultipleAddModalShow: false,
        })
    };
    handleOpenAddCompanyModal = (record) => {
        if (record.company_id) {
            this.get_edge_agency_list(record.company_id);
            this.get_center_agency_list(record.company_id);
            this.get_device_list(record.edge_id);
            this.get_speed_rule(record.company_id)
        }
        this.setState({
            ifEditModalShow: true,
            editId: record.id || "",
            editRecord: record.company_id ? record : {
                charge_type: "固定计费",
                company_id: this.state.addModalInitialCompanyId,
            },
        })
    };
    handleOpenMultipleAddModal = () => {
        this.setState({
            ifMultipleAddModalShow: true,
        })
    };

    handleSearchCompany = (value) => {
        this.setState({
            company_id: value || "",
            addModalInitialCompanyId: value || undefined,
        }, () => {
            this.get_link_list()
        })
    };

    handleSubmit = (value) => {
        this.setState({
            name: value || ""
        }, () => {
            this.get_link_list();
        })
    };
    //批量删除链路
    deleteLink = () => {
        this.props.dispatch({
            type: "bi1101Info/delete_link_batch",
            payload: {
                deleteEmpty: {
                    ids: this.state.selectedIds.filter((id) => {
                        return id < 0
                    }),
                    records: this.state.selectedRecords.filter((record) => {
                        return record.device_id === undefined
                    }),
                },
                delete: {
                    ids: this.state.selectedIds.filter((id) => {
                        return id > 0
                    }),
                    records: this.state.selectedRecords.filter((record) => {
                        return record.device_id !== undefined
                    }),
                },
                init: {
                    link_type: this.state.link_type,
                    name: this.state.name,
                    status: this.state.status,
                    company_id: this.state.company_id
                }
            }
        })
    };
    deleteLinkSingle = (record) => {
        const __ = commonTranslate(this);
        Modal.confirm({
            title: __(messages["确定要删除该条链路吗?"]),
            onOk: () => {
                this.props.dispatch({
                    type: "bi1101Info/delete_link",
                    payload: {
                        delete: {
                            ids: [record.id],
                            records: [record]
                        },
                        init: {
                            link_type: this.state.link_type,
                            name: this.state.name,
                            status: this.state.status,
                            company_id: this.state.company_id
                        }

                    }
                })
            }
        })

    };

    gotoLink = (record) => {
        if (!record.device_id) {
            return;
        }
        window.open(domain + "/index." + window.appLocale.locale + ".html#/main/bi0401/bi0402?id=" + record.id + "&from=link&bandwidth=" + record.bandwidth + "&company_id=" + record.company_id + "&sn=" + record.device_sn + "&device_id=" + record.device_id)
    };

    handleOpenEditHAModal = (record, ifCenterHA) => {
        this.setState({
            ifEditHAModalShow: true,
            ifCenterHA: ifCenterHA,
            editHARecord: record,
            editHAId:record.id
        },()=>{
            if(ifCenterHA){
                this.getHACenterLinkList();
            }else{
                this.getHAEdgeLinkList();
            }
        })
    };
    closeEditHAModal = () => {
        this.setState({
            ifEditHAModalShow: false,
            ifCenterHA: false,
            editHARecord: {},
            editHAId:""
        })
    };

    getHACenterLinkList = () => {
        this.props.dispatch({
            type: "bi1101Info/get_link_list_HA_center",
            payload: {
                company_id: this.state.editHARecord.company_id,
                device_id:this.state.editHARecord.device_id,
                exc_agency_id: this.state.editHARecord.agency_id,
            }
        })
    };

    getHAEdgeLinkList = () => {
        this.props.dispatch({
            type: "bi1101Info/get_link_list_HA_edge",
            payload: {
                edge_id: this.state.editHARecord.edge_id,
                agency_id: this.state.editHARecord.agency_id,
                exc_device_id:this.state.editHARecord.device_id,
                company_id: this.state.editHARecord.company_id,
            }
        })
    };


    operationMenuRender = (index, record) => {
        const __ = commonTranslate(this);
        return <Menu>
            <Menu.Item key="1" onClick={() => this.handleOpenAddCompanyModal(record)}>{__(messages['编辑'])}</Menu.Item>
            <Menu.Item key="2"
                       onClick={() => this.handleOpenEditHAModal(record, true)}>{__(messages['中心HA'])}</Menu.Item>
            <Menu.Item key="3"
                       onClick={() => this.handleOpenEditHAModal(record, false)}>{__(messages['边缘HA'])}</Menu.Item>
            <Menu.Item key="4" onClick={() => this.deleteLinkSingle(record)}>{__(messages["删除"])}</Menu.Item>
        </Menu>
    };

    render() {
        const __ = commonTranslate(this);
        const columns = [{
            title: __(messages['创建时间']),
            dataIndex: 'create_time',
            key: 'create_time',
            fixed: "left",
            render: (index, record) => {
                return record.create_time ? moment(record.create_time).format("YYYY-MM-DD HH:mm:ss") : ""
            }
        }, {
            title: __(messages['链路名称']),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <span onClick={() => this.gotoLink(record)}
                             className={record.device_id ? "common-link-icon" : ""}>{record.name}</span>
            }
        }, {
            title: __(messages['状态']),
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                switch (record.status) {
                    case "INIT":
                        return <span style={{color: "#FFD02D"}}>{record.status}</span>;
                    case "ONLINE":
                        return <span style={{color: "#0EC80E"}}>{record.status}</span>;
                    case "OFFLINE":
                        return <span style={{color: "#ff0002"}}>{record.status}</span>;
                    default:
                        break;
                }
            }
        }, {
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        }, {
            title: __(messages['边缘节点']),
            dataIndex: 'branch',
            key: 'branch',
        }, {
            title: __(messages['服务等级']),
            dataIndex: 'grade',
            key: 'grade',
            render: (text, record) => {
                return record.grade === "CLOUD_VPN" ? __(messages["云VPN"]) : (record.grade === "CLOUD_SPLINE" ? __(messages["云专线"]) : __(messages["超级云专线"]))
            }
        }, {
            title: __(messages['链路类型']),
            dataIndex: 'type',
            key: 'type',
        }, {
            title: __(messages['带宽(M)']),
            dataIndex: 'bandwidth',
            key: 'bandwidth',
        }, {
            title: __(messages['RTT基准值']) + '(ms)',
            dataIndex: 'rtt_limit',
            key: 'rtt_limit',
        }, {
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            fixed: "right",
            render: (index, record) => {
                return <Dropdown overlay={this.operationMenuRender(index, record)}>
                    <Icon type="ellipsis"/>
                </Dropdown>
            }
        }];

        const ModalOptions = editModalOptionsGenerator(this);
        const multipleAddModalOptions = multipleAddModalOptionsGenerator(this);
        const HAModalOptions = HAModalOptionsGenerator(this);

        const options = this.props.bi1101Info.companyList.map((item) => {
            return <Option key={item.id} value={item.id}>{item.company_abbr}</Option>
        });
        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords: selectedRecords,
                })
            }
        };
        const optionsTwo = [
            <Option value="ONLINE" key="ONLINE">ONLINE</Option>,
            <Option value="INIT" key="INIT">INIT</Option>,
            <Option value="OFFLINE" key="OFFLINE">OFFLINE</Option>,
        ];

        const optionsThree = [
            <Option value="国内组网" key="国内组网">{__(messages["国内组网"])}</Option>,
            <Option value="全球组网" key="全球组网">{__(messages["全球组网"])}</Option>,
            <Option value="国内SaaS加速" key="国内SaaS加速">{__(messages["国内SaaS加速"])}</Option>,
            <Option value="全球SaaS加速" key="全球SaaS加速">{__(messages["全球SaaS加速"])}</Option>
        ];
        return <div className="BI1101">
            <BossDataHeader offLine={this.props.bi1101Info.linkStat.OFFLINE}
                            init={this.props.bi1101Info.linkStat.INIT}
                            onLine={this.props.bi1101Info.linkStat.ONLINE}
                            total={this.props.bi1101Info.total}
                            checkLink={this.checkLink}
                            TotalLink="链路总数"
                            changeImg={true}
            />
            <Card className='card'>
                <HeaderBar hasAdd={true} hasSelect={true} hasSearch={true} selectPlaceHolder={__(messages["请选择企业"])}
                           add={this.handleOpenAddCompanyModal} hasExtraBtnThree={true}
                           extraBtnNameThree={__(messages["批量添加"])} hasDelete={true}
                           btnThreeFunc={this.handleOpenMultipleAddModal}
                           options={options} selectOneMethod={this.handleSearchCompany} submit={this.handleSubmit}
                           delete={this.deleteLink} selectedKeys={this.state.selectedIds} hasSelectTwo={true}
                           hasSelectThree={true} selectTwoMethod={this.handleSelectStatus}
                           selectThreeMethod={this.handleSelectType} selectThreePlaceHolder={__(messages["请选择链路类型"])}
                           selectTwoPlaceHolder={__(cMessages['请选择状态'])} optionsTwo={optionsTwo}
                           optionsThree={optionsThree} selectOneWidth={120} selectTwoWidth={120}
                           selectThreeWidth={140}/>
                <BossTable component={this} columns={columns} dataSource={this.props.bi1101Info.linkList} rowSelection={rowSelection}
                           scroll={{x: true}} getData={this.get_link_list} paging={true} total={this.props.bi1101Info.total}/>
                <BossEditModal {...ModalOptions}/>
                <BossEditModal {...multipleAddModalOptions}/>
                <BossEditModal {...HAModalOptions}/>
            </Card>
        </div>
    }
}

export default withRouter(injectIntl(BI1101));