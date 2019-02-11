/**
 * 运维-设备信息详情
 * */
import React from 'react';
import './index.scss';
import {parse} from '../../../utils/commonUtilFunc'
import {Card, Tabs} from 'antd';
import SysInfo from "./subComponents/Tab-SystemInfo/SysInfo";
import TabWanInfo from "./subComponents/Tab-WanInfo/TabWanInfo";
import TunnelInfo from "./subComponents/Tab-TunnelInfo/TunnelInfo";
import BaseInfo from "./subComponents/Tab-BaseInfo/BaseInfo";
import {injectIntl} from "react-intl";
import messages from "./LocaleMsg/messages";
import VersionInfo from "./subComponents/Tab-VersionInfo/VersionInfo";
import TunnelInfoHcpe from "./subComponents/Tab-TunnelInfo-HCPE/TunnelInfoHcpe";
import BaseInfoAp from "./subComponents/Tab-BaseInfo/BaseInfoAp";


const TabPane = Tabs.TabPane;

class MI0102 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceInfo: {},
        }
    }

    componentDidMount() {
        this.get_device_info();
        this.get_link_list();
    }

    get_device_info = () => {
        this.props.dispatch({
            type: "mi0102Info/get_device_list",
            payload: {
                id: parse(this.props.location.search).id
            }
        })
    };

    get_link_list() {
        this.props.dispatch({
            type: "mi0102Info/get_link_list",
            payload: {
                device_id: parse(this.props.location.search).id
            }
        })
    };


    render() {
        const __ = this.props.intl.formatMessage;
        const search = parse(this.props.location.search);
        const role = sessionStorage.getItem("role");
        const ifShowVersionInfo = role === "supercxptechnology" || role === "supercxptechsupport" || role === "supercxptechadmin";//判断是否是技术支持或者运维角色
        return <Card className="card">
            {search.ifAlarm === "true" ? <div>
                <div className="link-info-link-name">{search.name}</div>
                <div
                    className="link-info-load">发生时间:{search.time}&nbsp;&nbsp;&nbsp;&nbsp;消息类型:{search.alarm_level}&nbsp;&nbsp;&nbsp;&nbsp;详细描述:{search.remark}</div>
            </div> : ""}
            <Tabs defaultActiveKey="2" onChange={this.handleTabChange}>
                <TabPane tab={__(messages["系统信息"])} key="2">
                    <SysInfo/>
                </TabPane>
                {search.type === 'AP' ? "" : <TabPane tab={__(messages["WAN口"])} key="3">
                    <TabWanInfo/>
                </TabPane>}
                {search.type === 'AP' ? "" : <TabPane tab={__(messages["隧道信息"])} key="4">
                    {(search.type === "CSTEP" && search.from === "device" ?
                        <TunnelInfoHcpe/> :
                        <TunnelInfo/>)}{/*需求:在技术支持或运维角色进入查看中心设备信息,给出不同图表*/}
                </TabPane>}
                <TabPane tab={__(messages["基本信息"])} key="1">
                    {search.type === 'AP' ?<BaseInfoAp type={parse(this.props.location.search).type}/>:<BaseInfo type={parse(this.props.location.search).type}/>}
                </TabPane>
                {ifShowVersionInfo && search.type !== 'AP' ? <TabPane tab={__(messages["版本信息"])} key="5">
                    <VersionInfo/>
                </TabPane> : ""}
            </Tabs>
        </Card>
    }
}

export default injectIntl(MI0102);