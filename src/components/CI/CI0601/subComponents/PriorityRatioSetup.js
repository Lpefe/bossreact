import React from 'react';
import {Modal, Form, InputNumber, Icon} from 'antd';
import {connect} from 'dva';
import './PriorityRatioSetup.scss';
import {injectIntl} from "react-intl";
import messages from '../LocaleMsg/messages';

const FormItem = Form.Item;


class PriorityRatioSetup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
        }
    }




    changeMode = () => {
        this.setState({
            isEdit: true
        })
    };

    closeEditMode=()=>{
        this.setState({
            isEdit:false,
        })
    };

    update_app_priority=()=>{
        this.props.form.validateFields((err,values)=>{
            if(!err){
                if(values.urgent+values.high+values.medium+values.low===100){
                    this.props.dispatch({
                        type:"ci0601Info/update_app_priority",
                        payload:{
                            company_id:sessionStorage.getItem("companyId"),
                            urgent:values.urgent,
                            high:values.high,
                            medium:values.medium,
                            low:values.low,
                        }
                    })
                }else{
                    Modal.warning({title:"优先级配置比例累计需100%"})

                }
            }
        });
        this.setState({
            isEdit:false,
        })
    };


    render() {
        const __=this.props.intl.formatMessage;
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 14},
            },
            wrapperCol: {
                xs: {span: 10},
            },
        };
        return <div style={{marginBottom: 16,display:"inline-block",marginRight:80}}>
            <div style={{marginBottom: 16}}>
                <span className="priority-title">{__(messages["优先级资源配置比例"])}</span><Icon onClick={this.changeMode} type="edit"/>
            </div>
            <Form layout="inline">
                {this.state.isEdit ? <FormItem label={__(messages["紧急"])} {...modalFormLayout}>
                    {getFieldDecorator('urgent', {
                        rules: [{
                            required: true,
                            message: __(messages["请输入优先级比例"])
                        },],initialValue:this.props.ci0601Info.priorityData.urgent
                    })(
                        <InputNumber formatter={value => `${value}%`}
                                     parser={value => value.replace('%', '')}
                                     min={0} max={100}/>
                    )}
                </FormItem> : <FormItem label={__(messages["紧急"])} {...modalFormLayout}>
                        &nbsp;&nbsp;{this.props.ci0601Info.priorityData.urgent}%
                </FormItem>}
                {this.state.isEdit ? <FormItem label={__(messages["高"])} {...modalFormLayout}>
                    {getFieldDecorator('high', {
                        rules: [{
                            required: true,
                            message: __(messages["请输入优先级比例"])
                        },],initialValue:this.props.ci0601Info.priorityData.high
                    })(
                        <InputNumber formatter={value => `${value}%`}
                                     parser={value => value.replace('%', '')}
                                     min={0} max={100}/>
                    )}
                </FormItem> : <FormItem label={__(messages["高"])} {...modalFormLayout}>
                    &nbsp;&nbsp;{this.props.ci0601Info.priorityData.high}%
                </FormItem>}
                {this.state.isEdit ? <FormItem label={__(messages["中"])} {...modalFormLayout}>
                    {getFieldDecorator('medium', {
                        rules: [{
                            required: true,
                            message: __(messages["请输入优先级比例"])
                        },],initialValue:this.props.ci0601Info.priorityData.medium
                    })(
                        <InputNumber formatter={value => `${value}%`}
                                     parser={value => value.replace('%', '')}
                        min={0} max={100}/>
                    )}
                </FormItem> : <FormItem label={__(messages["中"])} {...modalFormLayout}>
                    &nbsp;&nbsp;{this.props.ci0601Info.priorityData.medium}%
                </FormItem>}
                {this.state.isEdit ? <FormItem label={__(messages["低"])} {...modalFormLayout}>
                    {getFieldDecorator('low', {
                        rules: [{
                            required: true,
                            message: __(messages["请输入优先级比例"])
                        },],initialValue:this.props.ci0601Info.priorityData.low
                    })(
                        <InputNumber formatter={value => `${value}%`}
                                     parser={value => value.replace('%', '')}
                                     min={0} max={100}/>
                    )}
                </FormItem> : <FormItem label={__(messages["低"])} {...modalFormLayout}>
                    &nbsp;&nbsp;{this.props.ci0601Info.priorityData.low}%
                </FormItem>}
                {this.state.isEdit ? <div className="ratio-confirm">
                    <FormItem {...modalFormLayout}>
                        <Icon type="check" className="check" onClick={this.update_app_priority}/>
                    </FormItem>
                    <FormItem {...modalFormLayout}>
                        <Icon type="close" className="close" onClick={this.closeEditMode}/>
                    </FormItem>
                </div> : ""}
            </Form>
        </div>
    }
}

function mapDispatchToProps({ci0601Info}) {
    return {ci0601Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(PriorityRatioSetup)))
