import React from 'react';

import {Form,  Button, Select,InputNumber} from 'antd';

import {connect} from 'dva';
import {injectIntl} from "react-intl";
import messages from '../LocaleMsg/messages';
const Option = Select.Option;
const FormItem = Form.Item;

class AddRoomForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    create_isp=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err,values)=>{
            if(!err){
                this.props.dispatch({
                    type:"mi0301Info/create_isp",
                    payload:{
                        room_id:this.props.room_id,
                        isp:values.isp,
                        bandwidth:values.bandwidth,
                        speed:values.speed,
                    }
                });
                this.props.cancel();
                this.props.form.resetFields();
            }
        })
    };

    render() {
        const __=this.props.intl.formatMessage;
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        return (<Form onSubmit={this.create_isp}>
            <FormItem label={__(messages["运营商"])} {...modalFormLayout}>
                {getFieldDecorator('isp', {
                    rules: [{required: true, message: __(messages["请选择运营商"])}],
                })(
                    <Select placeholder={__(messages["请选择运营商"])}>
                        {this.props.mi0301Info.ispOptionList.map((item)=>{
                            return <Option value={item.code} key={item.id}>{item.name}</Option>
                        })}
                    </Select>
                )}
            </FormItem>
            <FormItem label={__(messages["带宽"])} {...modalFormLayout}>
                {getFieldDecorator('bandwidth', {
                    rules: [{required: true, message: __(messages["请输入带宽"])}],
                })(
                    <InputNumber placeholder={__(messages["请输入带宽"])} style={{width:315}}/>
                )}
            </FormItem>
            <FormItem label={__(messages["速率"])} {...modalFormLayout}>
                {getFieldDecorator('speed', {
                    rules: [{required: true, message: __(messages["请输入速率"])}],
                })(
                    <InputNumber placeholder={__(messages["请输入速率"])} style={{width:315}}/>
                )}
            </FormItem>
            <Button htmlType="submit">{__(messages["确认添加"])}</Button>
        </Form>)
    }
}


function mapDispatchToProps({mi0301Info}) {
    return {mi0301Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(AddRoomForm)));