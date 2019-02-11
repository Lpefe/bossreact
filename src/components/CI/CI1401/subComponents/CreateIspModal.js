import React from 'react';
import {connect} from 'dva';
import {Modal, Form, Select, Input, InputNumber} from 'antd';
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";
const FormItem = Form.Item;
const Option = Select.Option;

class CreateIspModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleSubmitCreateIsp = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.props.id) {
                    this.props.dispatch({
                        type: "ci1401Info/update_isp_of_cstep",
                        payload: {
                            isp: values.isp,
                            sn: this.props.sn,
                            bandwidth: values.bandwidth,
                            ip: values.ip,
                            id: this.props.id,
                            remark: values.remark
                        }
                    });
                    this.props.cancel();
                } else {
                    this.props.dispatch({
                        type: "ci1401Info/create_isp_of_cstep",
                        payload: {
                            isp: values.isp,
                            sn: this.props.sn,
                            bandwidth: values.bandwidth,
                            ip: values.ip,
                            remark: values.remark
                        }
                    });
                    this.props.cancel();
                }

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
        return <Modal maskClosable={false} visible={this.props.visible} title={this.props.id ?  __(messages["编辑ISP"]):__(messages["新增ISP"]) }
                      onCancel={this.props.cancel} onOk={this.handleSubmitCreateIsp} destroyOnClose>
            <Form>
                <FormItem label={__(messages["运营商"])} {...modalFormLayout}>
                    {getFieldDecorator('isp', {
                        rules: [{required: true, message: __(messages["请选择运营商"])}],
                        initialValue: this.props.record.isp
                    })(
                        <Select placeholder={__(messages["请选择运营商"])}>
                            {this.props.ci1401Info.ispList.map((item)=>{
                                return <Option value={item.code} key={item.id}>{item.name}</Option>
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem label={__(messages["带宽"])} {...modalFormLayout}>
                    <div>
                        {getFieldDecorator('bandwidth', {
                            rules: [{required: true, message: __(messages["请输入带宽"])},],
                            initialValue: this.props.record.bandwidth
                        })(
                            <InputNumber placeholder={__(messages["请输入带宽"])} style={{width: 313}}
                                         min={0} max={999999}
                                         formatter={value => `${value}M`}
                                         parser={value => value.replace('M', '')}/>
                        )}
                    </div>
                </FormItem>
                <FormItem label="IP" {...modalFormLayout}>
                    {getFieldDecorator('ip', {
                        rules: [{
                            required: true,
                            message: __(messages["请输入运营商IP"])
                        }, {
                            pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
                            message: __(messages["请输入正确IP格式"])
                        }],
                        initialValue: this.props.record.ip
                    })(
                        <Input placeholder={__(messages["请输入运营商IP"])}/>
                    )}
                </FormItem>
                <FormItem label={__(messages["备注"])} {...modalFormLayout}>
                    {getFieldDecorator('remark', {
                        initialValue: this.props.record.remark
                    })(
                        <Input placeholder={__(messages["请输入备注"])}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    }

}

function mapDispatchToProps({ci1401Info}) {
    return {ci1401Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(CreateIspModal)));