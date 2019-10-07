/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */

import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import Link from 'umi/link';
import { Dispatch } from 'redux';
// import { connect } from 'dva';
import { formatMessage } from 'umi-plugin-react/locale';
import enquire from 'enquire.js';

import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
// import { ConnectState } from '@/models/connect';
import { isAntDesignPro } from '@/utils/utils';
import connectFn from '@/utils/connectFn';
import logo from '../assets/logo.svg';

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  settings: Settings;
  dispatch: Dispatch;
}
export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

/**
 * use Authorized check all menu item
 */
const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
  menuList.map(item => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : [],
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const footerRender: BasicLayoutProps['footerRender'] = (_, defaultDom) => {
  if (!isAntDesignPro()) {
    return defaultDom;
  }
  return (
    <>
      {defaultDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const { dispatch, children, settings } = props;
  /**
   * constructor
   */

  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({
        type: 'settings/getSetting',
      });
    }
  }, []);

  /**
   * init variables
   */
  const handleMenuCollapse = (payload: boolean): void => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  return (
    <ProLayout
      logo={logo}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      // breadcrumbRender={(routers = []) => [
      //   {
      //     path: '/',
      //     breadcrumbName: formatMessage({
      //       id: 'menu.home',
      //       defaultMessage: 'Home',
      //     }),
      //   },
      //   ...routers,
      // ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={footerRender}
      menuDataRender={menuDataRender}
      formatMessage={formatMessage}
      rightContentRender={rightProps => <RightContent {...rightProps} />}
      {...props}
      {...settings}
    >
      {children}
    </ProLayout>
  );
};

@connectFn([{ global: ['collapsed', 'isMobile'] }, 'settings'])
class BasicLayoutContainer extends React.PureComponent<BasicLayoutProps> {
  // 订阅媒体查询
  componentDidMount() {
    this.queryMedia();
  }

  // 卸载事件
  componentWillUnmount() {
    enquire.unregister('screen and (max-width:767.99px)')
  }

  // 查询media
  queryMedia = () => {
    const { dispatch } = this.props;
    const body = document.querySelector('body');
    enquire.register('screen and (max-width:767.99px)', {
      match() {
        dispatch({
          type: 'global/changeIsMobile',
          payload: true,
        })
        if (body && !body.classList.contains('page-mobile')) {
          body.classList.add('page-mobile')
        }
      },
      unmatch() {
        dispatch({
          type: 'global/changeIsMobile',
          payload: false,
        })
        if (body && body.classList.contains('page-mobile')) {
          body.classList.remove('page-mobile')
        }
      },
      destroy() {},
    });
  }

  render() {
    return <BasicLayout {...this.props}></BasicLayout>
  }
}

export default BasicLayoutContainer
// export default connect(({ global, settings }: ConnectState) => ({
//   collapsed: global.collapsed,
//   settings,
// }))(BasicLayoutContainer);
