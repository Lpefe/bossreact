/**
 * 商务-设备信息*/
import React from 'react';
import './index.scss';
import {Modal, Card, Select} from 'antd';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import cMessages from "../../../locales/commonMessages";
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';
import {deviceTypeMap} from "../../../utils/commonUtilFunc";
import {domain} from "../../../utils/commonConsts";
import BossDataHeader from "../../Common/BossDataHeader"; 
import {parse} from '../../../utils/commonUtilFunc';
const Option = Select.Option;

class BI0301 extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.location.search);
        this.state = {
            addLinkModalShow: false,
            selectedAgency0: "",
            ids: "",
            net_type: "",
            name: "",
            alertModalShow: false,
            type: "STEP,CSTEP,AP",
            status: search.status||"",
            id: search.id||"",
            model:"",
            page_size:20,
            page_no:1,

        }
    }

    componentDidMount() {
        this.get_device_list();
        this.get_device_stat();
        this.get_device_model();
    }

    get_device_model=()=>{
        this.props.dispatch({
            type: "ci0101Info/get_device_model",
            payload: {

            }
        })
    };


    get_device_list = () => {
        this.props.dispatch({
            type: "ci0101Info/getDeviceList",
            payload: {
                company_id:this.state.id,
                net_type: this.state.net_type,
                name: this.state.name ,
                status: this.state.status ,
                type: this.state.type,
                model:this.state.model,
                page_size:this.state.page_size,
                page_no:this.state.page_no,

            }
        })
    };


    searchDevice = (value) => {
        this.setState({
            name: value || "",
            page_size:20,
            page_no:1,
        }, ()=>{
            this.get_device_list();
        })
    };

    get_device_stat = () => {
        this.props.dispatch({
            type: "ci0101Info/get_device_stat",
            payload: {}
        })
    };

    handleChangeStatus = (value) => {
        this.setState({
            status: value || "",
            page_size:20,
            page_no:1,
        }, ()=>{
            this.get_device_list();
        })
    };

    handleSelectType = (value) => {
        this.setState({
            type: value || "STEP,CSTEP,AP",
            page_size:20,
            page_no:1,
        },  ()=> {
            this.get_device_list();
        })
    };

    handleSelectModel=(value)=>{
        this.setState({
            model: value || "",
            page_size:20,
            page_no:1,
        },  () =>{
            this.get_device_list();
        })
    };


    handleCloseAlertModal = () => {
        this.props.dispatch({
            type: "ci0101Info/closeAlertModal"
        })
    };
    checkLink = (status) => {
        this.setState({
            status: status,
            page_size:20,
            page_no:1,
        },()=>{
            this.get_device_list()
        })
    };

    gotoDevice = (record) => {
        window.open(domain+"/index."+window.appLocale.locale+ ".html#/main/bi0301/bi0302?id=" + record.id + "&sn=" + record.sn + "&type=" + record.type + "&from=device")
    };
    render() {
        const __=this.props.intl.formatMessage;
        const columns = [{
            title: __(messages['设备名称']),
            dataIndex: 'name',
            key: 'name',
            render: (index, record) => {
                return <span onClick={()=>this.gotoDevice(record)} className='common-link-icon'>{record.name}</span>
            }
        }, {
            title: __(messages['状态']),
            dataIndex: 'status',
            key: 'status', render: (index, record) => {
                switch (record.status) {
                    case "INIT":
                        return <span style={{color: "#FFD02D"}}>{record.status}</span>
                    case "ONLINE":
                        return <span style={{color: "#0EC80E"}}>{record.status}</span>
                    case "OFFLINE":
                        return <span style={{color: "#ff0002"}}>{record.status}</span>
                    default:
                        break;
                }
            }
        }, {
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_name',
        }, {
            title: __(messages['节点名称']),
            dataIndex: 'agency_name',
            key: 'agency_name',
        }, {
            title: __(messages['设备类型']),
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                return deviceTypeMap(text)
            }
        }, {
            title: __(messages['设备型号']),
            dataIndex: 'model',
            key: 'model',
        }, {
            title: __(messages['设备序列号']),
            dataIndex: 'sn',
            key: 'sn',
        }];

        const option = [
            <Option value="ONLINE" key="ONLINE">ONLINE</Option>,
            <Option value="INIT" key="INIT">INIT</Option>,
            <Option value="OFFLINE" key="OFFLINE">OFFLINE</Option>
        ];

        const optionTwo = [
            <Option value="STEP" key="STEP">BCPE</Option>,
            <Option value="CSTEP" key="CSTEP">HCPE</Option>,
        ];

        const optionsThree = this.props.ci0101Info.deviceModelList.map((model)=>{
            return <Option value={model.model} key={model.id}>{model.model}</Option>
        });

        const alertColumns = [
            {
                title: __(messages['开始时间']),
                dataIndex: 'begin_time',
                key: 'begin_time',
            }, {
                title: __(messages['结束时间']),
                dataIndex: 'end_time',
                key: 'end_time',
            }, {
                title: __(messages['类型']),
                dataIndex: 'type',
                key: 'type',
            },
        ];

        return (
            <div>
                <BossDataHeader offLine={this.props.ci0101Info.OFFLINE}
                                init={this.props.ci0101Info.INIT}
                                onLine={this.props.ci0101Info.ONLINE}
                                total={this.props.ci0101Info.INIT + this.props.ci0101Info.OFFLINE + this.props.ci0101Info.ONLINE}
                                checkLink={this.checkLink}
                                TotalLink="设备总数"
                                changeImg={false}
                />
                <Card className="card">
                    <HeaderBar hasDelete={false} hasSelect={true} hasSelectTwo={true}
                               hasSearch={true} selectOneMethod={this.handleChangeStatus}
                               selectTwoMethod={this.handleSelectType}
                               selectPlaceHolder={__(cMessages['请选择状态'])} submit={this.searchDevice} selectTwoPlaceHolder={__(messages["请选择设备类型"])}
                               options={option} optionsTwo={optionTwo} hasSelectThree={true} optionsThree={optionsThree} selectThreePlaceHolder="请选择设备型号" selectThreeMethod={this.handleSelectModel}/>
                    <BossTable paging={true} getData={this.get_device_list} component={this} total={this.props.ci0101Info.total} columns={columns}
                               dataSource={this.props.ci0101Info.deviceData}/>
                </Card>
                <Modal maskClosable={false} visible={this.props.ci0101Info.alertModalShow}
                       onCancel={this.handleCloseAlertModal} title={__(messages["24小时警报"])}
                       size="middle" bordered>
                    <BossTable columns={alertColumns} dataSource={this.props.ci0101Info.alarmList}/>
                </Modal>
            </div>
        )
    }
}

export default injectIntl(BI0301);