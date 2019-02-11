import React from 'react';
import './index.scss';
import {Modal, Card, Button, Icon} from 'antd';
import BossTable from "../../Common/BossTable";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
import HeaderBar from "../../Common/HeaderBar";

class MC0101 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            task_uuid: "",
            checkTaskId: "",
            primaryModalShow: false,
            taskModalShow: false,
            taskModalData: {},
            logType:""
        }
    }

    componentDidMount() {
        this.props.dispatch({
            type: "mc0101Info/init",
        })
    }

    searchByUuid = (value) => {
        this.setState({
            uuid:value
        },()=>{
            this.props.dispatch({
                type: "mc0101Info/init",
                payload: {
                    task_uuid: this.state.uuid
                }
            })
        })

    };

    checkTask = (record) => {
        this.setState({
            taskModalShow: true,
            taskModalData: record
        })
    };

    checkLog = (record) => {
        const logId = record.id;
        const type = record.type;
        this.setState({
            checkTaskId: logId,
            primaryModalShow: true,
            logType:type
        }, function () {
            this.props.dispatch({
                type: "mc0101Info/getLogTaskList",
                payload: {
                    task_id: logId,
                    type: type
                }
            })
        })
    };

    cancelCheckPrimary = () => {
        this.setState({
            primaryModalShow: false
        })
    };

    cancelTaskModal = () => {
        this.setState({
            taskModalShow: false,
            taskModalData: {},
        })
    };
    showReason = (record) => {
        const __=this.props.intl.formatMessage;
        Modal.warning({
            title: __(messages["原因详情"]),
            content: record.message
        })
    };


    render() {
        const __=this.props.intl.formatMessage;
        const columns = [{
            title: __(messages['任务uuid']),
            dataIndex: 'task_uuid',
            key: 'task_uuid',
        }, {
            title: __(messages['开始时间']),
            dataIndex: 'begin_time',
            key: 'begin_time',
        }, {
            title: __(messages['结束时间']),
            dataIndex: 'end_time',
            key: 'end_time',
            render: (index, record) => {
                return (
                    <span>{record.end_time || "--"}</span>
                )
            }
        }, {
            title: __(messages['类型']),
            dataIndex: 'type',
            key: 'type',
        }, {
            title: __(messages['状态']),
            dataIndex: 'status',
            key: 'status',
            render: (index, record) => {
                switch (record.status) {
                    case "INIT":
                        return <div style={{color: "#ff0002"}}>{record.status}</div>
                    case "FAILED":
                        return <div style={{color: "#0c00ff"}}>{record.status}</div>
                    case "FINISHED":
                        return <div style={{color: "#007f01"}}>{record.status}</div>
                    default:
                        return <div style={{color: "#007f01"}}>{record.status}</div>
                }
            }
        }, {
            title: __(messages['详情']),
            dataIndex: 'model',
            key: 'model',
            align: "center",
            width: 100,
            render: (index, record) => {
                return (
                    <Icon type="file-text" onClick={() => this.checkLog(record)}/>
                )
            }
        },];

        const column1 = [
            {
                title: __(messages['设备序列号']),
                dataIndex: 'sn',
                key: 'sn',
            }, {
                title: __(messages['日期']),
                dataIndex: 'date',
                key: 'date',
            }, {
                title: __(messages['日志类型']),
                dataIndex: 'type',
                key: 'type',
            }, this.state.logType?{
                title: "命令",
                dataIndex: 'cmd',
                key: 'cmd',
            }:"",{
                title: __(messages['开始时间']),
                dataIndex: 'begin_time',
                key: 'begin_time',
            }, {
                title: __(messages['结束时间']),
                dataIndex: 'end_time',
                key: 'end_time',
            }, {
                title: __(messages['状态']),
                dataIndex: 'status',
                key: 'status',
                render: (index, record) => {
                    switch (record.status) {
                        case "INIT":
                            return <span style={{color: "#FFD02D"}}>{record.status}</span>
                        case "ONLINE":
                            return <span style={{color: "#0EC80E"}}>{record.status}</span>
                        case "OFFLINE":
                            return <span style={{color: "#ff0002"}}>{record.status}</span>
                        default:
                            return <span>{record.status}</span>
                    }
                }
            }, {
                title: __(messages['信息']),
                dataIndex: 'message',
                key: 'message',
            }, {
                title: __(messages['详情']),
                dataIndex: 'model',
                key: 'model',
                align: "center",
                width: 100,
                render: (index, record) => {
                    return (
                        <Icon type="file-text" onClick={() => this.checkTask(record)}/>
                    )
                }
            }
        ];
        const columns2 = [{
            title: __(messages['路径']),
            dataIndex: 'path',
            key: 'path',
        }, {
            title: __(messages['原因']),
            dataIndex: 'reason',
            key: 'reason',
            render: (index, record) => {
                return (<Button onClick={() => this.showReason(record)} size="samll">{__(messages["原因"])}</Button>)
            }
        }, {
            title: __(messages['状态']),
            dataIndex: 'status',
            key: 'status',
        },];
        const pagination = {
            pageSize: 20
        };
        const pagination1 = {
            pageSize: 10
        };

        return (
            <Card className="card">
                <HeaderBar hasSearch={true} submit={this.searchByUuid} searchInputWidth={250}/>
                <BossTable pagination={pagination} columns={columns}
                           dataSource={this.props.mc0101Info.dataSource}/>
                <Modal maskClosable={false} visible={this.state.primaryModalShow} onCancel={this.cancelCheckPrimary}
                       width={900}
                       title={__(messages["log详情_"]) + this.state.checkTaskId} footer={null}>
                    <BossTable pagination={pagination1} columns={column1}
                               dataSource={this.props.mc0101Info.taskLogDataSource}/>
                </Modal>
                <Modal maskClosable={false} visible={this.state.taskModalShow} footer={null}
                       title={__(messages["日志详情"]) + this.state.taskModalData.id} onCancel={this.cancelTaskModal}>
                    <BossTable pagination={pagination} columns={columns2}
                               dataSource={this.state.taskModalData.result ? JSON.parse(this.state.taskModalData.result) : ""}/>
                </Modal>
            </Card>

        )
    }
}

export default injectIntl(MC0101);