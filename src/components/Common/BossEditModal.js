/**
 * 页面新增编辑通用输入框API
 * 参数:
 *      InputItems:Array[Object].Modal所有输入框的参数列表,详情参见InputItemsOption,
 *      hasFooter: Bool. Modal是否有页脚(包含确认取消按钮),
 *      title:String/React Node. Modal标题.
 *      dispatch:父组件挂载的Dispatch函数,用于内部调用父组件绑定的effects,
 *      submitType:String. 在submit之后调用的 redux effects名称. e.g.:"mi0201Info/get_link_list",会自动触发相应redux effects, payload为所有输入框输入值.
 *      extraUpdatePayload:Object. 若接口需要除输入框输入值意外的参数,可添加在这个属性中.e.g. id,sn...
 *      initPayload:Object. 在submit之后,若需要刷新原有页面,提供刷新页面初始化所需要的参数.
 *      initialValues:Object. model输入框所需要的初始值.
 *      hasSubmitCancel:Bool. 默认情况下为undefined,提交后自动关闭弹出窗,若有特殊需求,可使用submitCancel,设定submitCancel为true后,提交后不会关闭弹出窗,外部可以调用submitCancel指定的函数,获取到modal的实例this.
 *      submitCancel:Func.
 *      bodyHeight:Number. 设定弹出窗输入框的高度.
 *
 * InputItems Api:
 *      {
 *          type:String. 制定输入项类型,包含:"Input,Select,InputNumber,Radio,Cascader,Switch,GroupInput,TextArea,Checkbox...",
 *          labelName:String. 输入项Label.
 *          valName: String". 输入框值的Key,建议和后台数据名一致.
 *          nativeProps:Object. 针对不同种类输入框,所需要的额外属性.具体详见AntD各输入框Props.
 *          rules:Object. 输入框校验项,详见AntD输入框Rules,
 *          children:Array. 部分有子类的输入框,子类列表. e.g. Select下拉,Radio 选择项.
 *          customerFormLayout:Object. 自定义输入框布局,
 *          onChange:Func(value,this) 在onChange中暴露出this,供父组件使用内置的表单方法
 *      }
 *
 **/


import React from 'react';
import PropTypes from 'prop-types';
import {Upload,Button, Cascader, Checkbox, DatePicker, Form, Input, InputNumber, Modal, Radio, Select, Switch,Icon} from 'antd';
import "./BossEditModal.scss";
import {emptyFunction} from "../../utils/commonUtilFunc";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;
const TextArea = Input.TextArea;
const CheckboxGrp = Checkbox.Group;

class BossEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file:[]
        }
    };

    componentDidMount(){
        this.onRef();
    }

    handleSubmit = () => {
        let {InputItems} = this.props;
        let groupItems = [];
        for (let key in InputItems) {
            if (InputItems[key].type === 'GroupInput') {
                groupItems.push(InputItems[key].valName)
            }
        }
        this.props.form.validateFields((err, value) => {
            if (!err) {

                for (let index in groupItems) {
                    let temp = [];
                    for (let key in value) {
                        if (key.indexOf(groupItems[index]) === 0) {
                            temp.push(value[key])
                        }
                    }
                    value[groupItems[index]] = temp.join(",");
                }
                this.props.dispatch({
                    type: this.props.submitType || "",
                    payload: {
                        init: this.props.initPayload,
                        update: {...value, ...this.props.extraUpdatePayload, ...{record: this.props.initialValues}}, //extraUpdatePayload除了表单数据之外的参数,e.g.数据ID,常量;传入record,用来作为警告消息的消息源
                        vm: this,//bossEditModal this
                    },
                });
                if (this.props.hasSubmitCancel) {
                    this.props.submitCancel(this);//submitCancel 默认情况下为undefined,提交后自动关闭弹出窗,若有特殊需求,可使用submitCancel做指定操作,传出this,用于调用this.props.form相关方法
                } else {
                    this.props.onCancel();
                }
            }
        })
    };

    addInput = (item) => {
        let {initialValues} = this.props;
        initialValues[item.valName] = (initialValues[item.valName] || "") + ",";
        this.setState({
            a: 1
        })
    };

    deleteInput = (item, index) => {
        let temp = [];
        let {form, initialValues} = this.props;
        if (typeof initialValues[item.valName] === "string" && initialValues[item.valName]) {
            temp = initialValues[item.valName].split(',');
            temp.splice(index, 1);
            initialValues[item.valName] = temp.join(",");
        }
        this.setState({
            a: 1
        }, function () {
            let valuesArr = initialValues[item.valName].split(',');
            for (let index in valuesArr) {
                let key = item.valName + index;
                let temp = {};
                temp[key] = valuesArr[index];
                form.setFieldsValue(temp);
            }
        })
    };

    onRef=()=>{
        if(this.props.refs){
            this.props.refs(this);
        }
    };
    normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        console.log("event",e)
        return [e.file];
    };

    handleBeforeUpload=(file)=>{
        this.setState({
            file:file
        });
        return false;
    };

    render() {
        let {initialValues, InputItems} = this.props;
        const {getFieldDecorator} = this.props.form;
        const inEnglish = window.appLocale.locale === "en-US";
        const modalFormLayout = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 16},
            },
        };
        const modalFormLayoutHasBtn = {
            labelCol: {
                xs: {span: 5},
            },
            wrapperCol: {
                xs: {span: 19},
            },
        };
        const modalFormLayoutWithoutLabel = {
            wrapperCol: {
                xs: {span: 19, offset: 5},
            }
        };
        return (
            <Modal footer={this.props.hasFooter} {...this.props} onOk={this.handleSubmit} destroyOnClose
                   bodyStyle={{height: this.props.bodyHeight || 450, overflow: "scroll"}} maskClosable={false}
                   width={inEnglish ? 700 : 550}>
                <Form>
                    {InputItems.map((item, index) => {
                        switch (item.type) {
                            case "Plain":
                                return <FormItem style={{height: item.height || 16}}
                                                 label={item.labelName} {...(item.customerFormLayout ? item.customerFormLayout : modalFormLayout)}
                                                 key={index}>
                                    <div>{item.content}</div>
                                </FormItem>;
                            case "Input":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : modalFormLayout)}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <Input {...item.nativeProps}/>
                                    )}
                                </FormItem>;
                            case "InputNumber":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : (item.labelName ? modalFormLayout : modalFormLayoutWithoutLabel))}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <InputNumber {...item.nativeProps} />
                                    )}&nbsp;&nbsp;{item.unit}
                                </FormItem>;
                            case "Select":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : (item.labelName ? modalFormLayout : modalFormLayoutWithoutLabel))}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] !== undefined ? initialValues[item.valName] : undefined
                                    })(
                                        <Select {...item.nativeProps}
                                                onChange={item.onChange ? (value) => item.onChange(value, this) : ""}
                                                showSearch={true}
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}>
                                            {item.children ? item.children.map(child => <Option
                                                value={child.value} key={child.key}>{child.name}</Option>) : ""
                                            }
                                        </Select>
                                    )}
                                </FormItem>;
                            case "Cascader":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : (item.labelName ? modalFormLayout : modalFormLayoutWithoutLabel))}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <Cascader {...item.nativeProps}
                                                  onChange={item.onChange ? (value) => item.onChange(value, this) : ""}/>
                                    )}
                                </FormItem>;
                            case "Radio":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : (item.labelName ? modalFormLayout : modalFormLayoutWithoutLabel))}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName]
                                    })(
                                        <RadioGroup  {...item.nativeProps}
                                                     onChange={item.onChange ? (value) => item.onChange(value, this) : ""}>
                                            {item.children.map(child => <Radio
                                                value={child.value} key={child.key}>{child.name}</Radio>)}
                                        </RadioGroup>
                                    )}
                                </FormItem>;
                            case "DatePicker":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : modalFormLayout)}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <DatePicker  {...item.nativeProps}/>
                                    )}
                                </FormItem>;
                            case "Switch":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : modalFormLayout)}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        valuePropName: 'checked',
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || item.initialValue
                                    })(
                                        <Switch  {...item.nativeProps}
                                                 onChange={item.onChange ? (value) => item.onChange(value, this) : ""}/>
                                    )}
                                </FormItem>;
                            case "TextArea":
                                return <FormItem {...(item.customerFormLayout ? item.customerFormLayout : modalFormLayout)}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || undefined
                                    })(
                                        <TextArea  {...item.nativeProps}/>
                                    )}
                                </FormItem>;
                            case "GroupInput":
                                let valueGroups = [];
                                if (typeof initialValues[item.valName] === "string" && initialValues[item.valName]) {
                                    valueGroups = initialValues[item.valName].split(',')
                                }
                                return <div key={index}>
                                    <FormItem
                                        label={item.labelName} {...(item.labelName ? modalFormLayoutHasBtn : modalFormLayoutWithoutLabel)}
                                        key={index} style={item.style}>
                                        <div>
                                            {getFieldDecorator(item.valName || index, {
                                                rules: item.rules,
                                                initialValue: valueGroups[0]
                                            })(
                                                <Input  {...item.nativeProps} style={{width: 313, marginRight: 8}} disabled={item.disabled}/>
                                            )}
                                            <Button icon="plus" shape="circle" onClick={() => this.addInput(item)} disabled={item.disabled}/>
                                        </div>
                                    </FormItem>
                                    {valueGroups.map((groupItems, groupIndex) => {
                                        if (!groupIndex) {
                                            return "";
                                        }
                                        return <FormItem  key={groupIndex} {...modalFormLayoutWithoutLabel}
                                                         style={Object.assign({},item.style,{display:item.disabled?"none":"block"})}>
                                            <div>{getFieldDecorator((item.valName || index) + groupIndex, {
                                                rules: item.rules,
                                                initialValue: groupItems
                                            })(
                                                <Input  {...item.nativeProps} style={{width: 313, marginRight: 8}}
                                                        disabled={item.disabled}/>
                                            )}
                                                <Button shape="circle" icon="minus"
                                                        onClick={() => this.deleteInput(item, groupIndex)} disabled={item.disabled}/>
                                            </div>
                                        </FormItem>
                                    })}
                                </div>;
                            case "CheckBox":
                                return <FormItem {...item.customerFormLayout ? item.customerFormLayout : modalFormLayout}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || item.initialValue,//前者是编辑时整体传入的initial value,后者是添加时可能需要独立的initialValue
                                        valuePropName: 'checked',
                                    })(
                                        <Checkbox onChange={item.onChange ? (value) => item.onChange(value, this) : ""} {...item.nativeProps}>{item.checkBoxName}</Checkbox>
                                    )}
                                </FormItem>;
                            case "CheckboxGroup":
                                return <FormItem {...item.customerFormLayout ? item.customerFormLayout : modalFormLayout}
                                                 label={item.labelName} key={index} style={item.style}>
                                    {getFieldDecorator(item.valName || index, {
                                        rules: item.rules,
                                        initialValue: initialValues[item.valName] || item.initialValue,//前者是编辑时整体传入的initial value,后者是添加时可能需要独立的initialValue
                                    })(
                                        <CheckboxGrp onChange={item.onChange ? (value) => item.onChange(value, this) : emptyFunction()} {...item.nativeProps} options={item.children}/>
                                    )}
                                </FormItem>;
                            case "Upload":
                                return <FormItem {...item.customerFormLayout ? item.customerFormLayout : modalFormLayout}
                                          label={item.labelName} key={index} style={item.style}
                                >
                                    {getFieldDecorator(item.valName || index, {
                                        valuePropName: 'fileList',
                                        getValueFromEvent: this.normFile,
                                    })(
                                        <Upload name="logo" listType="picture" beforeUpload={this.handleBeforeUpload}>
                                            <Button disabled={item.disabled}>
                                                <Icon type="upload" /> 上传文件
                                            </Button>
                                        </Upload>
                                    )}
                                </FormItem>;
                            default:
                                return ""
                        }
                    })}
                </Form>
            </Modal>
        );
    }
}

BossEditModal.propTypes = {
    InputItems: PropTypes.array,
    hasFooter: PropTypes.bool,
    title: PropTypes.string,
    submitType: PropTypes.string,
    extraUpdatePayload: PropTypes.object,
    initPayload: PropTypes.object,
    initialValues: PropTypes.object,
    namespace: PropTypes.string,
    hasSubmitCancel: PropTypes.bool,
    submitCancel: PropTypes.func,
    bodyHeight: PropTypes.number,
    bodyWidth: PropTypes.number,
};

BossEditModal.defaultProps = {
    InputItems: [],
    hasFooter: undefined,
    title: "",
    initialValue: {},
    extraUpdatePayload: {},
    initPayload: {},
    namespace: "",
    submitType: "",
    hasSubmitCancel: false,
};

export default Form.create()(BossEditModal);