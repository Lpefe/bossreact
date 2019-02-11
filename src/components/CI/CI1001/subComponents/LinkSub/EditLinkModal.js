import React from 'react';
import {connect} from 'dva';
import {Modal, Select, Form, Input,} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class EditLinkModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount(){

    }


    addLink = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.props.recordId){
                    this.props.dispatch({
                        type: "ci1001Info/updateTopo",
                        payload: {
                            id:this.props.recordId,
                            company_id: this.props.company_id,
                            agency_id_0: values.agency0,
                            agency_id_1: values.agency1,
                            charge_type: values.charge_type,
                            grade: values.grade,
                            bandwidth: values.bandwidth,
                        }
                    });
                }else{
                    this.props.dispatch({
                        type: "ci1001Info/createTopo",
                        payload: {
                            company_id: this.props.company_id,
                            agency_id_0: values.agency0,
                            agency_id_1: values.agency1,
                            charge_type: values.charge_type,
                            grade: values.grade,
                            bandwidth: values.bandwidth,
                        }
                    });
                }

                this.props.cancel();
            }
        })
    };
    selectPartLink = (value) => {
        let optionData2 = this.props.ci1001Info.optionData2;
        optionData2.map((item) => {
            if (item.id === value) {
                item.disabled = true;
                return item;
            } else {
                item.disabled = false;
                return item
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };


        return <Modal maskClosable={false} title={this.props.recordId ? "编辑链路" : "添加链路"} onCancel={this.props.cancel}
                      visible={this.props.visible} onOk={this.addLink} destroyOnClose>
            <Form>
                {<FormItem label="边缘" {...modalFormLayout}>
                    {getFieldDecorator('agency0', {
                        rules: [{required: true, message: "请选择边缘节点"}],
                        initialValue:this.props.record.agency_id_0
                    })(
                        <Select placeholder="请选择边缘节点" onChange={this.selectPartLink} disabled={this.props.recordId} >
                            {
                                this.props.ci1001Info.optionData.map((item) => {
                                    return (
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                </FormItem>}
                <FormItem label="总部" {...modalFormLayout}>
                    {getFieldDecorator('agency1', {
                        rules: [{required: true, message: "请选择中心节点"}],
                        initialValue:this.props.record.agency_id_1
                    })(
                        <Select placeholder="请选择中心节点" disabled={this.props.recordId}>
                            {
                                this.props.ci1001Info.optionData2.map((item) => {
                                    return (
                                        <Option key={item.id} value={item.id} disabled={item.disabled}>{item.name}</Option>
                                    )
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem label="等级" {...modalFormLayout}>
                    {getFieldDecorator('grade', {
                        rules: [{required: true, message: "请选择等级"}],
                        initialValue:this.props.record.grade
                    })(
                        <Select placeholder="请选择等级" disabled={this.props.recordId}>
                            <Option value="CLOUD_VPN">云VPN</Option>
                            <Option value="CLOUD_SPLINE">云专线</Option>
                            <Option value="SUPER_CLOUD_SPLINE">超级云专线</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label="计费" {...modalFormLayout}>
                    {getFieldDecorator('charge_type', {
                        rules: [{required: true, message: "请选择计费模式"},],
                        initialValue:this.props.record.charge_type
                    })(
                        <Select placeholder="请选择计费模式">
                            <Option value="固定带宽">固定带宽</Option>
                            <Option value="流量计费">流量计费</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem label="带宽" {...modalFormLayout}>
                    {getFieldDecorator('bandwidth', {
                        rules: [{required: true, message: "请输入分支带宽"}],
                        initialValue:this.props.record.bandwidth
                    })(
                        <Input placeholder="请输入分支带宽"/>
                    )}
                </FormItem>
            </Form>
        </Modal>
    }
}

function mapDispatchToProps({ci1001Info}) {
    return {ci1001Info};
}

export default connect(mapDispatchToProps)(Form.create()(EditLinkModal));