
/**
 * 商务-设备信息详情*/
import React from 'react';
import './index.scss';
import DeviceInfo from './subComponents/DeviceInfo';
import LTEInfo from './subComponents/LTEInfo';
import WanInfo from './subComponents/WanInfo';
import {parse} from '../../../utils/commonUtilFunc'
import AgencyInfo from "./subComponents/AgencyInfo";


class BI0302 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            deviceInfo: {},
        }
    }

    componentDidMount() {
        this.get_wan_info();
        this.get_device_info();

    }

    get_device_info = () => {
        this.props.dispatch({
            type: "ci0102Info/get_device_list",
            payload: {
                id: parse(this.props.location.search).id
            }
        })
    };

    get_wan_info() {
        this.props.dispatch({
            type: "ci0102Info/get_wan_info",
            payload: {
                sn: parse(this.props.location.search).sn
            }
        })
    }

    render() {
        return <div>
            <DeviceInfo deviceInfo={this.props.ci0102Info.deviceInfo}/>
            <AgencyInfo deviceInfo={this.props.ci0102Info.deviceInfo}/>
            <LTEInfo deviceInfo={this.props.ci0102Info.deviceInfo}/>
            <WanInfo/>
        </div>
    }
}

export default BI0302;