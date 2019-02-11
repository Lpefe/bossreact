import React from 'react';
import {Row,Col} from 'antd';

class DeviceInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount(){

    }

    render() {
        return (
            <div>
                <header className="device-info-header">设备信息</header>
                <section className="device-info-container">
                    <Row className="device-info-row">
                        <Col span={8} className="device-info-col">
                            <span className="label">设备名称:</span>
                            <span className="value">{this.props.deviceInfo.name}</span>
                        </Col>
                        <Col span={8} className="device-info-col">
                            <span className="label">硬件型号:</span>
                            <span className="value">{this.props.deviceInfo.model}</span>
                        </Col>
                        <Col span={8} className="device-info-col">
                            <span className="label">接入方式:</span>
                            <span className="value">{this.props.deviceInfo.mode}</span>
                        </Col>
                    </Row>
                    <Row className="device-info-row">
                        <Col span={8} className="device-info-col">
                            <span className="label">设备序列号:</span>
                            <span className="value">{this.props.deviceInfo.sn}</span>
                        </Col>
                        <Col span={8} className="device-info-col">
                            <span className="label">设备类型:</span>
                            <span className="value">{this.props.deviceInfo.type}</span>
                        </Col>
                        <Col span={8} className="device-info-col">
                            <span className="label">工作模式:</span>
                            <span className="value">{this.props.deviceInfo.net_type}</span>
                        </Col>
                    </Row>
                    <Row className="device-info-row">
                        <Col span={8} className="device-info-col">
                            <span className="label">状态:</span>
                            <span className="value">{this.props.deviceInfo.status}</span>
                        </Col>
                        <Col span={8} className="device-info-col">
                            <span className="label">持续工作时间:</span>
                            <span className="value">{this.props.deviceInfo.run_time}</span>
                        </Col>
                    </Row>
                </section>
            </div>
        )
    }
}

export default DeviceInfo;