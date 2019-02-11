import React from 'react';
import {Radio, Form} from 'antd';
import {connect} from 'dva';

const FormItem = Form.Item;

const RadioGroup = Radio.Group;

class LTEInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

    }

    changeLteInfo=(e)=> {
        this.props.dispatch({
            type:"ci0102Info/update_device",
            payload:{
                id:this.props.deviceInfo.id,
                lte_info:e.target.value
            }
        })
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <div style={{marginBottom: 24}}>
                <header className="device-info-header">LTE(4G) 链路信息</header>
                <section className="LTE-info-container">
                    <Form>
                        <FormItem>
                            {getFieldDecorator('receive_tel', {
                                initialValue:this.props.deviceInfo.lte_info
                            })(<RadioGroup onChange={this.changeLteInfo}>
                                <Radio value="main" className="radio-btn">有4G卡,并作为主线路使用</Radio>
                                <Radio value="backup" className="radio-btn">有4G卡,并作为备用线路使用</Radio>
                                <Radio value="none" className="radio-btn">无4G卡</Radio>
                            </RadioGroup>
                            )}
                        </FormItem>
                    </Form>
                </section>
            </div>
        )
    }
}

function mapDispatchToProps({ci0102Info}) {
    return {ci0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(LTEInfo));