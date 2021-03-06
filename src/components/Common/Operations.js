import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Popconfirm,Tooltip} from 'antd';
import "./Operations.scss";
import messages from './LocaleMsg/messages';
import {injectIntl} from "react-intl";
class Operations extends React.Component {
    render() {
        const __=this.props.intl.formatMessage;
        return <div style={{display:"inline-block"}}>
            {this.props.hasEdit?<Icon type="edit" onClick={this.props.edit} className="operations-edit-btn"/>:""}
            {this.props.hasDelete?<Popconfirm title={__(messages["确定删除当前信息?"])} onConfirm={this.props.delete}>
                <Icon type="delete" style={{
                }} className="operations-delete-btn"/>
            </Popconfirm>:""}
            {this.props.hasExtra?<Tooltip title={this.props.extraToolTip}><Icon type={this.props.extraIcon||"ellipsis"} className="operations-ellipsis-btn" onClick={this.props.extra}/></Tooltip>:""}

        </div>
    }
}
  
Operations.propTypes={
    edit:PropTypes.func,
    delete:PropTypes.func,
    hasExtra:PropTypes.bool,
    hasDelete:PropTypes.bool,
    hasEdit:PropTypes.bool,
    extra:PropTypes.func,
    extraIcon:PropTypes.string,
    extraToolTip:PropTypes.string,
};


export default injectIntl(Operations);

