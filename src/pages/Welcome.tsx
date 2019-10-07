import React, { Component } from 'react';
import { Card, Alert } from 'antd';
// import { connect } from 'dva';
import { ConnectProps } from '@/models/connect';

// @connect((state: ConnectState) => {
//   return state
// })
export default class Welcome extends Component<ConnectProps> {
  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  }

  render() {
    return (
      <React.Fragment>
      <Card>
        <Alert
          message="umi ui 现已发布，欢迎使用 npm run ui 启动体验。"
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
      </Card>
      </React.Fragment>
    );
  }
}
