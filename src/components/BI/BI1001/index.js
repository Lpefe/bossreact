/**
 * 技术支持-边缘节点
 * */
import React from 'react';
import './index.scss';
import HeaderBar from "../../Common/HeaderBar";
import BossTable from "../../Common/BossTable";
import {withRouter} from 'react-router-dom';
import BossEditModal from "../../Common/BossEditModal";
import Operations from "../../Common/Operations";
import {Select, Modal, Upload, Button,Card} from 'antd';
import {injectIntl} from "react-intl";
import messages from './LocaleMsg/messages';
import {domain} from '../../../utils/commonConsts'
import {validateIp} from "../../../utils/commonUtilFunc";
import {BossMessage} from "../../Common/BossMessages";
const Option = Select.Option;

class BI1001 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifEditModalShow: false,
            editId: "",
            editRecord: {
                level1_id: 1
            },
            selectedCompanyId: "",
            ipTableShow: false,
            name: "",
            company_id: "",
            uploadModalShow: false,
            importResultModalShow: false,
            importResult: [],
            success: 0,
            fail: 0,
            selectedIds: [],
            selectedRecords:[],
        }
    }

    componentDidMount() {
        this.get_agency_list();
        this.get_company_list();
        this.get_country();
        this.get_province(1);
    }


    get_country = () => {
        this.props.dispatch({
            type: "bi1001Info/get_address",
            payload: {
                level: 1
            }
        })
    };
    get_province = (parent_id) => {
        this.props.dispatch({
            type: "bi1001Info/get_address",
            payload: {
                level: 2,
                parent_id:parent_id
            }
        })
    };
    get_city = (parent_id) => {
        this.props.dispatch({
            type: "bi1001Info/get_address",
            payload: {
                level: 3,
                parent_id:parent_id
            }
        })
    };

    get_agency_list = () => {
        this.props.dispatch({
            type: "bi1001Info/get_agency_list",
            payload: (sessionStorage.getItem("role") === "company"||sessionStorage.getItem("role") === "companystaff") ? {
                type: "STEP",
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.name
            } : {
                type: "STEP",
                company_id: this.state.company_id,
                name: this.state.name
            }
        })
    };

    get_company_list = () => {
        this.props.dispatch({
            type: "bi1001Info/get_company_list",
            payload: {}
        })
    };

    closeAddModal = () => {
        this.setState({
            ifEditModalShow: false,
            editId: "",
            editRecord: {
                level1_id: 1
            },
        })
    };
    handleOpenAddCompanyModal = (record) => {
        this.setState({
            ifEditModalShow: true,
            editId: record.id,
            editRecord: record.id ? record : this.state.editRecord,
        },()=>{
            if(record.id){
                this.get_province(record.level1_id);
                this.get_city(record.level2_id)
            }
        })
    };



    delete = (record) => {
        this.props.dispatch({
            type: "bi1001Info/delete_agency",
            payload: {
                delete: {
                    ids: [record.id],
                    records:[record]
                },
                init: (sessionStorage.getItem("role") === "company"||sessionStorage.getItem("role") === "staff") ? {
                    type: "STEP",
                    company_id: sessionStorage.getItem("companyId"),
                    name: this.state.name
                } : {
                    type: "STEP",
                    company_id: this.state.company_id,
                    name: this.state.name
                }
            }
        })
    };

    handleSelectCompany = (value) => {
        this.setState({
            company_id: value || "",
        }, function () {
            this.props.dispatch({
                type: "bi1001Info/get_agency_list",
                payload: {
                    type: "STEP",
                    company_id: this.state.company_id,
                    name: this.state.name
                }
            })
        })
    };

    handleSubmitSearch = (value) => {
        this.setState({
            name: value || "",
        }, function () {
            this.props.dispatch({
                type: "bi1001Info/get_agency_list",
                payload: {
                    type: "STEP",
                    company_id: this.state.company_id,
                    name: this.state.name
                }
            })
        })
    };

    handelUploadModalShow = () => {
        this.setState({
            uploadModalShow: true
        })
    };
    handelUploadModalClose = () => {
        this.setState({
            uploadModalShow: false
        })
    };

    handleUploadComplete = ({file}) => {
        let vm = this;
        if (file.status === "done") {
            this.setState({
                uploadModalShow: false,
                importResultModalShow: true,
                importResult: file.response.result.fail,
                success: file.response.result.success_count,
                fail: file.response.result.fail.length
            }, function () {
                vm.get_agency_list();
            })
        }
    };

    handleCloseImportModal = () => {
        this.setState({
            importResultModalShow: false
        })
    };
    checkBeforeUpload = (file) => {
        const __=this.props.intl.formatMessage;
        const name = file.name;
        let index1 = name.lastIndexOf(".");
        let index2 = name.length;
        let suffix = name.substring(index1 + 1, index2);
        const isXls = suffix === "xls";
        if (!isXls) {
            BossMessage(false,__(messages["请上传xls类型文件"]))
        }
        return isXls;
    };

    handleDeleteBatch = () => {
        this.props.dispatch({
            type: "bi1001Info/delete_agency_batch",
            payload: {
                delete: {
                    ids: this.state.selectedIds,
                    records:this.state.selectedRecords
                },
                init: (sessionStorage.getItem("role") === "company"||sessionStorage.getItem("role") === "staff") ? {
                    type: "STEP",
                    company_id: sessionStorage.getItem("companyId"),
                    name: this.state.name
                } : {
                    type: "STEP",
                    company_id: this.state.company_id,
                    name: this.state.name
                }
            }
        })
    };

    render() {
        const __=this.props.intl.formatMessage;
        const columns = [{
            title: __(messages['边缘节点']),
            dataIndex: 'name',
            key: 'name',
            fixed:"left"
        }, {
            title: __(messages['所在国家']),
            dataIndex: 'level1',
            key: 'level1',
        }, {
            title: __(messages['所属城市']),
            dataIndex: 'level3_name',
            key: 'level3_name',
            render: (index, record) => {
                return <span>{record.level23.length > 1 ? record.level23[1] : ""}</span>
            }
        }, {
            title: __(messages['收货地址']),
            dataIndex: 'address',
            key: 'address',
        }, {
            title: __(messages['收货联系人']),
            dataIndex: 'receive_name',
            key: 'receive_name',
        }, {
            title: __(messages['联系电话']),
            dataIndex: 'receive_tel',
            key: 'receive_tel',
        },{
            title: __(messages['IP段']),
            dataIndex: 'iptables',
            key: 'iptables',
        }, {
            title: __(messages['备注']),
            dataIndex: 'remark',
            key: 'remark',
            render:(text)=>{
                return <span>{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            }
        }, {
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            align: "center",
            width:100,
            fixed:"right",
            render: (index, record) => {
                return <Operations hasEdit={true} extraIcon="file-text" hasDelete={true}
                                   edit={() => this.handleOpenAddCompanyModal(record)}
                                   delete={() => this.delete(record)} extraToolTip={__(messages["添加IP段"])}
                />
            }
        }];

        let companyName = {
            title: __(messages['企业名称']),
            dataIndex: 'company_abbr',
            key: 'company_abbr',
        };

        if (sessionStorage.getItem("role") !== "company") {
            columns.splice(1, 0, companyName);
        }

        const ModalOptions = {
            title: this.state.editId ? __(messages["编辑边缘节点"]) : __(messages["新增边缘节点"]),
            visible: this.state.ifEditModalShow,
            onCancel: this.closeAddModal,
            dispatch: this.props.dispatch,
            submitType: this.state.editId ? "bi1001Info/update_agency" : "bi1001Info/create_agency",
            hasSubmitCancel: this.state.editId === undefined,
            submitCancel: (vm) => {
                vm.props.form.setFieldsValue({
                    name: undefined,
                    address: undefined,
                    receive_name: undefined,
                    receive_tel: undefined
                });
            },
            extraUpdatePayload: (sessionStorage.getItem("role") === "company"||sessionStorage.getItem("role") === "staff") ? {
                company_id: sessionStorage.getItem("companyId"),
                type: "STEP",
                id: this.state.editId,
            } : {type: "STEP", id: this.state.editId,},
            initPayload: (sessionStorage.getItem("role") === "company"||sessionStorage.getItem("role") === "staff") ? {
                type: "STEP",
                company_id: sessionStorage.getItem("companyId"),
                name: this.state.name,
            } : {
                type: "STEP",
                company_id: this.state.company_id,
                name: this.state.name
            },
            initialValues: this.state.editRecord,
            InputItems: [(sessionStorage.getItem("role") === "company"||sessionStorage.getItem("role") === "staff") ? {} : {
                type: "Select",
                labelName: __(messages["企业名称"]),
                valName: "company_id",
                nativeProps: {
                    placeholder: __(messages["请选择企业"])
                },
                rules: [{required: true, message: __(messages["请选择企业"])}],
                children: this.props.bi1001Info.companyList.map((item) => {
                    if (item) {
                        return {key: item.id, value: item.id, name: item.company_abbr}
                    }

                })
            }, {
                type: "Input",
                labelName: __(messages["名称"]),
                valName: "name",
                nativeProps: {
                    placeholder: __(messages["请输入边缘节点名称"])
                },
                rules: [{required: true, message: __(messages["请输入边缘节点名称"])}, {max: 128, message: __(messages["边缘节点名称最多输入128字符"])}],
            }, {
                type: "Select",
                labelName: __(messages['所在国家']),
                valName: "level1_id",
                nativeProps: {
                    placeholder: __(messages['请选择所在国家']),
                    showSearch: true,
                    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                children: this.props.bi1001Info.countryList.map((item) => {
                    return {name: item.name, value: item.id, key: item.id}
                }),
                rules: [{required: true, message: "请选择所在国家"}],
                onChange: (value,vm) => {
                    this.get_province(value);
                    vm.props.form.setFieldsValue({"level3_id":undefined,"level2_id":undefined})
                }
            }, {
                type: "Select",
                labelName: __(messages['所在省份']),
                valName: "level2_id",
                nativeProps: {
                    placeholder: __(messages['请选择所在省份']),
                    showSearch: true,
                    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                children: this.props.bi1001Info.provinceList.map((item) => {
                    return {name: item.name, value: item.id, key: item.id}
                }),
                onChange: (value,vm) => {
                    this.get_city(value);
                    vm.props.form.setFieldsValue({"level3_id":undefined})
                },
                rules: [{required: true, message: __(messages['请选择所在省份'])}],
            }, {
                type: "Select",
                labelName: __(messages['所在城市']),
                valName: "level3_id",
                nativeProps: {
                    placeholder: __(messages['请选择所在城市']),
                    showSearch: true,
                    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                },
                children:this.props.bi1001Info.cityList.map((item) => {
                    return {name: item.name, value: item.id, key: item.id}
                }),
                rules: [{required: true, message: __(messages['请选择所在城市'])}],
            }, {
                type: "Input",
                labelName: __(messages["收货地址"]),
                valName: "address",
                nativeProps: {
                    placeholder: __(messages["请输入收货地址"])
                },
                rules: [{max: 128, message: __(messages["收货地址最多输入128字符"])}],
            }, {
                type: "Input",
                labelName: __(messages["收货联系人"]),
                valName: "receive_name",
                nativeProps: {
                    placeholder: __(messages["请输入收货联系人"])
                },
                rules: [{max: 128, message: __(messages["收货联系人最多输入128字符"])}],
            }, {
                type: "Input",
                labelName: __(messages["联系电话"]),
                valName: "receive_tel",
                nativeProps: {
                    placeholder: __(messages["请输入联系电话"])
                },
                rules: [{max: 50, message: __(messages["联系电话最多输入128字符"])}],
            }, {
                type: "GroupInput",
                labelName: __(messages["IP段"]),
                valName: "iptables",
                nativeProps: {
                    placeholder: __(messages["请输入IP段"])
                },
                rules: [{validator: validateIp}],
            },{
                type: "Input",
                labelName: __(messages["备注"]),
                valName: "remark",
                nativeProps: {
                    placeholder: __(messages["请输入备注"])
                },
                rules: [],
            },]
        };
        const options = this.props.bi1001Info.companyList.map((item) => {
            return <Option key={item.id} value={item.id}>{item.company_abbr}</Option>
        });
        const importResultColumns = [
            {
                title: __(messages['企业名称']),
                dataIndex: '企业名称',
                key: '企业名称',

            }, {
                title: __(messages['导入失败原因']),
                dataIndex: '原因',
                key: '原因',
            }, {
                title: __(messages['所属国家']),
                dataIndex: '所属国家',
                key: '所属国家',
            }, {
                title: __(messages['所属城市']),
                dataIndex: '所属城市',
                key: '所属城市',
            }, {
                title: __(messages['节点名称']),
                dataIndex: '节点名称',
                key: '节点名称',
            },];
        const rowSelection = {
            fixed: true,
            onChange: (selectedRowKeys,selectedRecords) => {
                this.setState({
                    selectedIds: selectedRowKeys,
                    selectedRecords:selectedRecords,
                })
            }
        };
        return <Card className="card BI1001">
            <HeaderBar hasAdd={true} hasSelect={sessionStorage.getItem("role") !== "company"&&sessionStorage.getItem("role") !== "companystaff"} hasSearch={true}
                       selectPlaceHolder={__(messages["请选择企业"])}
                       add={this.handleOpenAddCompanyModal} options={options}
                       submit={this.handleSubmitSearch} selectOneMethod={this.handleSelectCompany}
                       hasModalStyelUpload={true}
                       modal={this.handelUploadModalShow} selectedKeys={this.state.selectedIds} hasDelete={true}
                       delete={this.handleDeleteBatch}/>
            <BossTable columns={columns} dataSource={this.props.bi1001Info.agencyList} rowSelection={rowSelection} scroll={{x:true}}/>
            <BossEditModal {...ModalOptions}/>
            {/*<IpTableModal visible={this.state.ipTableShow} cancel={this.handleCloseIpTableModal}
                          company_id={this.state.selectedCompanyId}
                          agency_id={this.state.editId}/>*/}


            {/*上传模板弹出窗*/}
            <Modal maskClosable={false} title={<span>{__(messages["提示:批量导入的文件必须使用提供的模板才能成功"])}</span>}
                   onCancel={this.handelUploadModalClose}
                   destroyOnClose
                   visible={this.state.uploadModalShow} style={{textAlign: "center"}} width={525} footer={null}>
                <div style={{height: 200}}>
                    <Upload showUploadList={false} action="/v1/company/import_step_info/"
                            data={{company_id: sessionStorage.getItem("companyId"),}}
                            onChange={this.handleUploadComplete} beforeUpload={this.checkBeforeUpload}>
                        <Button style={{marginTop: 64}}
                                type="primary">{__(messages["上传文件"])}</Button>
                    </Upload>
                    <div style={{marginTop: 16}}>{__(messages["没有模板"])},<a
                        href={domain + "/v1/company/download_step_template/"}>{__(messages["点击下载"])}</a></div>
                </div>
            </Modal>
            <Modal maskClosable={false} footer={null} title={__(messages["导入结果"])} visible={this.state.importResultModalShow}
                   onCancel={this.handleCloseImportModal}>
                <div style={{marginBottom: 16}}><span className="result">{__(messages["导入成功"])}:{this.state.success}</span><span
                    className={this.state.fail === 0 ? "result" : "fail"}>{__(messages["导入失败"])}:{this.state.fail}</span></div>
                <BossTable columns={importResultColumns} dataSource={this.state.importResult}/>
            </Modal>
        </Card>
    }
}

export default withRouter(injectIntl(BI1001));