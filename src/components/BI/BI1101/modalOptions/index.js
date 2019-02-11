import messages from '../LocaleMsg/messages';
import {commonTranslate} from "../../../../utils/commonUtilFunc";

const editModalOptionsGenerator = (component) => {
    const __ = commonTranslate(component);
    return {
        title: component.state.editId ? __(messages["编辑链路"]) : __(messages["新增链路"]),
        visible: component.state.ifEditModalShow,
        onCancel: component.closeAddModal,
        dispatch: component.props.dispatch,
        submitType: component.state.editId ? "bi1101Info/update_link" : "bi1101Info/create_link",
        extraUpdatePayload: {id: component.state.editId, has_device_id: component.state.editRecord.device_id},
        initialValues: component.state.editRecord,
        hasSubmitCancel: component.state.editId === "",
        submitCancel: (vm) => {
            vm.props.form.setFieldsValue({
                edge_id: undefined,
                device_id: undefined,
                name: undefined,
                backup_name: undefined,
            });
        },
        initPayload: {
            link_type: component.state.link_type,
            name: component.state.name,
            status: component.state.status,
            company_id: component.state.company_id
        },
        InputItems: [{
            type: "Select",
            labelName: __(messages["企业名称"]),
            valName: "company_id",
            nativeProps: {
                placeholder: __(messages["请选择企业"]),
                disabled: component.state.editId !== "",
            },
            rules: [{required: true, message: __(messages["请选择企业"])}],
            children: component.props.bi1101Info.companyList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.company_abbr}
                }
            }),
            onChange: (value, vm) => {
                component.get_edge_agency_list(value);
                component.get_center_agency_list(value);
                component.get_speed_rule(value);
                vm.props.form.setFieldsValue({
                    edge_id: undefined,
                    agency_id: undefined,
                    backup_agency_id: undefined,
                    device_id: undefined
                });
                component.props.dispatch({
                    type: "bi1101Info/reset_device_list",
                    payload: {}
                })
            }
        }, {
            type: "Select",
            labelName: __(messages["边缘"]),
            valName: "edge_id",
            nativeProps: {
                placeholder: __(messages["请选择边缘节点"]),
                disabled: (component.state.editId !== ""),
            },
            rules: [{required: true, message: __(messages["请选择边缘节点"])}],
            children: component.props.bi1101Info.agencyListEdge.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
            onChange: (value, vm) => {
                component.get_device_list(value);
                //根据edge和center节点名,生成默认链路名
                vm.props.form.resetFields(["device_id"]);
                let agency_id = vm.props.form.getFieldValue("agency_id");
                let backup_agency_id = vm.props.form.getFieldValue("backup_agency_id");
                let edge_name = "";
                let center_name = "";
                let edge_id = value;
                let agencyListEdge = component.props.bi1101Info.agencyListEdge;
                let agencyListCenter = component.props.bi1101Info.agencyListCenter;
                if (agency_id) {
                    for (let key in agencyListEdge) {
                        if (agencyListEdge[key].id === edge_id) {
                            edge_name = agencyListEdge[key].name
                        }
                    }
                    for (let key in agencyListCenter) {
                        if (agencyListCenter[key].id === agency_id) {
                            center_name = agencyListCenter[key].name;
                        }
                    }
                    vm.props.form.setFieldsValue({"name": edge_name + "-" + center_name})
                }
                if (backup_agency_id) {
                    for (let key in agencyListEdge) {
                        if (agencyListEdge[key].id === edge_id) {
                            edge_name = agencyListEdge[key].name
                        }
                    }
                    for (let key in agencyListCenter) {
                        if (agencyListCenter[key].id === backup_agency_id) {
                            center_name = agencyListCenter[key].name;
                        }
                    }
                    vm.props.form.setFieldsValue({"backup_name": edge_name + "-" + center_name})
                }
            }
        }, {
            type: "Select",
            labelName: "",
            customerFormLayout: {
                wrapperCol: {
                    xs: {span: 16, offset: 5},
                }
            },
            valName: "device_id",
            nativeProps: {
                placeholder: __(messages["请选择边缘节点设备"]),
                disabled: component.state.editId !== "",
            },
            rules: [],
            children: component.props.bi1101Info.deviceList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
        }, {
            type: "Select",
            labelName: __(messages["中心"]),
            valName: "agency_id",
            nativeProps: {
                placeholder: __(messages["请选择中心节点"]),
                disabled: component.state.editId !== "",
            },
            rules: [{required: true, message: __(messages["请选择中心节点"])}],
            children: component.props.bi1101Info.agencyListCenter.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
            onChange: (value, vm) => {
                let agency_id = value;
                let edge_name = "";
                let center_name = "";
                let edge_id = vm.props.form.getFieldValue("edge_id");
                let agencyListEdge = component.props.bi1101Info.agencyListEdge;
                let agencyListCenter = component.props.bi1101Info.agencyListCenter;
                if (edge_id) {
                    for (let key in agencyListEdge) {
                        if (agencyListEdge[key].id === edge_id) {
                            edge_name = agencyListEdge[key].name
                        }
                    }
                    for (let key in agencyListCenter) {
                        if (agencyListCenter[key].id === agency_id) {
                            center_name = agencyListCenter[key].name;
                        }
                    }
                    vm.props.form.setFieldsValue({"name": edge_name + "-" + center_name})
                }
            }
        }, component.state.ifBackUpLine ? {
            type: "Select",
            labelName: __(messages["备中心"]),
            valName: "backup_agency_id",
            nativeProps: {
                placeholder: __(messages["请选择备中心节点"]),
                disabled: component.state.editId !== "",
            },
            rules: [{required: true, message: __(messages["请选择备中心节点"])}],
            children: component.props.bi1101Info.agencyListCenter.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
            onChange: (value, vm) => {
                let agency_id = value;
                let edge_name = "";
                let center_name = "";
                let edge_id = vm.props.form.getFieldValue("edge_id");
                let agencyListEdge = component.props.bi1101Info.agencyListEdge;
                let agencyListCenter = component.props.bi1101Info.agencyListCenter;
                if (edge_id) {
                    for (let key in agencyListEdge) {
                        if (agencyListEdge[key].id === edge_id) {
                            edge_name = agencyListEdge[key].name
                        }
                    }
                    for (let key in agencyListCenter) {
                        if (agencyListCenter[key].id === agency_id) {
                            center_name = agencyListCenter[key].name;
                        }
                    }
                    vm.props.form.setFieldsValue({"backup_name": edge_name + "-" + center_name})
                }

            }
        } : "", {
            type: "Input",
            labelName: __(messages["链路名称"]),
            valName: "name",
            nativeProps: {
                placeholder: __(messages["请输入链路名称"])
            },
            rules: [{required: true, message: __(messages["请输入链路名称"])}],
        }, component.state.ifBackUpLine ? {
            type: "Input",
            labelName: __(messages["备链路名称"]),
            valName: "backup_name",
            nativeProps: {
                placeholder: __(messages["请输入备链路名称"])
            },
            rules: [{required: true, message: __(messages["请输入备链路名称"])}],
        } : "", {
            type: "Select",
            labelName: __(messages["服务等级"]),
            valName: "grade",
            nativeProps: {
                placeholder: __(messages["请选择服务等级"])
            },
            rules: [{required: true, message: __(messages["请选择服务等级"])}],
            children: [{key: "CLOUD_VPN", value: "CLOUD_VPN", name: __(messages["云VPN"])}, {
                key: "CLOUD_SPLINE",
                value: "CLOUD_SPLINE",
                name: __(messages["云专线"])
            }, {key: "SUPER_CLOUD_SPLINE", value: "SUPER_CLOUD_SPLINE", name: __(messages["超级云专线"])}]
        }, {
            type: "Select",
            labelName: __(messages["链路类型"]),
            valName: "link_type",
            nativeProps: {
                placeholder: __(messages["请选择链路类型"])
            },
            rules: [{required: true, message: __(messages["请选择链路类型"])}],
            children: component.props.bi1101Info.typeList.map((item) => {
                if (item) {
                    return {key: item, value: item, name: item}
                }
            }),
        }, {
            type: "Input",
            labelName: __(messages["带宽(M)"]),
            valName: "bandwidth",
            nativeProps: {
                placeholder: __(messages["请输入带宽"])
            },
            rules: [{required: true, message: __(messages["请输入带宽"])}],
        }, {
            type: "Select",
            labelName: __(messages["计费模式"]),
            valName: "charge_type",
            nativeProps: {
                placeholder: __(messages["请选择计费模式"])
            },
            rules: [{required: true, message: __(messages["请选择计费模式"])}],
            children: [{key: "固定计费", value: "固定计费", name: __(messages["固定计费"])}, {
                key: "流量计费",
                value: "流量计费",
                name: __(messages["流量计费"])
            }],
        }, {
            type: "InputNumber",
            labelName: __(messages["RTT基准值"]) + "(ms)",
            valName: "rtt_limit",
            nativeProps: {
                placeholder: __(messages["请输入RTT基准值"]),
                style: {
                    width: 200
                }
            },
            rules: [{pattern: /^\d+$/, message: "只能输入正整数"}],
        },]
    }
};

const multipleAddModalOptionsGenerator = (component) => {
    const __ = commonTranslate(component);
    return {
        title: __(messages["批量新增链路"]),
        visible: component.state.ifMultipleAddModalShow,
        onCancel: component.closeMultipleAddModal,
        dispatch: component.props.dispatch,
        submitType: "bi1101Info/create_link_batch",
        initPayload: {
            link_type: component.state.link_type,
            name: component.state.name,
            status: component.state.status,
            company_id: component.state.company_id
        },
        initialValues: {
            company_id: component.state.addModalInitialCompanyId
        },
        InputItems: [{
            type: "Select",
            labelName: __(messages["企业名称"]),
            valName: "company_id",
            nativeProps: {
                placeholder: __(messages["请选择企业"]),

            },
            rules: [{required: true, message: __(messages["请选择企业"])}],
            children: component.props.bi1101Info.companyList.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.company_abbr}
                }
            }),
            onChange: (value) => {
                component.get_center_agency_list_batch(value);
                component.get_edge_agency_list_batch(value);
                component.get_speed_rule(value);
            }
        }, {
            type: "Select",
            labelName: __(messages["边缘"]),
            valName: "edge_agency_ids",
            nativeProps: {
                placeholder: __(messages["请选择边缘节点"]),
                mode: "multiple"

            },
            rules: [{required: true, message: __(messages["请选择边缘节点"])}],
            children: component.props.bi1101Info.agencyListEdgeBatch.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
        }, {
            type: "Select",
            labelName: __(messages["中心"]),
            valName: "center_agency_id",
            nativeProps: {
                placeholder: __(messages["请选择中心节点"]),
            },
            rules: [{required: true, message: __(messages["请选择中心节点"])}],
            children: component.props.bi1101Info.agencyListCenterBatch.map((item) => {
                if (item) {
                    return {key: item.id, value: item.id, name: item.name}
                }
            }),
        }, {
            type: "Select",
            labelName: __(messages["服务等级"]),
            valName: "grade",
            nativeProps: {
                placeholder: __(messages["请选择服务等级"])
            },
            rules: [{required: true, message: __(messages["请选择服务等级"])}],
            children: [{key: "CLOUD_VPN", value: "CLOUD_VPN", name: __(messages["云VPN"])}, {
                key: "CLOUD_SPLINE",
                value: "CLOUD_SPLINE",
                name: __(messages["云专线"])
            }, {key: "SUPER_CLOUD_SPLINE", value: "SUPER_CLOUD_SPLINE", name: __(messages["超级云专线"])}]
        }, {
            type: "Select",
            labelName: __(messages["链路类型"]),
            valName: "link_type",
            nativeProps: {
                placeholder: __(messages["请选择链路类型"])
            },
            rules: [{required: true, message: __(messages["请选择链路类型"])}],
            children: component.props.bi1101Info.typeList.map((item) => {
                if (item) {
                    return {key: item, value: item, name: item}
                }
            }),
        }, {
            type: "Input",
            labelName: __(messages["带宽(M)"]),
            valName: "bandwidth",
            nativeProps: {
                placeholder: __(messages["请输入带宽"])
            },
            rules: [{required: true, message: __(messages["请输入带宽"])},],
        }, {
            type: "Select",
            labelName: __(messages["计费模式"]),
            valName: "charge_type",
            nativeProps: {
                placeholder: __(messages["请选择计费模式"])
            },
            rules: [{required: true, message: __(messages["请选择计费模式"])}],
            children: [{key: "固定计费", value: "固定计费", name: __(messages["固定计费"])}, {
                key: "流量计费",
                value: "流量计费",
                name: __(messages["流量计费"])
            }],
        }, {
            type: "InputNumber",
            labelName: __(messages["RTT基准值"]) + "(ms)",
            valName: "rtt_limit",
            nativeProps: {
                placeholder: __(messages["请输入RTT基准值"]),
                style: {
                    width: 200
                }
            },
            rules: [{pattern: /^\d+$/, message: "只能输入正整数"}],
        },]
    };
};

const HAModalOptionsGenerator = (component) => {
    const __ = commonTranslate(component);
    return {
        title: component.state.ifCenterHA ? __(messages["中心HA设置"]) : __(messages["边缘HA设置"]),
        visible: component.state.ifEditHAModalShow,
        onCancel: component.closeEditHAModal,
        dispatch: component.props.dispatch,
        submitType: "bi1101Info/set_backup_link",
        initialValues: Object.assign({}, component.state.editHARecord, {backup_link_id: component.state.ifCenterHA ? (component.state.editHARecord.backup_link_id || undefined) : (component.state.editHARecord.edge_backup_link_id || undefined)}),
        extraUpdatePayload: {
            link_id: component.state.editHAId,
            backup_type: component.state.ifCenterHA ? 'center' : 'edge'
        },
        initPayload: {
            link_type: component.state.link_type,
            name: component.state.name,
            status: component.state.status,
            company_id: component.state.company_id
        },
        InputItems: [{
            type: "Plain",
            labelName: "企业名称",
            content: component.state.editHARecord.company_abbr,
            height: 32
        }, {
            type: "Plain",
            labelName: "中心节点",
            content: component.state.editHARecord.main,
            height: 32
        }, {
            type: "Plain",
            labelName: "边缘节点",
            content: component.state.editHARecord.branch,
            height: 32
        }, {
            type: "Plain",
            labelName: "主链路",
            content: component.state.editHARecord.name,
            height: 32
        }, {
            type: "Select",
            labelName: "备链路",
            valName: "backup_link_id",
            nativeProps: {
                placeholder: "请选择备链路"
            },
            rules: [{required: true, message: "请选择备链路"}],
            children: component.props.bi1101Info.HALinkList.map((item) => {
                return {key: item.id, value: item.id, name: item.name}
            })
        }, {
            type: "Plain",
            labelName: "说明",
            content: "",
            height: 32
        },]
    }
};

export {editModalOptionsGenerator, multipleAddModalOptionsGenerator, HAModalOptionsGenerator}