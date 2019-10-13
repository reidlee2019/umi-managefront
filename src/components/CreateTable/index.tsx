import React from 'react';
import _ from 'lodash';
import { Table, Tooltip, Row, Col } from 'antd';
import { types } from '@/utils/utils';
import { GlobalState } from '@/models/connect';

interface CreateTableProps {
  tableConfig: {
    header: any[];
    data: any[];
    config?: any;
    loading?: boolean;
    [propName: string]: any;
  }
}

class CreateTable extends React.PureComponent<CreateTableProps> {
  public defaultPagination = {
    current: 1,
    pageSize: 10,
    total: 0,
  };

  public defaultConfig = {
    className: '',
    bordered: true,
    showHeader: true,
  };

  /**
   * 获取字符串的真实长度
   */
  getStrLen = (str: any) => {
    let realLength = 0;
    let charCode;
    for (let i = 0; i < str.toString().length; i++) {
      charCode = str.toString().charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;
      else realLength += 2;
    }
    return realLength;
  };

  /**
   * 数据源key与id绑定，值不可重复
   */
  bindDataSourceKey = () => {
    const { tableConfig } = this.props;
    const { data, bindKey = 'id' } = tableConfig;
    const result = data.map((item: any, index) => {
      item.key = item[bindKey] || index;
      return item
    });
    return result;
  };

  /**
   * 获取数据的前端汇总值
   * 不考虑数据的重复遍历情况， 因为后台header的数据条数很少
   */
  getTableDataSummary = () => {
    const { tableConfig } = this.props;
    const { header, data } = tableConfig;
    const summary = header.some(item => item.summary);
    const total:any[] = []; // 汇总数据

    // 是否需要汇总并且data有值
    if (summary && data.length) {
      header.forEach(headerItem => {
        // 排除隐藏行
        if (!headerItem.hidden) {
          const obj = {};
          // 判断子项数据是否需要汇总
          if (headerItem.summary) {
            // 目前只考虑数字类型的总计
            obj[headerItem.dataIndex] = data.reduce((accumulator, currentValue) =>
              accumulator + +currentValue[headerItem.dataIndex], 0)
          // 默认的文本
          } else if (headerItem.defaultText) {
            obj[headerItem.dataIndex] = headerItem.defaultText;
          // 增加一个过滤的的文本
          } else {
            obj[headerItem.dataIndex] = '|';
          }
          const totalObj = {
            content: obj[headerItem.dataIndex],
            key: headerItem.dataIndex,
          };
          // 有总计并且有render
          if (headerItem.render && headerItem.summary) {
            total.push(Object.assign({}, totalObj, { render: headerItem.render }))
          } else {
            total.push(totalObj)
          }
        }
      })
    }
    return total;
  };

  /**
   * 计算出数据源中对应数据最大长度
   */
  getDataSourceItemMaxLength = () => {
    const { tableConfig } = this.props;
    const { header, data } = tableConfig;
    const maxLengthObj = { hasOperates: false }; // 最小宽度的对象
    // 对dataSource数据进行处理
    if (data.length) {
      header.map(headerItem => {
        // 获取没项数据的最大长度
        if (headerItem.dataIndex !== 'operates') {
          const arr: any[] = [];
          data.map(dataItem => {
            if (dataItem.hasOwnProperty(headerItem.dataIndex)) {
              if (types(dataItem[headerItem.dataIndex]) !== 'array' && types(dataItem[headerItem.dataIndex]) !== 'object') {
                arr.push(this.getStrLen(`${dataItem[headerItem.dataIndex]}`))
              }
            }
            return dataItem
          })
          maxLengthObj[headerItem.dataIndex] = arr ? Math.max.apply(null, arr) : 0;
        } else {
          maxLengthObj.hasOperates = true;
        }
        return headerItem
      });
    }
    return maxLengthObj;
  };

  /**
   * 原数据处理器
   */
  dataSourceHandle = (data: any[]) => ({
      list: this.bindDataSourceKey(),
      total: this.getTableDataSummary(),
      minLenObj: this.getDataSourceItemMaxLength(),
    });

  getWidth = (len: number) => {
    if (len >= 15) {
      return len * 10 > 300 ? 300 : len * 10;
    }
    if (len > 4) {
      return len * 13;
    }
    return 60;
  };

  columnsBindRender = (data: any[], minLenObj: any) => {
    data = [...data].filter(item => !item.hidden);
    const len = 50; // 设置最大显示的字符长度
    const totalWidth = 0; // table的最小宽度
    const width = 0;

    const { expandedData = [], emptyColumn } = this.props.tableConfig;
    if (emptyColumn && !expandedData.length) {
      data.unshift({
        width: 50,
      })
    }

    // data.map((item, index) => {
    //   item.key = item.dataIndex || Date.now();
    //   if (minLenObj.hasOwnProperty(item.dataIndex)) {
    //     width = this.getWidth(Math.max(minLenObj[item.dataIndex], this.getStrLen(item.title)));
    //     if (item.width) {
    //       if (types(item.width) === 'Number') {
    //         width = item.width
    //       }
    //     } else {
    //       item.width = width;
    //     }
    //     totalWidth += width
    //   } else if (item.width && types(item.width) === 'Number') {
    //     totalWidth += item.width
    //   } else if (minLenObj.hasOperates) {
    //     if (item.width && types(item.width) === 'Number') {
    //       width = item.width
    //       totalWidth += width
    //     } else {
    //       item.width = 120; // 操作区域宽度
    //       totalWidth += item.width
    //     }
    //   } else {
    //     item.width = this.getWidth(this.getStrLen(item.title));
    //     totalWidth += item.width;
    //   }

    //   if (!item.render) {
    //     item.render = (text: any, row: any) => {
    //       if (text === null || text === undefined) {
    //         return '--'
    //       }
    //       if (text === '|') {
    //         return ''
    //       }
    //       if (text.toString().length <= len) {
    //         return text
    //       }
    //       return (
    //         <Tooltip placement="top" title={text}>
    //           <span>{`${text.toString().slice(0, len)}...`}</span>
    //         </Tooltip>
    //       )
    //     }
    //   }
    //   return item
    // });

    return {
      data,
      totalWidth,
    }
  };

  // 分页配置
  getPaginationConfig = () => {
    let newPagination = false;
    if (!!this.props.tableConfig && !_.isEmpty(this.props.tableConfig.pagination)) {
      newPagination = {
        ...this.defaultPagination,
        ...this.props.tableConfig.pagination,
        current: this.props.tableConfig.pagination.page,
      }
    }
    return newPagination
  };

  // 渲染footer
  tableFooter = (dataSource: GlobalState) => {
    if (dataSource.total && dataSource.total.length) {
      return (
        <tr className="ant-table-row" style={{ background: '#f5f5f5' }}>
        {
          dataSource.total.map((item: any) => (
            <td key={item.key}>
              { item.render && (item.render ? item.render(item.content) : item.content) }
              { !item.render && (item.content !== '|' ? item.content : '') }
            </td>
          ))
        }
        </tr>
      )
    }
    return null
  };

  expandedRowRender = () => {
    const { expandedColumns = [], expandedData = [] } = this.props.tableConfig;
    return <Table
      showHeader={false}
      bordered={false}
      columns={expandedColumns}
      dataSource={expandedData}
      pagination={false} />;
  };

  render() {
    const { tableConfig } = this.props;
    const { header, data, loading, rowSelection, config = {} } = tableConfig;
    const dataSource = this.dataSourceHandle(data);
    const columns = this.columnsBindRender(header, dataSource.minLenObj);
    // const pagination = this.getPaginationConfig();

    // console.log(dataSource);
    // 考虑table的汇总数据
    const BodyWrapper = (props: any) => (
      <tbody {...props}>
        <React.Fragment>
          {props.children}
          {this.tableFooter(dataSource)}
        </React.Fragment>
      </tbody>
    );
    return (
      <div className="st-content">
        <div className="st-content__body" style={{ width: '100%' }}>
          {
            // 考虑头部DOM的节点
            tableConfig.tableTitle && tableConfig.tableTitle()
          }
          <Table
            components={{ body: { wrapper: BodyWrapper } }}
            loading={loading}
            dataSource={dataSource.list}
            columns={columns.data}
            rowSelection={rowSelection || null}
            {...this.defaultConfig}
            {...config}
            // pagination={pagination}
          />
        </div>
      </div>
    )
  }
}

export default CreateTable
