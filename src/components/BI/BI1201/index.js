/**
 * 技术支持-企业账户管理
 * */
import React from 'react';
import './index.scss';
import {Card,Modal} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {withRouter} from 'react-router-dom';
import BossEditModal from "../../Common/BossEditModal";
import Operations from "../../Common/Operations";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
const confirm = Modal.confirm;

class BI1201 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            editRecord:{},
            companyModalShow: false,
            passwordConfirmShow:false,
        }
    }

    componentDidMount() {
        this.get_related_person_list();
    }

    get_related_person_list=()=>{
        this.props.dispatch({
            type:"bi1201Info/get_related_person_list",
            payload:{
                role:"company",
                name:this.state.name,
            }
        })
    };

    submit=(value)=>{
        let vm=this;
        this.setState({
            name:value
        },function(){
            vm.get_related_person_list();
        })
    };

    handleEditEmail=(record)=>{
        this.setState({
            editId:record.id,
            editRecord:record,
            companyModalShow: true,
        })
    };

    closeAddModal = () => {
        this.setState({
            companyModalShow: false,
            editId: "",
            editRecord: {},
        })
    };
    handleResetPassword=(record)=>{
        const __=this.props.intl.formatMessage;
        let vm=this;
        confirm({
            title: __(messages['确定要重置密码吗?']),
            onOk() {
                vm.props.dispatch({
                    type:"bi1201Info/reset_password",
                    payload:{
                        id:record.id
                    }
                })
            },
        })
    };


    render() {
        const __=this.props.intl.formatMessage;
        const columns=[{
            title: __(messages['企业名称']),
            dataIndex: 'company_name',
            key: 'company_name',
        }, {
            title: __(messages['管理员账号']),
            dataIndex: 'mail',
            key: 'mail',
        }, {
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            align:"center",
            width:150,
            render:(text,record)=>{
                return <Operations hasEdit={true} hasExtra={true} extraIcon={"key"} extraToolTip={__(messages["更改密码"])} edit={()=>this.handleEditEmail(record)} extra={()=>this.handleResetPassword(record)}/>
            }
        },];

        const modalOption={
            title: __(messages["修改管理员账号"]),
            visible: this.state.companyModalShow,
            onCancel: this.closeAddModal,
            dispatch: this.props.dispatch,
            submitType:"bi1201Info/update_related_person",
            extraUpdatePayload: {id: this.state.editId},
            initialValues: this.state.editRecord,
            initPayload: {
                role: "company",
                name:this.state.name,
            },
            InputItems: [{
                type: "Input",
                labelName: __(messages["管理员账号"]),
                valName: "mail",
                nativeProps: {
                    placeholder: __(messages["请输入新的企业管理员账号"])
                },
                rules: [{required: true, message: __(messages["请输入新的企业管理员账号"])}, {type:"email",message: __(messages["请输入正确格式邮箱地址"])}],
            },]
        };
        return <Card className="card">
            <HeaderBar hasSearch={true} inputPlaceHolder={__(messages["请输入企业名称"])} submit={this.submit}/>
            <BossTable columns={columns} dataSource={this.props.bi1201Info.relatedPersonList}/>
            <BossEditModal {...modalOption} bodyHeight={120}/>
        </Card>
    }
}

export default withRouter(injectIntl(BI1201));