import React from 'react';
import { Button } from 'antd';
import connectFn from '@/utils/connectFn';
import { ConnectProps } from '@/models/connect';
import WithElementAuth from '@/components/WithElementAuth';
import CreateCard from '@/components/CreateCard';

const WithBtn = WithElementAuth(Button);

@connectFn(['login'], ['fakeAccountLogin'])
class Test extends React.PureComponent<ConnectProps> {
  handleClick = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeIsLoading',
        payload: true,
      })
    }
  };

  render() {
    return (
      <CreateCard
        addAuth
        {...this.props}
      >
        <p onClick={this.handleClick}>12312312</p>
        {/* <WithBtn auth="true">1313</WithBtn> */}
      </CreateCard>
    )
  }
}

export default Test;
