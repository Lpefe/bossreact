/**
 * 忘记密码组件
 **/
import React from 'react';
import {Form, Select,Card,Input,Icon,Button} from 'antd';
import logo from "../../../assets/img/logo.png";
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';
import localeList from "../../../locales/_localeList";
const FormItem=Form.Item;
const Option=Select.Option;
class RememberPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.getCaptcha();
    }

    getCaptcha=()=>{
        this.props.dispatch({
            type:"rememberPassword/getCaptcha",
            payload:{}
        })
    };

    handleSubmit=()=>{
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "rememberPassword/resend_password",
                    payload: {
                        email: values.email.replace(/(^\s*)|(\s*$)/g, ""),
                        captcha_code: values.captcha
                    }
                });
            }
        })
    };
    handleSelectLanguage = (value) => {
        window.location.href = process.env.PUBLIC_URL + '/index.' + value + '.html#' + this.props.location.pathname + this.props.location.search
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const __=this.props.intl.formatMessage;
        const inEnglish=window.appLocale.locale==="en-US";
        return (
            <div className="loginMainContainer">
                <header className="headerContainer">
                    <div>
                        <img src={logo} alt="logo" className="logo" style={{marginTop: 10, marginLeft: 8}}/>
                        <span className="back" style={{marginRight: 8}}><a
                            href={process.env.PUBLIC_URL + '/index.' + window.appLocale.locale + '.html#'}>{__(messages["继续登录"])}</a></span>
                        <div style={{display:"inline-block",float:"right"}}>
                            <Icon type="global" style={{fontSize:16,marginRight: 8,marginTop: 20,}}/>
                            <Select style={{width: 100, marginRight: 16, clear: 'both'}}
                                    onChange={this.handleSelectLanguage} value={window.appLocale.locale}>
                                {localeList.map((lang) => {
                                    return <Option value={lang.name} key={lang.name}>{lang.label}</Option>
                                })}
                            </Select>
                        </div>
                    </div>
                </header>
                <div className="dash"/>
                <div style={{marginTop: 24}}>
                    <Card className="loginContainer">
                        <div className="title" style={inEnglish?{fontSize:20}:{}}>{__(messages["SD-WAN综合管理平台"])}</div>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem className="FormItem">
                                {getFieldDecorator('email', {
                                    rules: [{required: true, message: __(messages['请输入邮箱']),}],
                                })(
                                    <Input size="large" placeholder={__(messages["请输入邮箱"])} className="input"/>
                                )
                                }
                            </FormItem>
                            <FormItem className="FormItem">
                                {getFieldDecorator('captcha', {
                                    rules: [{required: true, message: __(messages['请输入验证码']),}],
                                })(
                                    <Input size="large" style={{width: 150}} placeholder={__(messages["请输入验证码"])} className="input"/>
                                )
                                }
                                <img src={this.props.rememberPassword.captchaUrl} alt="" style={{width:60,height:40,marginLeft:58}}/>
                                <Icon type="reload" style={{fontSize:16,marginLeft:12}} onClick={this.getCaptcha}/>
                            </FormItem>
                            <Button type="primary" htmlType="submit" className="confirmBtn"><span
                                style={{color: "#fff"}}>{__(messages["立即验证"])}</span></Button>
                            <div style={{textAlign: "center", marginTop: 8}}>
                                <span>© 2018 {__(messages["极致互联"])} | {__(messages["浙ICP备17059766号"])}</span>
                            </div>
                        </Form>
                    </Card>
                </div>
            </div>
        )
    }
}

export default injectIntl(RememberPassword);