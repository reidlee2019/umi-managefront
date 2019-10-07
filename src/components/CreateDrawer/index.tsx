/**
 * 移动端表单弹出组件
 */
import React, { Component } from 'react';
// import classNames from 'classnames';
// import { Icon } from 'antd';
import connectFn from '@/utils/connectFn';
import { GlobalState } from '@/models/connect';

import './index.less';

interface CreateDrawerProps {
  isMobile: boolean;
  isLogin: boolean;
  formConfig: GlobalState;
}

const CreateDrawer = (ComposedComponent: typeof React.Component) => {
  class CreateDrawers extends Component<CreateDrawerProps> {
    visible = true;

    render() {
      const { isMobile, isLogin, formConfig } = this.props;
      /**
       * 1. 未登录
       * 2. 非手机端
       * 3. 弹出窗
       * 4. 非drawer的组件
       * 以上4种场景不做任何处理
       */
      if (!isLogin || !isMobile || formConfig.isPop || formConfig.noDrawer) {
        return <ComposedComponent {...this.props}/>
      }
      return null;
      // return (
      //   <div className="create-drawer">
      //     {!visible && <div className="create-drawer-mark"></div>}
      //     <div className={classNames("create-drawer-body", { closed: visible, open: !visible })}>
      //       <div className="create-drawer-body-text" onClick={this.changeState}>
      //         筛选
      //       </div>
      //       <div className="create-drawer-body-title">
      //         <span className="create-drawer-body-title__icon" onClick={this.closeDrawer}>
      //           <Icon type="left" />
      //         </span>
      //         <span>筛选条件</span>
      //       </div>
      //       <div className="create-drawer-body-content">
      //         <ComposedComponent {...this.props} closeDrawer={this.closeDrawer}/>
      //       </div>
      //     </div>
      //   </div>
      // )
    }
  }
  return connectFn([{ global: ['isMobile'] }, { user: ['isLogin'] }])(CreateDrawers)
}

export default CreateDrawer
