import {connect} from 'dva';
import CI0203C from '../../components/CI/CI0203/index';
import {Form} from 'antd';

function mapDispatchToProps({ ci0203Info }) {
    return {ci0203Info};
}

const CI0203R = Form.create()(CI0203C);

export default connect(mapDispatchToProps)(CI0203R);