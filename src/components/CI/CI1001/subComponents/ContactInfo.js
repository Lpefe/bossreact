import React from 'react';
import {Form,} from 'antd';
import './subStyle.scss';
import {connect} from 'dva';
import HeaderBar from "../../../Common/HeaderBar";
import BossTable from "../../../Common/BossTable";
import BossEditModal from "../../../Common/BossEditModal";
import Operations from "../../../Common/Operations";
import {injectIntl} from "react-intl";
import messages from '../LocaleMsg/messages';
class ContactInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyModalShow: false,
            editId: "",
            editRecord: {},

        };
        this.isBusiness = sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin"

    }

    componentDidMount() {
        this.get_company_contact();
    }

    get_company_contact = () => {
        this.props.dispatch({
            type: "ci1001Info/get_company_contact",
            payload: {
                company_id: this.props.id||sessionStorage.getItem("companyId")
            }
        })
    };

    closeAddModal = () => {
        this.setState({
            companyModalShow: false,
            editId: "",
            editRecord: {},
        })
    };

    handleOpenAddCompanyModal = (record) => {
        this.setState({
            companyModalShow: true,
            editId: record.id,
        })
    };

    handleOpenEditCompanyModal=(record)=>{
        this.setState({
            companyModalShow: true,
            editId: record.id,
            editRecord: record,
        })
    };

    delete_company_contact=(record)=>{
        this.props.dispatch({
            type:"ci1001Info/delete_company_contact",
            payload:{
                delete:{ids:[record.id],records:[record]},
                init:{
                    company_id: this.props.id||sessionStorage.getItem("companyId")
                }
            }
        })
    };

    render() {
        const __=this.props.intl.formatMessage;
        const columns = [
            {
                title: __(messages['联系人姓名']),
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
                title: __(messages['电子邮箱']),
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
            }, {
                title: __(messages['操作']),
                dataIndex: 'operation',
                key: 'operation',
                width:150,
                render:(index,record)=>{
                    return <Operations hasEdit={true} hasDelete={true} edit={()=>this.handleOpenEditCompanyModal(record)} delete={()=>this.delete_company_contact(record)}/>
                }
            },
        ];
        const ModalOptions = {
            title: this.state.editId ?  __(messages['编辑联系人']) :  __(messages['新增联系人']),
            visible: this.state.companyModalShow,
            onCancel: this.closeAddModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "ci1001Info/update_company_contact" : "ci1001Info/create_company_contact",
            extraUpdatePayload: {id: this.state.editId, company_id: this.props.id||sessionStorage.getItem("companyId")},
            initPayload: {company_id: this.props.id||sessionStorage.getItem("companyId")},
            initialValues: this.state.editRecord,
            InputItems: [{
                type: "Input",
                labelName:  __(messages['联系人姓名']),
                valName: "name",
                nativeProps: {
                    placeholder:  __(messages['请输入联系人姓名'])
                },
                rules: [{required: true, message: __(messages['请输入联系人姓名'])}, {max: 50, message: __(messages['联系人姓名最多输入50字符'])}],
            }, {
                type: "Input",
                labelName:  __(messages['职务']),
                valName: "title",
                nativeProps: {
                    placeholder:  __(messages['请输入职务'])
                },
                rules: [{max: 50, message: __(messages['职务最多输入50字符'])}],
            }, {
                type: "Input",
                labelName:  __(messages['联系电话']),
                valName: "tel",
                nativeProps: {
                    placeholder:  __(messages['请输入联系电话'])
                },
                rules: [{required: true, message:  __(messages['请输入联系电话'])}, {max: 50, message: __(messages['联系电话最多输入50字符'])}],
            }, {
                type: "Input",
                labelName:  __(messages['电子邮箱']),
                valName: "mail",
                nativeProps: {
                    placeholder:  __(messages['请输入电子邮箱'])
                },
                rules: [{type: 'email', message: __(messages['请输入正确格式邮箱地址']),},
                    {max: 50, message: __(messages['邮箱最多输入50字符'])}],
            }, {
                type: "Input",
                labelName:  __(messages['联系地址']),
                valName: "address",
                nativeProps: {
                    placeholder:  __(messages['请输入联系地址'])
                },
                rules: [{max: 50, message: __(messages['联系地址最多输入128字符'])}],
            }, {
                type: "Input",
                labelName:  __(messages['备注']),
                valName: "remark",
                nativeProps: {
                    placeholder:  __(messages['请输入备注'])
                },
                rules: [{max: 50, message: __(messages['备注最多输入128字符'])}],
            },]
        };
        return <div>
            <HeaderBar hasSearch={false} hasSelect={false} hasAdd={true} hasDelete={false}
                       add={this.handleOpenAddCompanyModal}
                       selectOneMethod={this.handleSelectCompanyStatus} submit={this.search}/>
            <BossTable columns={columns} dataSource={this.props.ci1001Info.contactList}/>
            <BossEditModal {...ModalOptions}/>
        </div>
    }
}

function mapDispatchToProps({ci1001Info}) {
    return {ci1001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(ContactInfo)));