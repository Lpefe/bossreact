import React from 'react';
import './index.scss';
import {Card, Select} from 'antd';
import Operations from "../../Common/Operations";
import BossTable from "../../Common/BossTable";
import HeaderBar from "../../Common/HeaderBar";
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';
import BossEditModal from "../../Common/BossEditModal";
import {commonTranslate} from "../../../utils/commonUtilFunc";

const Option = Select.Option;


class MI0601 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room_id: "",
            status: "",
            name: "",
            TWSId: "",
            editModalShow: false,
            editRecord: {},
            selectedIds: "",
            selectedRecords: [],
            type: "TWS",
            level2_id: ""
        }
    }

    componentDidMount() {
        this.getDeviceList();
        this.getRoomList();
        this.get_address();
    }

    get_address = () => {
        this.props.dispatch({
            type: "mi0601Info/get_address",
            payload: {
                level: 2
            }
        })
    };

    getDeviceList = () => {
        this.props.dispatch({
            type: "mi0601Info/getDeviceList",
            payload: {
                type: this.state.type,
                level2_id: this.state.level2_id,
                room_id: this.state.room_id,
                status: this.state.status,
                name: this.state.name,
            }
        });

    };

    getRoomList = () => {
        this.props.dispatch({
            type: "mi0601Info/getRoomList",
            payload: {}
        })
    };

    selectRoom = (value) => {
        this.setState({
            room_id: value || "",
        }, () => {
            this.getDeviceList();
        })
    };

    selectAddress = (value) => {
        this.setState({
            level2_id: value || "",
        }, () => {
            this.getDeviceList();
        })
    };

    selectStatus = (value) => {
        this.setState({
            status: value || "",
        }, () => {
            this.getDeviceList();
        })
    };

    searchByTWSName = (value) => {
        this.setState({
            name: value
        }, () => {
            this.getDeviceList();
        })
    };


    addTWS = () => {
        this.setState({
            editModalShow: true
        })
    };

    editTWS = (record) => {
        this.setState({
            editModalShow: true,
            TWSId: record.id,
            editRecord: record,
        })
    };

    cancelModal = () => {
        this.setState({
            editModalShow: false,
            TWSId: "",
            editRecord: {}
        })
    };

    deleteTWS = (record) => {
        this.props.dispatch({
            type: "mi0601Info/deleteTWS",
            payload: {
                ids: [record.id],
                records: [record]
            }
        })
    };

    delete_device_batch = () => {
        this.props.dispatch({
            type: "mi0601Info/delete_device_batch",
            payload: {
                ids: this.state.selectedIds,
                records: this.state.selectedRecords,
            }
        })
    };

    render() {
        const __=commonTranslate(this);
        const columns = [{
            title: __(messages['设备名称']),
            dataIndex: 'name',
            key: 'name',
        }, {
            title: __(messages['节点IP']),
            dataIndex: 'ip',
            key: 'ip',
        }, {
            title: __(messages["区域"]),
            dataIndex: 'room_level2_name',
            key: 'room_level2_name',
        }, {
            title: __(messages['版本']),
            dataIndex: 'version',
            key: 'version',
        }, {
            title: __(messages['机房']),
            dataIndex: 'room_name',
            key: 'room_name',
        }, {
            title: __(messages['型号']),
            dataIndex: 'model',
            key: 'model'
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
            title: __(messages['设备序列号']),
            dataIndex: 'sn',
            key: 'sn'
        }, {
            title: __(messages['自动分配']),
            dataIndex: 'assign_type',
            key: 'assign_type',
            render: (index, record) => {
                return record.assign_type === "auto" ? __(messages["支持"]) : __(messages["不支持"])
            }
        }, {
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Operations hasDelete={true} hasEdit={true} edit={() => this.editTWS(record)}
                                    delete={() => this.deleteTWS(record)}/>
                    </div>
                )
            }
        },];

        const options = this.props.mi0601Info.roomList.map((item) => {
            return (<Option value={item.id} key={item.id}>{item.name}</Option>)
        });

        const optionTwo = [
            <Option key="1" value="INIT">INIT</Option>,
            <Option key="2" value="PREONLINE">PREONLINE</Option>,
            <Option key="3" value="ONLINE">ONLINE</Option>,
            <Option key="4" value="OFFLINE">OFFLINE</Option>,
        ];

        const optionThree = this.props.mi0601Info.addressList.map((item) => {
            return <Option key={item.id} value={item.id}>{item.name}</Option>
        });


        const modalOptions = {
            title: this.state.TWSId ? __(messages["编辑TWS"]) : __(messages["新增TWS"]),
            visible: this.state.editModalShow,
            onCancel: this.cancelModal,
            dispatch: this.props.dispatch,
            submitType: this.state.TWSId ? "mi0601Info/editTWS" : "mi0601Info/createTWS",
            extraUpdatePayload: {id: this.state.TWSId, company_id: 1,type:"TWS"},
            initialValues: this.state.editRecord,
            initPayload: {
                type: this.state.type,
                level2_id: this.state.level2_id
            },
            InputItems: [{
                type: "Input",
                labelName: __(messages["TWS名称"]),
                valName: "name",
                nativeProps: {
                    placeholder: __(messages["请输入TWS名称"])
                },
                rules: [{required: true, message: __(messages["请输入TWS名称"])}],
            }, {
                type: "Select",
                labelName: __(messages["机房"]),
                valName: "room_id",
                nativeProps: {
                    placeholder: __(messages["请选择机房"])
                },
                rules: [
                    {required: true, message: __(messages["请选择机房"])},
                ],
                children: this.props.mi0601Info.roomList.map((room) => {
                    return {name: room.name, value: room.id, key: room.id}
                })
            }, {
                type: "Input",
                labelName: "SN",
                valName: "sn",
                nativeProps: {
                    placeholder: __(messages["请输入设备序列号"])
                },
                rules: [{required: true, message: __(messages["请输入设备序列号"])}, {
                    pattern: /^[A-Za-z0-9]{32}$/,
                    message: __(messages["请输入32位的字母或数字组合"])
                }],
            }, {
                type: "Input",
                labelName: __(messages["型号"]),
                valName: "model",
                nativeProps: {
                    placeholder: __(messages["请输入型号"])
                },
                rules: [{required: true, message: __(messages["请输入型号"])}],
            }, {
                type: "Radio",
                labelName: __(messages["自动分配"]),
                valName: "assign_type",
                nativeProps: {
                    placeholder: __(messages["请选择是否自动分配"])
                },
                rules: [{required: true, message: __(messages["请选择是否自动分配"])}],
                children: [{value: "auto", name: __(messages["支持"]), key: "auto"}, {
                    value: "manual",
                    name: __(messages["不支持"]),
                    key: "manual"
                }]
            },]
        };

        return (
            <Card className="card">
                <HeaderBar hasSearch={true}
                           submit={this.searchByTWSName} hasAdd={true} add={this.addTWS}
                           hasSelect={true} hasSelectTwo={true} hasSelectThree={true} selectThreePlaceHolder="请选择区域"
                           selectPlaceHolder={__(messages["请选择机房"])} selectTwoPlaceHolder={__(messages["请选择状态"])}
                           selectOneMethod={this.selectRoom}
                           selectTwoMethod={this.selectStatus}
                           selectThreeMethod={this.selectAddress}
                           options={options} optionsTwo={optionTwo} optionsThree={optionThree}
                           selectThreeIfSearch={true}/>
                <BossTable columns={columns}
                           dataSource={this.props.mi0601Info.dataSource}/>
                <BossEditModal {...modalOptions}/>
            </Card>
        )
    }
}

export default injectIntl(MI0601);