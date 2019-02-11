import React from 'react';
import './index.scss';
import {Button, Card, Form, Icon, Input, message, Modal, Popconfirm, Popover, Switch, Upload} from 'antd'
import HeaderBar from "../../Common/HeaderBar";
import function_off from '../../../assets/img/function_off.png'
import BossTable from "../../Common/BossTable";
import {domain} from "../../../utils/commonConsts";
import messages from './LocaleMsg/messages';
import {commonTranslate} from "../../../utils/commonUtilFunc";
import {injectIntl} from "react-intl";
const FormItem = Form.Item;

class CI0901 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ifAddUrlModalShow: false,
            selectedIds: [],
            uploadModalShow: false,
            importResultModalShow: false,
            importResult: [],
            success: 0,
            fail: 0,
            records: []
        }
    }

    componentDidMount() {
        this.get_white_list();
    }

    get_white_list = () => {
        this.props.dispatch({
            type: "ci0901Info/get_white_list",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
            }
        })
    };

    handleOpenAddUrlModal = () => {
        this.setState({
            ifAddUrlModalShow: true,
        })
    };

    handleCloseAddUrlModal = () => {
        this.setState({
            ifAddUrlModalShow: false,
        })
    };

    handleSubmitAddUrl = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch({
                    type: "ci0901Info/create_white_list",
                    payload: {
                        company_id: sessionStorage.getItem("companyId"),
                        url: values.url,
                    }
                })
            }
        });
        this.setState({
            ifAddUrlModalShow: false,
        })
    };

    update_white_list = (checked, record) => {
        this.props.dispatch({
            type: "ci0901Info/update_white_list",
            payload: {
                id: record.id,
                is_active: checked,
                record: record,
            }
        })
    };

    delete_white_list = (record) => {
        let ids = [];
        ids.push(record.id);
        this.props.dispatch({
            type: "ci0901Info/delete_white_list",
            payload: {
                ids: ids,
                records: [record]
            }
        })
    };
    delete_white_list_batch = () => {
        const __=commonTranslate(this);
        for (let key in this.state.records) {
            if (this.state.records[key].is_active) {
                Modal.warning({
                    title: __(messages["只能删除禁用状态项"])
                });
                return 0;
            }
        }
        this.props.dispatch({
            type: "ci0901Info/delete_white_list",
            payload: {
                ids: this.state.selectedIds,
                records: this.state.records
            }
        })
    };
    handleMultipleSelect = (selectedIds, selectedRecords) => {
        this.setState({
            selectedIds: selectedIds,
            records: selectedRecords
        })
    };

    searchWhiteList = (value) => {
        this.props.dispatch({
            type: "ci0901Info/get_white_list",
            payload: {
                company_id: sessionStorage.getItem("companyId"),
                name: value,
            }
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
        if (file.status === "done") {
            this.setState({
                uploadModalShow: false,
                importResultModalShow: true,
                importResult: file.response.result.fail,
                success: file.response.result.success_count,
                fail: file.response.result.fail.length
            }, () => {
                this.get_white_list();
            })
        }
    };

    handleCloseImportModal = () => {
        this.setState({
            importResultModalShow: false
        })
    };
    checkBeforeUpload = (file) => {
        if (file.type !== "text/plain") {
            message.error("请上传txt格式文件");
            return false;
        }

    };

    render() {
        const __=commonTranslate(this);
        const columns = [{
            title: __(messages['域名']),
            dataIndex: 'url',
            key: 'url',
        }, {
            title: __(messages['状态']),
            dataIndex: 'is_active',
            key: 'is_active',
            render: (index, record) => {
                return <Switch checkedChildren={__(messages["启用"])} unCheckedChildren={__(messages["禁用"])} defaultChecked={record.is_active}
                               onChange={(checked) => this.update_white_list(checked, record)}/>
            }
        }, {
            title: __(messages['操作']),
            dataIndex: 'operation',
            key: 'operation',
            width: 100,
            align: "center",
            render: (index, record) => {
                if (record.is_active) {
                    return <Popover content={__(messages["只能删除禁用状态项"])}>
                        <Icon type="delete" style={{border: 0}} className="operations-delete-btn"/>
                    </Popover>
                } else {
                    return (
                        <Popconfirm title={__(messages["确认删除该项吗?"])} onConfirm={() => this.delete_white_list(record)}>
                            <Icon type="delete" style={{border: 0}} className="operations-delete-btn"/>
                        </Popconfirm>
                    )
                }
            }
        },];
        const rowSelection = {
            fixed: true,
            onChange: this.handleMultipleSelect
        };
        const {getFieldDecorator} = this.props.form;
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        const importResultColumns = [
            {
                title: __(messages['域名']),
                dataIndex: 'url',
                key: 'url',
                render: (index, record) => {
                    return <span className="fail">{record.url}</span>
                }
            }, {
                title: __(messages['导入失败原因']),
                dataIndex: 'reason',
                key: 'reason',
                render: (index, record) => {
                    return <span className="fail">{record.reason}</span>
                }
            }];
        return <Card className="card ci0901">{this.props.ci0901Info.ifAllowed ? <div>
            <HeaderBar hasSearch={true} hasDelete={true} hasAdd={true} inputPlaceHolder={__(messages["请输入域名"])}
                       delete={this.delete_white_list_batch} submit={this.searchWhiteList}
                       add={this.handleOpenAddUrlModal} selectedKeys={this.state.selectedIds} hasModalStyelUpload={true}
                       modal={this.handelUploadModalShow}/>
            <BossTable columns={columns} rowSelection={rowSelection}
                       dataSource={this.props.ci0901Info.dataSource}/>
            <Modal maskClosable={false} visible={this.state.ifAddUrlModalShow} onCancel={this.handleCloseAddUrlModal}
                   onOk={this.handleSubmitAddUrl} title={__(messages["添加白名单"])} destroyOnClose>
                <Form>
                    <FormItem label={__(messages["域名"])} {...modalFormLayout}>
                        {getFieldDecorator('url', {
                            rules: [{
                                required: true,
                                message: __(messages["请输入域名"])
                            }, {
                                pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/,
                                message: __(messages["域名格式不正确"])
                            }],
                        })(
                            <Input placeholder={__(messages["请输入域名"])}/>
                        )}
                    </FormItem>
                </Form>
            </Modal>
            <Modal maskClosable={false} title={<span>{__(messages["提示:批量导入的文件必须使用提供的模板才能成功"])}</span>}
                   onCancel={this.handelUploadModalClose}
                   destroyOnClose
                   visible={this.state.uploadModalShow} style={{textAlign: "center"}} width={525} footer={null}>
                <div style={{height: 200}}>
                    <Upload showUploadList={false} action="/v1/company/import_white_list_info/"
                            data={{company_id: sessionStorage.getItem("companyId"),}}
                            onChange={this.handleUploadComplete} beforeUpload={this.checkBeforeUpload}>
                        <Button style={{marginTop: 64}}
                                type="primary">{__(messages["上传文件"])}</Button>
                    </Upload>
                    <div style={{marginTop: 16}}>{__(messages["没有模板"])},<a
                        href={domain + "/v1/company/download_whitelist_template"}>{__(messages["点击下载"])}</a></div>
                </div>
            </Modal>
            <Modal maskClosable={false} footer={null} title={__(messages["导入结果"])} visible={this.state.importResultModalShow}
                   onCancel={this.handleCloseImportModal}>
                <div style={{marginBottom: 16}}><span className="result">{__(messages["导入成功"])}:{this.state.success}</span><span
                    className={this.state.fail === 0 ? "result" : "fail"}>{__(messages["导入失败"])}:{this.state.fail}</span></div>
                <BossTable columns={importResultColumns} dataSource={this.state.importResult}/>
            </Modal>
        </div> : <div className="function-off-container">
            <img src={function_off} alt=""/>
            <div>{__(messages["未开启海外加速，无法配置白名单"])}</div>
        </div>}
        </Card>

    }
}

export default injectIntl(CI0901);