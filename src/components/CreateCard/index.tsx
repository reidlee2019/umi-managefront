/**
 * 页面外层卡片容器
 */
import React from 'react';
import { Card, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import WithElementAuth from '@/components/WithElementAuth';
import connectFn from '@/utils/connectFn';

import './index.less';

interface CrateCardProps {
  location?: {pathname: string};
  defaultTitle?: string; // 自定义的标题
  renderTitleNode?: Function; // 自定义的左侧标题节点方法
  addAuth?: string | boolean; // 新增权限
  backAuth?: string | boolean; // 返回权限
  exportAuth?: string; // 导出权限
  exportLoading?: boolean; // 导出loading ？？？
  isMobile?: boolean;
}

const WithBtnAuth = WithElementAuth(Button)

@connectFn([{ routing: ['location'], global: ['isMobile'] }])
class CreateCard extends React.PureComponent<CrateCardProps> {
  // 获取card标题
  getCardTitle = () => {
    const { location, defaultTitle, renderTitleNode } = this.props
    let title = '';
    if (defaultTitle) {
      title = defaultTitle;
    } else if (location && location.hasOwnProperty('pathname')) {
      const formatPathname = location.pathname.replace(/\//g, '.');
      title = formatMessage({ id: `menu${formatPathname}` });
    }
    return (
      <div className="antd-card-title">
        <span>{title}</span>
        {
          // 当标题右侧具备节点时，render标题旁节点
          renderTitleNode && renderTitleNode()
        }
      </div>
    )
  }

  // 获取card右侧附加的元素
  getCardextra() {
    const {
      addAuth,
      backAuth,
      exportAuth,
      exportLoading = false,
      isMobile,
    } = this.props;
    return (
      <React.Fragment>
        <WithBtnAuth auth={addAuth} type="primary" size="small" block={!!isMobile} onClick={this.handleAdd}>新增</WithBtnAuth>
        <WithBtnAuth auth={backAuth} size="small" block={!!isMobile} onClick={this.handleGoback}>返回</WithBtnAuth>
        {!isMobile && <WithBtnAuth style={{ marginLeft: '10px' }} auth={exportAuth} type="primary" size="small" onClick={this.handleExport} loading={exportLoading}>导出Excel</WithBtnAuth>}
      </React.Fragment>
    )
  }

  // 点击返回
  handleGoback = () => {

  }

  // 点击新增
  handleAdd = () => {

  }

  // 点击导出
  handleExport = () => {

  }

  render() {
    const { children } = this.props;
    return (
      <Card
        className="st-antd-card"
        title={this.getCardTitle()}
        extra={this.getCardextra()}
      >
        { children }
      </Card>
    )
  }
}

export default CreateCard
