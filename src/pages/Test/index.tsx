import React from 'react';
import connectFn from '@/utils/connectFn';
import { ConnectProps, GlobalState } from '@/models/connect';
import CreateCard from '@/components/CreateCard';
import CreateForm from '@/components/CreateForm';
import CreateTable from '@/components/CreateTable';
import CommonHoc from '@/components/commonHoc';
import { getFormData, getTableData } from '@/pages/Test/utils';

// const WithBtn = WithElementAuth(Button);

@connectFn(['login', 'test'])
@CommonHoc
class Test extends React.PureComponent<GlobalState, GlobalState> {
  constructor (props: ConnectProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'test/fetchList',
      payload: {},
    });
    this.requestList();
  }

  requestList = () => {
    this.props.dispatch({
      type: 'test/fetchData',
      payload: {},
    })
  };

  render() {
    return (
      <CreateCard addAuth {...this.props} >
        <CreateForm formConfig={getFormData(this)} />
        <CreateTable tableConfig={getTableData(this)}/>
      </CreateCard>
    )
  }
}

export default Test
