import {connect} from 'dva';
import CI2702C from '../../components/CI/CI2702/Index';
import {Form} from 'antd';

function mapDispatchToProps({ ci2702Info }) {
    return {ci2702Info};
}

const CI2702R = Form.create()(CI2702C);

export default connect(mapDispatchToProps)(CI2702R);