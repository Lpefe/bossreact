import React from 'react';
import {connect} from 'dva';
import {Modal, Form, Input,} from 'antd';
import messages from '../LocaleMsg/messages';
import {injectIntl} from "react-intl";
const FormItem = Form.Item;

class AddIpTableModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

    }

    handleSubmit = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.props.recordId) {
                    this.props.dispatch({
                        type: "bi1001Info/update_iptable",
                        payload: {
                            id: this.props.recordId,
                            iptable: values.iptable,
                            remark: values.remark,
                            company_id: this.props.company_id,
                            agency_id: this.props.agency_id,
                            record:this.props.record
                        }
                    })
                } else {
                    this.props.dispatch({
                        type: "bi1001Info/create_iptable",
                        payload: {
                            company_id: this.props.company_id,
                            agency_id: this.props.agency_id,
                            iptable: values.iptable,
                            remark: values.remark
                        }
                    })
                }
                this.props.cancel();
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
        return <Modal visible={this.props.visible} title={this.props.recordId ? __(messages["编辑IP段"]) : __(messages["新增IP段"])}
                      onCancel={this.props.cancel} destroyOnClose onOk={this.handleSubmit}>
            <Form>
                <FormItem label={__(messages["IP段"])} {...modalFormLayout}>
                    {getFieldDecorator('iptable', {
                        rules: [{
                            required: true,
                            message: __(messages["请输入IP段"])
                        }, {
                            pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\/([1-9]|[1-2]\d|3[0-2]|0)$/,
                            message: __(messages["IP段的提示格式：用 1.1.1.1-1.1.1.10,1.1.1.0/24,1.1.1.1 的格式输入"])
                        }],
                        initialValue: this.props.record.iptable

                    })(
                        <Input placeholder={__(messages["请输入IP段"])}/>
                    )}
                </FormItem>
                <FormItem label={__(messages["备注"])} {...modalFormLayout}>
                    {getFieldDecorator('remark', {
                        rules: [],
                        initialValue: this.props.record.remark

                    })(
                        <Input placeholder={__(messages["请输入备注"])}/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    }
}

function mapDispatchToProps({bi1001Info}) {
    return {bi1001Info};
}

export default connect(mapDispatchToProps)(Form.create()(injectIntl(AddIpTableModal)));