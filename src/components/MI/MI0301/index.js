import React from 'react';
import './index.scss';
import {Card, Icon, Modal, Select} from 'antd';
import CheckRoomForm from './subComponents/CheckRoomForm';
import Operations from "../../Common/Operations";
import BossTable from "../../Common/BossTable";
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';
import HeaderBar from "../../Common/HeaderBar";
import BossEditModal from "../../Common/BossEditModal";

const Option = Select.Option;

class MI0301 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasSpecial: "",
            type: "",
            name: "",
            editModalShow: false,
            checkRoomShow: false,
            editRecord: {
                level1_id: 1
            },
            editId: "",
            checkRecord: {},
        }
    }

    componentDidMount() {
        this.get_room_list();
        this.get_country();
    }

    get_room_list = () => {
        this.props.dispatch({
            type: "mi0301Info/getRoomList",
            payload: {
                has_special: this.state.hasSpecial,
                type: this.state.type,
                name: this.state.name,
            }
        })
    };

    get_country = () => {
        this.props.dispatch({
            type: "mi0301Info/get_address",
            payload: {
                level: 1,
            }
        })
    };
    get_province = (parent_id, vm) => {
        if(vm){
            vm.props.form.setFieldsValue({level2_id: undefined});
        }
        this.props.dispatch({
            type: "mi0301Info/get_address",
            payload: {
                level: 2,
                parent_id: parent_id
            }
        })
    };

    selectSpecial = (value) => {
        this.setState({
            hasSpecial: value || "",
        }, () => {
            this.get_room_list();
        })
    };

    selectType = (value) => {
        this.setState({
            type: value || "",
        }, () => {
            this.get_room_list();
        })
    };


    searchByName = (value) => {
        this.setState({
            name: value || ""
        }, () => {
            this.get_room_list();
        })
    };

    handleEditModalShow = (record) => {
        this.setState({
            editModalShow: true,
            editRecord: record.id ? record : {level1_id: 1},
            editId: record.id
        },()=>{
            this.get_province(this.state.editRecord.level1_id||"")
        })
    };
    handleEditModalClose = () => {
        this.setState({
            editModalShow: false,
            editRecord: {level1_id: 1},
            editId: ""
        })
    };
    checkRoomShow = (record) => {
        this.setState({
            checkRoomShow: true,
            checkRecord: record
        })
    };
    checkRoomHide = () => {
        this.setState({
            checkRoomShow: false
        })
    };

    delete_room = (record) => {
        this.props.dispatch({
            type: "mi0301Info/delete_room",
            payload: {
                delete: {id: record.id, records: [record]},
                init: {
                    has_special: this.state.hasSpecial,
                    type: this.state.type,
                    name: this.state.name,
                }
            }
        })
    };


    render() {
        const __ = this.props.intl.formatMessage;
        const columns = [{
            title: __(messages['机房名称']),
            dataIndex: 'name',
            key: 'name',
            width: 120,
        }, {
            title: __(messages['区域']),
            dataIndex: 'level2_name',
            key: 'level2_name',
            width: 120,
        }, {
            title: __(messages['类型']),
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (text) => {
                return __(messages[text])
            }
        }, {
            title: __(messages['专线']),
            dataIndex: 'has_special',
            key: 'has_special',
            width: 120,
            render: (index, record) => {
                return <span>{record.has_special ? __(messages["有"]) : __(messages["无"])}</span>
            }
        }, {
            title: __(messages['ISP信息']),
            dataIndex: 'ISPInfo',
            key: 'ISPInfo',
            width: 120,
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Icon className="common-link-icon" type="file-text" onClick={() => this.checkRoomShow(record)}/>
                    </div>
                )
            }
        }, {
            title: __(messages['备注']),
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            width: 150,
            align: "center",
            render: (index, record) => {
                return (
                    <div>
                        <Operations hasEdit={true} hasDelete={true} delete={() => this.delete_room(record)}
                                    edit={() => this.handleEditModalShow(record)}/>
                    </div>
                )
            }
        }];
        const options = [
            <Option value="0" key="0">{__(messages["无"])}</Option>,
            <Option value="1" key="1">{__(messages["有"])}</Option>
        ];

        const optionsTwo = [
            <Option key="1" value="单线机房">{__(messages["单线机房"])}</Option>,
            <Option key="2" value="多线机房">{__(messages["多线机房"])}</Option>,
            <Option key="3" value="海外机房">{__(messages["海外机房"])}</Option>
        ];

        const modalOptions = {
            title: this.state.editId ? __(messages["修改机房信息"]) : __(messages["添加机房信息"]),
            visible: this.state.editModalShow,
            onCancel: this.handleEditModalClose,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "mi0301Info/update_room" : "mi0301Info/create_room",
            extraUpdatePayload: {id: this.state.editId},
            initialValues: this.state.editRecord,
            initPayload: {
                has_special: this.state.hasSpecial,
                type: this.state.type,
                name: this.state.name,
            },
            InputItems: [{
                type: "Input",
                labelName: __(messages["机房名称"]),
                valName: "name",
                nativeProps: {
                    placeholder: __(messages["请输入机房名称"])
                },
                rules: [{required: true, message: __(messages["请输入机房名称"])}],
            }, {
                type: "Select",
                labelName: __(messages["区域"]),
                valName: "level1_id",
                nativeProps: {
                    placeholder: __(messages["请选择国家"]),
                    showSearch: true,
                    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                rules: [
                    {required: true, message: __(messages["请选择国家"])},
                ],
                children: this.props.mi0301Info.countryList.map((country) => {
                    return {name: country.name, value: country.id, key: country.id}
                }),
                onChange: this.get_province
            }, {
                type: "Select",
                labelName: "",
                valName: "level2_id",
                nativeProps: {
                    placeholder: __(messages["请选择省份"]),
                    showSearch: true,
                    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                customerFormLayout: {
                    wrapperCol: {
                        xs: {span: 16, offset: 5},
                    }
                },
                rules: [
                    {required: true, message: __(messages["请选择省份"])},
                ],
                children: this.props.mi0301Info.provinceList.map((province) => {
                    return {name: province.name, value: province.id, key: province.id}
                }),
            }, {
                type: "Select",
                labelName: __(messages["类型"]),
                valName: "type",
                nativeProps: {
                    placeholder: __(messages["请选择类型"])
                },
                rules: [
                    {required: true, message: __(messages["请选择类型"])},
                ],
                children: [{
                    name: __(messages["单线机房"]), value: "单线机房", key: "单线机房"
                }, {
                    name: __(messages["多线机房"]), value: "多线机房", key: "多线机房"
                }, {
                    name: __(messages["海外机房"]), value: "海外机房", key: "海外机房"
                }]
            }, {
                type: "Select",
                labelName: __(messages["是否有专线"]),
                valName: "has_special",
                nativeProps: {
                    placeholder: __(messages["请选择是否有专线"])
                },
                rules: [
                    {required: true, message: __(messages["请选择是否有专线"])},
                ],
                children: [{
                    name: __(messages["无"]), value: 0, key: "0"
                }, {
                    name: __(messages["有"]), value: 1, key: "1"
                },]
            }, {
                type: "Input",
                labelName: __(messages["备注"]),
                valName: "remark",
                nativeProps: {
                    placeholder: __(messages["请输入备注"])
                },
                rules: [{required: true, message: __(messages["请输入备注"])}],
            },]
        };

        return (
            <Card className="card">
                <HeaderBar hasAdd={true} add={this.handleEditModalShow} hasSelect={true} hasSearch={true}
                           hasSelectTwo={true}
                           options={options} optionsTwo={optionsTwo} inputPlaceHolder={__(messages["请输入关键字"])}
                           selectPlaceHolder={__(messages["是否有专线"])} selectTwoPlaceHolder={__(messages["请选择类型"])}
                           selectOneMethod={this.selectSpecial} selectTwoMethod={this.selectType}
                           submit={this.searchByName}
                />
                <BossTable columns={columns} dataSource={this.props.mi0301Info.dataSource}/>
                <BossEditModal {...modalOptions}/>
                <Modal maskClosable={false} visible={this.state.checkRoomShow} onCancel={this.checkRoomHide}
                       footer={null} title={__(messages["ISP信息"])}
                       width={700} destroyOnClose>
                    <CheckRoomForm checkRecord={this.state.checkRecord}/>
                </Modal>
            </Card>
        )
    }
}

export default injectIntl(MI0301);