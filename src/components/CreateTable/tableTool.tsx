import React from 'react';
import { Button } from 'antd';
import WithElementAuth from '@/components/WithElementAuth';

interface TableToolProps {
  options: any[];
}

class Links extends React.Component {
  state = {};

  render() {
    return <p className="table-tool__link"/>
  }
}

const WithLinkAuth = WithElementAuth(Links);
const WithButtonAuth = WithElementAuth(Button);

class TableTool extends React.PureComponent<TableToolProps> {
  renderTableToolView() {
    const { options } = this.props;
    return options.map((item: any) => {
      if (item.default && item.default === 'button') {
        return <WithButtonAuth
          type="primary"
          size="small"
          key={item.name}
          auth={item.auth}
          onClick={item.event.click}
          {...item}
      >{item.name}</WithButtonAuth>
      }
      return <WithLinkAuth
        key={item.name}
        auth={item.auth}
        onClick={item.event.click}
      >{item.name}</WithLinkAuth>
    })
  }

  render() {
    return (
      <div className="table-tool-view">
        {this.renderTableToolView()}
      </div>
    )
  }
}

export default TableTool
