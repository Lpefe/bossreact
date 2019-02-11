import React from 'react';
import {Row,Col} from 'antd';

class AgencyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <div>
                <header className="device-info-header">节点信息</header>
                <section className="device-info-container">
                    <Row className="device-info-row">
                        <Col span={8} className="device-info-col">
                            <span className="label">企业名称:</span>
                            <span className="value">{this.props.deviceInfo.company_name}</span>
                        </Col>
                        <Col span={8} className="device-info-col">
                            <span className="label">边缘:</span>
                            <span className="value">{this.props.deviceInfo.agency_name}</span>
                        </Col>
                    </Row>
                    <Row className="device-info-row">
                        <Col span={8} className="device-info-col">
                            <span className="label">IP/IP段:</span>
                            <span className="value">{this.props.deviceInfo.agency_iptables}</span>
                        </Col>
                    </Row>
                </section>
            </div>
        )
    }
}

export default AgencyInfo;