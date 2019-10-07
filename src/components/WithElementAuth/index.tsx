/**
 * 元素权限控制，主要用于按钮
 */
import React, { Component } from 'react';
import connectFn from '@/utils/connectFn';
import { GlobalState } from '@/models/connect';

interface WithElementAuthProps {
  permissions?: string[];
  auth?: string | boolean;
}

const WithElementAuth = (ComposedComponent: typeof React.Component) => {
  class WithElementAuths extends Component<WithElementAuthProps> {
    // props中的关键字
    filterKey = ['auth', 'dispatch'];

    // 过滤props中的关键字，防止与原生标签属性重名等问题
    filterProps = (props: GlobalState) => {
      const result = {};
      Object.keys(props).forEach(key => {
        if (!this.filterKey.includes(key)) {
          result[key] = props[key];
        }
      })
      return result
    }

    render() {
      const { permissions, auth = false } = this.props;
      const newProps = this.filterProps(this.props);
      if (auth || (permissions
        && permissions.length && auth && permissions.includes(auth.toString()))) {
        return <ComposedComponent {...newProps}/>;
      }
      return null
    }
  }
  return connectFn([{ global: ['permissions'] }])(WithElementAuths)
}

export default WithElementAuth;
