import React from 'react';
import './index.scss';
import {Button, Card, Input, Modal, Select, Upload,} from 'antd';
import Operations from "../../Common/Operations";
import BossTable from "../../Common/BossTable";
import BossEditModal from "../../Common/BossEditModal";
import {
    ModalOptionsGenerator,
    outStockModalOptionsGenerator,
    reserveModalOptionsGenerator,
    batchOutStockModalOptionGenerator
} from "./subComponents/ModelOptions";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
import {domain} from '../../../utils/commonConsts';
import {commonTranslate, parse} from '../../../utils/commonUtilFunc';
import {BossMessage} from "../../Common/BossMessages";

const Option = Select.Option;

class MI0201 extends React.Component {
    constructor(props) {
        super(props);
        const search = parse(this.props.location.search);
        this.state = {
            status: "IN",
            is_reserved: search.is_reserved || "",
            name: "",
            model: search.model || "",
            outStockModalShow: false,
            editModalShow: false,
            id_list: [],
            editRecord: {
                os: "Openwrt-Mips"
            },
            editId: "",
            reserveModalShow: false,
            selectedCompany: "",
            selectedDeviceModel: "",
            selectedDeviceOS: "",
            uploadModalShow: false,
            importResultModalShow: false,
            importResult: [],
            success: 0,
            fail: 0,
            selectedRecords: [],
            batchOutStockModalShow:false
        }
    }

    componentDidMount() {
        this.get_stock_stat();
        this.get_company_list();
        this.getStockList();
        this.get_device_model();
    }


    get_device_model = () => {
        this.props.dispatch({
            type: "mi0201Info/get_device_model",
            payload: {}
        })
    };

    //获取出库所需的公司列表数据
    get_company_list = () => {
        this.props.dispatch({
            type: "mi0201Info/get_company_list",
            payload: {}
        })
    };
    //获取出库所需的节点列表数据
    get_agency_list = () => {
        this.props.dispatch({
            type: "mi0201Info/get_agency_list",
            payload: {}
        })
    };

    //获取库存统计数据
    get_stock_stat = () => {
        this.props.dispatch({
            type: "mi0201Info/get_stock_stat",
            payload: {
                status: "IN"
            }
        })
    };
    //获取库存列表
    getStockList = () => {
        this.props.dispatch({
            type: "mi0201Info/getStockList",
            payload: {
                status: this.state.status,
                model: this.state.model,
                name: this.state.name,
                is_reserved: this.state.is_reserved
            }
        })
    };
    //选择库存型号后回调
    selectModel = (value) => {
        let vm = this;
        this.setState({
            model: value || "",
        }, function () {
            vm.getStockList();
        })
    };
    //筛选是否预定后的回调
    selectIsReserved = (value) => {
        let vm = this;
        this.setState({
            is_reserved: value || "",
        }, function () {
            vm.getStockList();
        })
    };
    //搜索框输入时的回调
    changeName = (e) => {
        let vm = this;
        const value = e.target.value;
        this.setState({
            name: value || ""
        }, function () {
            if (value === "") {
                vm.getStockList();
            }
        })
    };
    //搜索框按下输入按钮回调
    searchByName = () => {
        this.getStockList();
    };

    deleteStock = (record) => {
        this.props.dispatch({
            type: "mi0201Info/deleteStock",
            payload: {
                delete: {
                    ids: [record.id],
                    records: [record]
                },
                init: {
                    status: this.state.status,
                    model: this.state.model,
                    name: this.state.name,
                    is_reserved: this.state.is_reserved
                }
            }
        })
    };


    fileCheck = (file) => {
        const __ = this.props.intl.formatMessage;
        const name = file.name;
        let index1 = name.lastIndexOf(".");
        let index2 = name.length;
        let suffix = name.substring(index1 + 1, index2);
        const isXls = suffix === "xls";
        if (!isXls) {
            BossMessage(false, __(messages["请上传xls类型文件"]))
        }
        return isXls;
    };
    //打开添加库存弹出窗
    addStockModalShow = () => {
        this.setState({
            editModalShow: true,
        })
    };
    //关闭添加编辑库存弹出窗
    cancelModal = () => {
        this.setState({
            editModalShow: false,
            editRecord: {
                os: "Openwrt-Mips"
            },
            editId: "",
        })
    };

    outStockModalShow = (record) => {
        if(!record.agency_id){
            record.agency_id=undefined;
        }
        this.setState({
            outStockModalShow: true,
            selectedDeviceModel: record.model,
            editId: record.id,
            editRecord: record,
        },()=>{
            if(this.state.selectedDeviceModel){
                this.props.dispatch({
                    type:"mi0201Info/get_sn",
                    payload:{
                        os:"Openwrt-Mips",
                        model:this.state.selectedDeviceModel,
                        modalComponent:this.stockModalComponent
                    }
                });
            }
        })
    };
    //关闭出库弹出窗
    cancelOutStockModal = () => {
        this.setState({
            outStockModalShow: false,
            selectedCompany: "",
            selectedDeviceModel: "",
            selectedDeviceOS: "",
            editRecord: {
                os:"Openwrt-Mips"
            },
            editId: ""
        })
    };

    showUpdateStock = (record) => {
        this.setState({
            editRecord: record,
            editModalShow: true,
            editId: record.id
        })
    };

    cancelReserveModal = () => {
        this.setState({
            reserveModalShow: false,
        })
    };


    handleMutipleReserve = () => {
        const __=commonTranslate(this);
        let vm = this;
        if (this.state.id_list.length > 0) {
            vm.setState({
                reserveModalShow: true
            })
        } else {
            Modal.warning({
                title: __(messages["请选择至少一项"])
            })
        }

    };

    cancelEditModal = () => {
        this.setState({
            editModalShow: false,
            editRecord: {
                os: "Openwrt-Mips"
            },
            editId: "",
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
                vm.getStockList();
            })
        }
    };

    handleCloseImportModal = () => {
        this.setState({
            importResultModalShow: false
        })
    };
    checkBeforeUpload = (file) => {
        const __ = this.props.intl.formatMessage;
        const name = file.name;
        let index1 = name.lastIndexOf(".");
        let index2 = name.length;
        let suffix = name.substring(index1 + 1, index2);
        const isXls = suffix === "xls";
        if (!isXls) {
            Modal.error({
                title: __(messages["请上传xls类型文件"])
            })
        }
        return isXls;
    };
    onRef = (stockModalComponet) => {
        this.stockModalComponent = stockModalComponet;
    };

    onRefBatch=(batchStockModalComponment)=>{
        this.batchStockModalComponment = batchStockModalComponment;
    };

    handleBatchOutStockModalShow=()=>{
        const __=commonTranslate(this);
        let vm = this;
        if (this.state.id_list.length > 0) {
            vm.setState({
                batchOutStockModalShow: true
            })
        } else {
            Modal.warning({
                title: __(messages["请选择至少一项"])
            })
        }
    };

    handleCloseBatchOutStockModal = () => {
        this.setState({
            batchOutStockModalShow: false,
        })
    };


    render() {
        const __ = commonTranslate(this);
        //_0:可用量,_1:预定量,_total:库存量
        const search = parse(this.props.location.search);
        const stockStatColumns = [];
        for (let key in this.props.mi0201Info.deviceStatDataSource[0]) {
            stockStatColumns.push({
                title: key === "title" ? "" : key === "total" ? "合计" : key,
                dataIndex: key,
                key: key
            })
        }
        const columns = [{
            title: __(messages["入库时间"]),
            dataIndex: 'in_time',
            key: 'in_time',
        }, {
            title: __(messages["硬件编号"]),
            dataIndex: 'hard_sn',
            key: 'hard_sn',
        }, {
            title: __(messages["设备型号"]),
            dataIndex: 'model',
            key: 'model',
        }, {
            title: __(messages["名称"]),
            dataIndex: 'name',
            key: 'name',
        }, {
            title: __(messages["是否预定"]),
            dataIndex: 'is_reserved',
            key: 'is_reserved',
            render: (text, record) => {
                return record.is_reserved ? __(messages["已预订"]) : __(messages["未预定"])
            }
        }, {
            title: __(messages["备注"]),
            dataIndex: 'remark',
            key: 'remark',
        }, {
            title: __(messages["经办人"]),
            dataIndex: 'user',
            key: 'user',
        }, {
            title: __(messages["操作"]),
            dataIndex: 'operation',
            key: 'operation',
            width: 120,
            align: "center",
            render: (index, record) => {
                return (
                    <Operations edit={() => this.showUpdateStock(record)} hasDelete={true} hasEdit={true}
                                delete={() => this.deleteStock(record)} hasExtra={true}
                                extra={() => this.outStockModalShow(record)} extraIcon="upload"
                                extraToolTip={__(messages["设备出库"])}/>
                )
            }
        }];

        const rowSelection = {
            fixed: true,
            selectedRowKeys: this.state.id_list,
            onChange: (selectedRowKeys, selectedRecords) => {
                this.setState({
                    id_list: selectedRowKeys,
                    selectedRecords: selectedRecords
                })
            },
            getCheckboxProps: (record) => {
                return {
                    disabled: record.status === 'OUT',
                }
            }
        };

        const outStockModalOption = outStockModalOptionsGenerator(this);
        const ModalOptions = ModalOptionsGenerator(this);
        const reserveModalOptions = reserveModalOptionsGenerator(this);
        const batchOutStockModalOption = batchOutStockModalOptionGenerator(this);
        const importResultColumns = [
            {
                title: __(messages["硬件编号"]),
                dataIndex: '硬件编号',
                key: '硬件编号',
                render: (index, record) => {
                    return <span className="fail">{record["硬件编号"]}</span>
                }
            }, {
                title: __(messages["设备型号"]),
                dataIndex: '设备型号',
                key: '设备型号',
                render: (index, record) => {
                    return <span className="fail">{record["设备型号"]}</span>
                }
            }, {
                title: __(messages["设备名称"]),
                dataIndex: '设备名称',
                key: '设备名称',
                render: (index, record) => {
                    return <span className="fail">{record["设备名称"]}</span>
                }
            }, {
                title: __(messages["导入失败原因"]),
                dataIndex: '原因',
                key: '原因',
                render: (index, record) => {
                    return <span className="fail">{record["原因"]}</span>
                }
            }];
        return (
            <div>
                <Card className="card">
                    <div className="stockStatHeader">{__(messages["库存汇总"])}</div>
                    <BossTable columns={stockStatColumns} style={{marginBottom: 32}}
                               dataSource={this.props.mi0201Info.deviceStatDataSource} pagination={false}/>
                </Card>

                <Card className="card">
                    <div className="left-header">
                        <Button className
                                    ="editBtn" onClick={this.addStockModalShow}
                                icon="file-add">{__(messages["添加"])}</Button>
                        <Button className="editBtn"
                                icon="upload" onClick={this.handelUploadModalShow}>{__(messages["批量导入"])}</Button>
                        <Button className="editBtn" icon="to-top"
                                onClick={this.handleMutipleReserve}>{__(messages["预定"])}</Button>
                        <Button className="editBtn" icon="to-top"
                                onClick={this.handleBatchOutStockModalShow}>{__(messages["批量出库"])}</Button>
                    </div>
                    <div style={{marginBottom: 24, float: "right", display: "inline-block"}}>
                        <Select style={{width: 180, marginRight: 8}} className="input"
                                placeholder={__(messages["请选择设备型号"])}
                                onChange={(value) => this.selectModel(value)} allowClear
                                defaultValue={search.model || undefined}>
                            {this.props.mi0201Info.deviceModelList.map((model) => {
                                return <Option value={model.model} key={model.id}>{model.model}</Option>
                            })}
                        </Select>
                        <Select style={{width: 180, marginRight: 8}} className="input"
                                placeholder={__(messages["是否预定"])}
                                onChange={(value) => this.selectIsReserved(value)} allowClear
                                defaultValue={search.is_reserved || undefined}>
                            <Option value="1">{__(messages["是"])}</Option>
                            <Option value="0">{__(messages["否"])}</Option>
                        </Select>
                        <Input style={{width: 180, marginRight: 8}} className="input"
                               placeholder={__(messages["请输入关键字"])}
                               onChange={this.changeName}
                               onPressEnter={this.searchByName}/>
                        <Button size="default" className="input" onClick={this.searchByName}
                                icon="search">{__(messages["搜索"])}</Button>
                    </div>
                    <BossTable columns={columns}
                               dataSource={this.props.mi0201Info.dataSource}
                               rowSelection={rowSelection}/>
                </Card>
                <BossEditModal {...ModalOptions}/>
                <BossEditModal {...reserveModalOptions}/>
                <BossEditModal {...outStockModalOption} refs={this.onRef}/>
                <BossEditModal {...batchOutStockModalOption} refs={this.onRefBatch}/>
                <Modal maskClosable={false} title={<span>{__(messages["提示:批量导入的文件必须使用提供的模板才能成功"])}</span>}
                       onCancel={this.handelUploadModalClose}
                       destroyOnClose
                       visible={this.state.uploadModalShow} style={{textAlign: "center"}} width={525} footer={null}>
                    <div style={{height: 200}}>
                        <Upload showUploadList={false} action="/v1/company/import_stock_info/"
                                onChange={this.handleUploadComplete} beforeUpload={this.checkBeforeUpload}>
                            <Button style={{marginTop: 64}}
                                    type="primary">{__(messages["上传文件"])}</Button>
                        </Upload>
                        <div style={{marginTop: 16}}>{__(messages["没有模板"])},<a
                            href={domain + "/v1/company/download_stock_template/"}>{__(messages["点击下载"])}</a></div>
                    </div>
                </Modal>
                <Modal maskClosable={false} footer={null} title={__(messages["导入结果"])}
                       visible={this.state.importResultModalShow}
                       width={800}
                       onCancel={this.handleCloseImportModal}>
                    <div style={{marginBottom: 16}}><span
                        className="result">{__(messages["导入成功"])}:{this.state.success}</span><span
                        className={this.state.fail === 0 ? "result" : "fail"}>{__(messages["导入失败"])}:{this.state.fail}</span>
                    </div>
                    <BossTable columns={importResultColumns} dataSource={this.state.importResult}/>
                </Modal>
            </div>
        )
    }
}

export default injectIntl(MI0201);