/**
 * 链路详情,设备详情-版本信息组件
 **/
import React from 'react';
import messages from '../../LocaleMsg/messages';
import {connect} from "dva";
import {Form} from "antd";
import {withRouter} from "react-router-dom";
import {injectIntl} from "react-intl";

const FormItem=Form.Item;


class VersionInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {

    }

    render() {
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 19},
            },
        };
        const {deviceInfo}=this.props.mi0102Info;
        const __=this.props.intl.formatMessage;
        return (
            <div style={{width:720}}>
                <Form>
                    <FormItem label={__(messages["升级包版本"])} {...modalFormLayout} >{deviceInfo.version}</FormItem>
                    <FormItem label={__(messages["更新时间"])} {...modalFormLayout} >{deviceInfo.version_update_time}</FormItem>
                    <FormItem label={__(messages["操作系统"])} {...modalFormLayout} >{deviceInfo.os_version}</FormItem>
                    <FormItem label="Step_main" {...modalFormLayout} >{deviceInfo.step_version}</FormItem>
                    <FormItem label="dyagent" {...modalFormLayout} >{deviceInfo.agent_version}</FormItem>
                    <FormItem label="WebUI" {...modalFormLayout} >{deviceInfo.webui_version}</FormItem>
                    <FormItem label="DPI" {...modalFormLayout} >{deviceInfo.dpi_version}</FormItem>
                    <FormItem label={__(messages["组件库"])} {...modalFormLayout} >{deviceInfo.library_version}</FormItem>
                </Form>
            </div>
        )
    }
}

function mapDispatchToProps({mi0102Info}) {
    return {mi0102Info};
}


export default connect(mapDispatchToProps)(Form.create()(withRouter(injectIntl(VersionInfo))));