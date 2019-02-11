/**
 * 功能配置Tab模块组件
 **/
import React from 'react';
import {Form} from 'antd';
import messages from "../LocaleMsg/messages";
import {injectIntl} from "react-intl";
import {connect} from "dva";
const FormItem=Form.Item;

class FunctionInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {
        this.get_shrink();
        this.get_speed_rule();

    }

    get_shrink=()=>{
        this.props.dispatch({
            type:"ci1001Info/get_shrink",
            payload:{
                company_id:sessionStorage.getItem("companyId")
            }
        })
    };

    get_speed_rule=()=>{
        this.props.dispatch({
            type:"ci1001Info/get_speed_rule",
            payload:{
                company_id:sessionStorage.getItem("companyId")
            }
        })
    };

    render() {

        const modalFormLayout = {
            labelCol: {
                xs: {span: 3},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        const __=this.props.intl.formatMessage;
        const logoMap={
          "custom":"企业自定义",
          "white":"白板",
          "default":"默认"
        };

        return (
            <div>
                <Form>
                    <FormItem label={<span className="FormItemLabel">{__(messages['SaaS加速'])}</span>} {...modalFormLayout}
                              style={{margin: 0}}>
                        <span>{this.props.ci1001Info.speedRule}</span>
                    </FormItem>
                    <FormItem label={<span className="FormItemLabel">{__(messages['智能压缩'])}</span>} {...modalFormLayout}
                              style={{margin: 0}}>
                        <span>{this.props.ci1001Info.ifShrink}</span>
                    </FormItem>
                    <FormItem label={<span className="FormItemLabel">{__(messages['Logo设置'])}</span>} {...modalFormLayout}
                              style={{margin: 0}}>
                        <span>{logoMap[this.props.ci1001Info.companyInfo.logo]}</span>
                    </FormItem>
                </Form>
            </div>
        )
    }
}


function mapDispatchToProps({ci1001Info}) {
    return {ci1001Info};
}

export default connect(mapDispatchToProps)(injectIntl(FunctionInfo));
