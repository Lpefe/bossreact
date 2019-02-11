/**
 * 组件demo
 **/
import React from 'react';
import {Card, Icon, Select} from 'antd';
import BossTable from "../../Common/BossTable";
import HeaderBar from "../../Common/HeaderBar";
import './index.scss';
import BossEditModal from "../../Common/BossEditModal";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
import {deviceTypeMap} from "../../../utils/commonUtilFunc";
import {get_device_model} from "../../../services/Company/companyS";

const Option = Select.Option;

class MI1601C extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "OUT",
            model: "",
            name: "",
            type: "",
            showEditInput: true,
            ifDeliveryModalShow: false,
            editId: "",
            editRecord: {},
        };

    }

    componentDidMount() {
        this.get_stock_stat();
        this.get_stock_list();
        this.get_device_model();
    }

    get_stock_stat = () => {
        this.props.dispatch({
            type: "mi1601Info/get_stock_stat",
            payload: {
                status: "OUT",
            }
        })
    };

    get_device_model=()=>{
        this.props.dispatch({
            type:"mi1601Info/get_device_model",
            payload:{

            }
        })
    };

    //获取库存列表
    get_stock_list = () => {
        this.props.dispatch({
            type: "mi1601Info/get_stock_list",
            payload: {
                status: this.state.status,
                model: this.state.model,
                name: this.state.name,
                type: this.state.type
            }
        })
    };

    handleOpenDeliveryInfoModal = (record) => {
        this.setState({
            ifDeliveryModalShow: true,
            editId: record.id,
            editRecord: record,
        })
    };

    handleCloseDeliveryInfoModal = () => {
        this.setState({
            ifDeliveryModalShow: false,
            editId: "",
            editRecord: {},
        })
    };

    handleSelectDeviceType = (value) => {
        let vm = this;
        this.setState({
            type: value || ""
        }, function () {
            vm.get_stock_list();
        })
    };
    handleSelectDeviceModel = (value) => {
        let vm = this;
        this.setState({
            model: value || ""
        }, function () {
            vm.get_stock_list();
        })
    };


    handleSubmit = (value) => {
        let vm = this;
        this.setState({
            name: value
        }, function () {
            vm.get_stock_list();
        })
    };

    render() {
        const __ = this.props.intl.formatMessage;

        const stockStatColumnsD = [];
        for(let key in this.props.mi1601Info.deviceStatDataSource[0]){
            stockStatColumnsD.push({
                title:key==="title"?"":key==="total"?"合计":key,
                dataIndex:key,
                key:key
            })
        }
        const columns = [{
            title: __(messages['出库时间']),
            dataIndex: 'out_time',
            key: 'out_time',

        }, {
            title: __(messages['设备序列号']),
            dataIndex: 'sn',
            key: 'sn',
        }, {
            title: __(messages['硬件编号']),
            dataIndex: 'hard_sn',
            key: 'hard_sn',
        }, {
            title: __(messages['设备型号']),
            dataIndex: 'model',
            key: 'model',
        }, {
            title: __(messages['设备名称']),
            dataIndex: 'name',
            key: 'name',
        }, {
            title: __(messages['设备类型']),
            dataIndex: 'type',
            key: 'type',
            render: (text) => {
                return deviceTypeMap(text)
            }
        }, {
            title: __(messages['操作系统']),
            dataIndex: 'os',
            key: 'os',
        }, {
            title: __(messages['快递单号']),
            dataIndex: 'delivery_number',
            key: 'delivery_number',
        }, {
            title: __(messages['快递公司']),
            dataIndex: 'delivery_company',
            key: 'delivery_company',
        }, {
            title: __(messages['经办人']),
            dataIndex: 'user',
            key: 'user',
        }, {
            title: __(messages['物流信息']),
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            render: (text, record) => {
                return <Icon type="edit" onClick={() => this.handleOpenDeliveryInfoModal(record)}/>
            }
        },];

        const ModalOptions = {
            title: __(messages["编辑物流信息"]),
            visible: this.state.ifDeliveryModalShow,
            onCancel: this.handleCloseDeliveryInfoModal,
            dispatch: this.props.dispatch,
            submitType: "mi1601Info/update_stock",
            extraUpdatePayload: {id: this.state.editId},
            initialValues: this.state.editRecord,
            bodyHeight: 160,
            initPayload: {
                status: this.state.status,
                model: this.state.model,
                name: this.state.name,
                type: this.state.type
            },
            InputItems: [{
                type: "Input",
                labelName: __(messages["物流公司"]),
                valName: "delivery_company",
                nativeProps: {
                    placeholder: __(messages["请输入物流公司"]),
                },
                rules: [{max: 128, message: __(messages["物流公司最多输入128字符"])}],
            }, {
                type: "Input",
                labelName: __(messages["物流单号"]),
                valName: "delivery_number",
                nativeProps: {
                    placeholder: __(messages["请输入物流单号"]),
                },
                rules: [{max: 64, message: __(messages["物流单号最多输入64字符"])}],
            }]
        };
        //
        const optionOne = [
            <Option value="STEP" key="STEP">BCPE</Option>,
            <Option value="CSTEP" key="CSTEP">HCPE</Option>,
        ];

        const optionTwo=this.props.mi1601Info.modelList.map((item)=>{
            return <Option value={item.model} key={item.id}>{item.model}</Option>
        });

        return (
            <div>
                <Card className="card">
                    <BossTable columns={stockStatColumnsD} style={{marginBottom: 32}}
                               dataSource={this.props.mi1601Info.deviceStatDataSource} pagination={false}/>
                </Card>
                <Card className="card">
                    <HeaderBar hasSelect={true} hasSelectTwo={true} hasSearch={true}
                               selectPlaceHolder={__(messages["请选择设备类型"])}
                               selectTwoPlaceHolder={__(messages["请选择设备型号"])} options={optionOne}
                               optionsTwo={optionTwo} selectOneMethod={this.handleSelectDeviceType}
                               submit={this.handleSubmit}
                               selectTwoMethod={this.handleSelectDeviceModel}/>
                    <BossTable columns={columns} dataSource={this.props.mi1601Info.deviceList}/>
                    <BossEditModal {...ModalOptions}/>
                </Card>
            </div>
        )
    }
}

export default injectIntl(MI1601C);