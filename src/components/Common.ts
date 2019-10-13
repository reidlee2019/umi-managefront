/**
 * 混入方法
 */
import React from 'react';
import { StateType } from '@/common-typings';
import { ConnectProps } from '@/models/connect';
import _ from 'lodash';

class Mixins extends React.PureComponent<ConnectProps, StateType> {
  // 改变状态
  changeState = (
    param = {},
    name: string,
    callBack: Function,
    data = {},
  ) => {
    // 如果有参数过来，则进行更新
    if (name && !_.isEmpty(param)) {
      // 如果需要更新父级状态，调用此方法
      // if (this.state.isChangeParentState && this.props.changeParentState) {
      //   this.props.changeParentState(name, param)
      // }
      const state = this.state[name];
      // 如果需要改变store状态
      this.setState({
        [name]: {
          ...state,
          ...param,
        },
      }, () => {
        if (callBack) callBack(data)
      })
    } else if (callBack) {
      callBack(data)
    }
  };

  // 改变查询表单的状态
  changeSearchFormState = (
    param: StateType,
    callBack: Function,
    isResetPagination = false,
    data: StateType,
  ) => {
    const { tableConfig = {} } = this.state;
    if (isResetPagination && tableConfig && !_.isEmpty(tableConfig.pagination)) {
      // this.changePaginationState({ page: 1, pageSize: 10 }, () => {
      //   this.changeState(param, 'formConfig', callBack, data)
      // })
    } else {
      this.changeState(param, 'formConfig', callBack, data)
    }
  };
}

export default Mixins;

