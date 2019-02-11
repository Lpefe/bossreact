import React from 'react';
import {Button, Form, Radio, Switch} from 'antd';
import {connect} from 'dva';
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";
import {commonTranslate} from "../../../../utils/commonUtilFunc";

const FormItem = Form.Item;
const RadioGrp = Radio.Group

class SetupModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: true,
        }
    }

    componentDidMount = () => {
        // 把this传到父组件使其changeId的时候调用resetFields，从而改变initialValue
        this.props.onRef(this);
        this.props.getLogo()
    };

    handelSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let types = [];
                types.push({type: values.ifOversea, rule: values.ifOversea === "oversea" ? values.strategy : "none"});
                if (values.ifOversea === "none") {
                    types = [];
                }
                this.props.dispatch({
                    type: "bi0001Info/update_speed_rule",
                    payload: {
                        list: {
                            company_id: this.props.editId,
                            types: types,
                        },
                        shrink: {
                            company_id: this.props.editId,
                            enable_activity: values.ifShrink,
                        },
                        logo: {
                            id: this.props.editId,
                            logo: values.logo,
                        }
                    }
                }).then(() => {
                    this.props.dispatch({
                        type: "bi0001Info/get_speed_rule",
                        payload: {
                            company_id: this.props.editId,
                        }
                    })
                    this.props.dispatch({
                        type: "bi0001Info/getLogo",
                        payload: {
                            company_id: this.props.editId,
                        }
                    })
                })

            }
            this.props.cancel();
        })


    };

    render() {
        const __ = commonTranslate(this);
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        return <Form>
            <FormItem label={__(messages["SaaS加速"])} {...modalFormLayout}>
                {getFieldDecorator('ifOversea', {initialValue: this.props.bi0001Info.speedRule[0].type || 'none'})(
                    <RadioGrp>
                        <Radio value="oversea">{__(messages["全球"])}</Radio>
                        <Radio value="domestic">{__(messages["国内"])}</Radio>
                        <Radio value="none">{__(messages["无"])}</Radio>
                    </RadioGrp>
                )}
            </FormItem>
            {this.props.form.getFieldValue("ifOversea") === "oversea" ?
                <FormItem label={__(messages["海外域名限制"])} {...modalFormLayout}>
                    {getFieldDecorator('strategy', {
                        rules: [{required: true, message: __(messages["请选择安全策略"])},],
                        initialValue: this.props.bi0001Info.speedRule[0].rule
                    })(
                        <RadioGrp>
                            <Radio value="blacklist">{__(messages["黑名单"])}</Radio>
                            <Radio value="whitelist">{__(messages["黑白名单"])}</Radio>
                            <Radio value="none">{__(messages["不限制"])}</Radio>
                        </RadioGrp>
                    )}
                </FormItem> : ""}
            <FormItem label={__(messages["智能压缩"])} {...modalFormLayout}>
                {getFieldDecorator('ifShrink', {
                    valuePropName: 'checked', initialValue: this.props.bi0001Info.ifShrink === 1
                })(
                    <Switch checkedChildren={__(messages["开启"])} unCheckedChildren={__(messages["关闭"])}/>
                )}
            </FormItem>
            <FormItem label={__(messages["Logo设置"])} {...modalFormLayout}>
                {getFieldDecorator('logo', {initialValue: this.props.bi0001Info.logo})(
                    <RadioGrp>
                        <Radio value="default">{__(messages["默认"])}</Radio>
                        <Radio value="white">{__(messages["白板"])}</Radio>
                        <Radio value="custom">{__(messages["企业自定义"])}</Radio>
                    </RadioGrp>
                )}
            </FormItem>
            <Button type="primary" htmlType="submit" className="confirmBtn" onClick={() => {
                this.handelSubmit()
            }}><span
                style={{color: "#fff"}}>{__(messages["保存"])}</span></Button>
        </Form>
    }
}

function mapDispatchToProps({bi0001Info}) {
    return {bi0001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(SetupModal)));