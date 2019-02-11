/**
 * 客户-流量分析-设备流量概况
 * */
import React from 'react';
import './index.scss';
import {Card, Tabs} from 'antd';
import {commonTranslate, parse} from "../../../utils/commonUtilFunc";
import {withRouter} from 'react-router-dom';
import {addComma} from "../../../utils/commonUtilFunc";
import FlowInfo from "./subComponents/FlowInfo";
import AppRank from "./subComponents/AppRank";
import UserFlowRank from "./subComponents/UserFlowRank";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
const TabPane=Tabs.TabPane;


class CI0304 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.ref={};
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    switchTab=(key)=>{
        if(key==='2'&&this.ref.get_step_apps){
            this.ref.get_step_apps();
        }
    };

    onRef=(vm)=>{
        this.ref=vm;
    };
    render() {
        const __ = commonTranslate(this);
        const search=parse(this.props.location.search);
        return (
            <Card className="card">
                <header>
                    <div className="title-device-name">{__(messages["设备名称"])}:{parse(this.props.location.search).device_name}</div>
                    <div className="title-device-info"><span>{__(messages["时间段"])}:&nbsp;&nbsp;{search.start_tm}&nbsp;{__(messages["至"])}&nbsp;{search.end_tm}</span><span>{__(messages["流量类型"])}:&nbsp;&nbsp;{search.tunnel_dir}</span><span>{__(messages["流量大小"])}:&nbsp;{addComma(search.flow)}&nbsp;&nbsp;MB</span></div>
                </header>
                <Tabs onChange={this.switchTab}>
                    <TabPane tab={__(messages["流量概况"])} key="1">
                        <FlowInfo/>
                    </TabPane>
                    <TabPane tab={__(messages["应用排行榜"])} key="2">
                        <AppRank onRef={this.onRef}/>
                    </TabPane>
                    <TabPane tab={__(messages["用户排行榜"])} key="3">
                        <UserFlowRank flow={search.flow}/>
                    </TabPane>
                </Tabs>
            </Card>
        )
    }
}

export default withRouter(injectIntl(CI0304));