/**
 * 告警信息详情组件
 **/
import React from 'react';
import {Card} from 'antd';
import BossTable from "../../Common/BossTable";
import {commonTranslate, parse} from '../../../utils/commonUtilFunc';
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
class MI1802C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() {
        this.get_redis_alarm_log();
    }


    get_redis_alarm_log=()=>{
        this.props.dispatch({
            type:"mi1802Info/get_redis_alarm_log",
            payload:{
               alarm_id:parse(this.props.location.search).alarm_id
            }
        })
    };
    render() {
        const __=commonTranslate(this);
        const columns=[
            {
                title: __(messages["处理时间"]),
                dataIndex: "deal_time",
                key: "deal_time",
            },{
                title: __(messages["经办人"]),
                dataIndex: "username",
                key: "username",
            },{
                title: __(messages["操作记录"]),
                dataIndex: "action",
                key: "action",
            },{
                title: __(messages["结果反馈"]),
                dataIndex: "response",
                key: "response",
            },{
                title: __(messages["日志下载地址"]),
                dataIndex: "log_address",
                key: "log_address",
                render:(text)=>{
                    return <a href={text}>{text}</a>
                }
            },{
                title: __(messages["说明"]),
                dataIndex: "remark",
                key: "remark",
            },];
        return (
            <Card className='card'>
               <BossTable columns={columns} dataSource={this.props.mi1802Info.alarmLogList}/>
            </Card>
        )
    }
}

export default injectIntl(MI1802C);