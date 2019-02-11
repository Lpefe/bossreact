import React from 'react';
import {Form, Button,Input} from 'antd';
import {connect} from 'dva';
import {injectIntl} from "react-intl";
import messages from '../LocaleMsg/messages';
const FormItem = Form.Item;

class Baseinfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
        };
        this.isBusiness = sessionStorage.getItem("role") === "supercxpbusiness" || sessionStorage.getItem("role") === "supercxptechsupport" || sessionStorage.getItem("role") === "supercxpbizadmin" || sessionStorage.getItem("role") === "supercxptechadmin"
    }

    componentDidMount() {
        this.get_company_list();
    }

    changeEditMode = () => {
        this.setState({
            editMode: true
        })
    };

    cancelEdit = () => {
        this.setState({
            editMode: false,
        })
    };


    get_company_list = () => {
        this.props.dispatch({
            type: "ci1001Info/get_company_list",
            payload: {
                company_id: this.isBusiness ? this.props.id : sessionStorage.getItem("companyId"),
            }
        })
    };
    submit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "ci1001Info/update_company",
                    payload: {
                        id: this.isBusiness ? this.props.id : sessionStorage.getItem("companyId"),
                        company: values.company,
                        company_abbr: values.company_abbr,
                        company_tax: values.company_tax,
                        company_code: values.company_code,
                        status: values.status,
                        trade: values.trade,
                        company_id: this.isBusiness ? this.props.id : sessionStorage.getItem("companyId"),
                        record:this.props.ci1001Info.companyInfo
                    }
                })
            }
            this.setState({
                editMode: false,
            })
        })
    };


    render() {
        const __=this.props.intl.formatMessage;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 3},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        let companyInfo = this.props.ci1001Info.companyInfo;
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                {!this.state.editMode ? <Form>
                        <FormItem label={<span className="FormItemLabel">{__(messages['企业名称'])}</span>} {...modalFormLayout}
                                  style={{margin: 0}}>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;{companyInfo.company}</span>
                        </FormItem>
                        <FormItem label={<span className="FormItemLabel">{__(messages['简称'])}</span>} {...modalFormLayout}
                                  style={{margin: 0}}>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;{companyInfo.company_abbr}</span>
                        </FormItem>
                        <FormItem label={<span className="FormItemLabel">{__(messages['客户状态'])}</span>} {...modalFormLayout}
                                  style={{margin: 0}}>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;{companyInfo.status}</span>
                        </FormItem>
                        <FormItem label={<span className="FormItemLabel">{__(messages['企业管理员账号'])}</span>}{...modalFormLayout}
                                  style={{margin: 0}}>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;{companyInfo.company_admin}</span>
                        </FormItem>
                        <FormItem label={<span className="FormItemLabel">{__(messages['技术支持'])}</span>} {...modalFormLayout}
                                  style={{margin: 0}}>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;{companyInfo.techsupport}</span>
                        </FormItem>
                        <FormItem label={<span className="FormItemLabel">{__(messages['商务'])}</span>} {...modalFormLayout}
                                  style={{margin: 0}}>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;{companyInfo.business}</span>
                        </FormItem>
                    </Form>
                    : <Form>
                        <FormItem label={__(messages['企业名称'])} {...modalFormLayout}>
                            {getFieldDecorator('company', {
                                rules: [{required: true, message: __(messages['请输入企业名称'])},{max: 50, message: "企业名称长度最大50个字符"}],
                                initialValue: companyInfo.company
                            })(
                                <Input placeholder="请输入企业名称"/>
                            )}
                        </FormItem>
                        <FormItem label={__(messages['简称'])} {...modalFormLayout}>
                            {getFieldDecorator('company_abbr', {
                                rules: [{required: true, message: __(messages['请输入简称'])}], initialValue: companyInfo.company_abbr
                            })(
                                <Input placeholder={__(messages['请输入简称'])}/>
                            )}
                        </FormItem>
                        <FormItem label={<span className="FormItemLabel">{__(messages['客户状态'])}</span>} {...modalFormLayout}
                                  style={{margin: 0}}>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;{companyInfo.status}</span>
                        </FormItem>
                        <FormItem label={<span className="FormItemLabel">{__(messages['企业管理员账号'])}</span>}{...modalFormLayout}
                                  style={{margin: 0}}>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;{companyInfo.company_admin}</span>
                        </FormItem>
                        <FormItem label={<span className="FormItemLabel">{__(messages['技术支持'])}</span>} {...modalFormLayout}
                                  style={{margin: 0}}>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;{companyInfo.techsupport}</span>
                        </FormItem>
                        <FormItem label={<span className="FormItemLabel">{__(messages['商务'])}</span>} {...modalFormLayout}
                                  style={{margin: 0}}>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;{companyInfo.business}</span>
                        </FormItem>
                    </Form>}
                {this.state.editMode && sessionStorage.getItem("role") === "company" ?
                    <div className="editBtnContainer">
                        <Button type="primary" style={{marginRight: 8}} onClick={this.submit}>确认</Button>
                        <Button onClick={this.cancelEdit}>取消</Button>
                    </div> :
                    sessionStorage.getItem("role") === "company" ?<div className="editBtnContainer"><Button onClick={this.changeEditMode}>编辑</Button>
                    </div>:""}
            </div>
        )
    }
}

function mapDispatchToProps({ci1001Info}) {
    return {ci1001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(Baseinfo)));