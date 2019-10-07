import React from 'react';
import connectFn from '@/utils/connectFn';
import { ConnectProps } from '@/models/connect';

@connectFn(['login'], ['fakeAccountLogin'])
class Test extends React.PureComponent<ConnectProps> {
  handleClick = () => {
    const { dispatch } = this.props;
    // fakeAccountLogin({ userName: 'admin', password: '123456' })
    //   .then((res: any) => {
    //     console.log(res)
    //   })
    if (dispatch) {
      dispatch({
        type: 'global/changeIsLoading',
        payload: true,
      })
    }
  };

  render() {
    return (
      <p onClick={this.handleClick}>12312312</p>
    )
  }
}

export default Test;
