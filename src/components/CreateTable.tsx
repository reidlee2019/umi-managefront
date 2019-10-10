import React from 'react';
import _ from 'lodash';
import { Table, Tooltip, Row, Col } from 'antd';
import { types } from '@/utils/utils';
import { GlobalState } from '@/models/connect';

interface CreateTableProps {
  tableConfig: {
    header: any[];
    data?: any[];
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
  }

  /**
   * 表头
   */
  // renderTableTitle = () => {
  //   const { tableTitle = [] } = this.props.tableConfig;
  //   if(tableTitle.length) {
  //     const tableTitleContent = tableTitle.map((item: any) => (
  //       <Col key={item.id} xs={24} sm={8} md={6} lg={4} className="m-table-title-col">
  //         <label>{item.label}</label>
  //         <p>{item.value}</p>
  //       </Col>
  //     )

  //     return <Row className="m-table-title">{tableTitleContent}</Row>
  //   }
  //   return null
  // };

  /**
   * dataSource的数据处理
   */
  dataSourceBindKeys = (data: any[]) => {
    const { bindKey = 'id', isTotal = false, header } = this.props.tableConfig;
    let list = []; // 新的list
    const total: any[] = []; // 汇总数据
    const minLenObj = { hasOperates: false }; // 最小宽度的对象

    list = data.map((item: any, index) => {
      item.key = item[bindKey] || index;
      return item
    })

    // 对dataSource数据进行处理
    if (list.length) {
      const obj = {};
      header.map((headerItem, index) => {
        // 是否需要对数据进行计总
        if (isTotal && !headerItem.hidden) {
          if (headerItem.isTotal) {
            obj[headerItem.dataIndex] = 0;
            data.map(dataItem => {
              obj[headerItem.dataIndex] += +dataItem[headerItem.dataIndex]
              return dataItem
            })
          } else if (headerItem.defaultText) {
              obj[headerItem.dataIndex] = headerItem.defaultText;
            } else {
              obj[headerItem.dataIndex] = '|';
            }
          const totalObj = {
            content: obj[headerItem.dataIndex],
          }
          // 有总计并且有render
          if (headerItem.render && headerItem.isTotal) {
            total.push(Object.assign({}, totalObj, { render: headerItem.render }))
          } else {
            total.push(totalObj)
          }
        }
        // 获取没项数据的最大长度
        if (headerItem.dataIndex !== 'operates') {
          const arr: any[] = [];
          data.map(dataItem => {
            if (dataItem.hasOwnProperty(headerItem.dataIndex)) {
              if (types(dataItem[headerItem.dataIndex]) !== 'Array' && types(dataItem[headerItem.dataIndex]) !== 'Object') {
                arr.push(this.getStrLen(`${dataItem[headerItem.dataIndex]}`))
              }
            }
            return dataItem
          })
          minLenObj[headerItem.dataIndex] = arr ? Math.max.apply(null, arr) : 0;
        } else {
          minLenObj.hasOperates = true;
        }
        return headerItem
      })
    }
    return {
      list,
      total,
      minLenObj,
    }
  }

  getWidth = (len: number) => {
    if (len >= 15) {
      return len * 10 > 300 ? 300 : len * 10;
    }
    if (len > 4) {
      return len * 13;
    }
    return 60;
  };

  // 头部设置绑定key
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
  }

  // 渲染footer
  // renderFooter = (dataSource) => {
  //   if(dataSource.total.length) {
  //     return (
  //       <table>
  //         <tbody>
  //         <tr>
  //           {
  //             dataSource.total.map((item,index) => {
  //               return <td key={index}>
  //                 {item.content === '|' ? '' : (item.render ? item.render(item.content) : item.content)}
  //               </td>
  //             })
  //           }
  //         </tr>
  //         </tbody>
  //       </table>
  //     )
  //   }
  //   return false
  // }

  // tableFooter(dataSource){
  //   if(dataSource.total.length){
  //     return (
  //       <tr className="ant-table-row" style={{background: '#f5f5f5'}}>
  //         {
  //           dataSource.total.map((item,index) => {
  //             return <td key={index}>
  //               {item.content === '|' ? '' : (item.render ? item.render(item.content) : item.content)}
  //             </td>
  //           })
  //         }
  //       </tr>
  //     )
  //   }
  // }

  expandedRowRender = () => {
    const { expandedColumns = [], expandedData = [] } = this.props.tableConfig;
    return <Table showHeader={false} bordered={false} columns={expandedColumns} dataSource={expandedData} pagination={false} />;
  };

  render() {
    const {
      header,
      data,
      loading = false,
      rowSelection,
      className = '',
      popupClassName = '',
      bordered = false,
      showHeader = true,
      // expandedData = [],
      // changeTabalConfigState, // 请求
    } = this.props.tableConfig;
    const dataSource = this.dataSourceBindKeys(data);
    const columns = this.columnsBindRender(header, dataSource.minLenObj);
    // const pagination = this.getPaginationConfig();

    // const BodyWrapper = (props: GlobalState) => (
    //   <tbody {...props}>
    //     <React.Fragment>
    //       {props.children}
    //       {this.tableFooter(dataSource)}
    //     </React.Fragment>
    //   </tbody>
    // );

    return (
      <div className="st-content">
        <div className={`st-table${popupClassName} ${className}`} style={{ width: '100%' }}>
          {
            // this.renderTableTitle()
          }
          <Table
            // components={{ body: { wrapper: BodyWrapper } }}
            bordered={bordered}
            showHeader={showHeader}
            loading={loading}
            dataSource={dataSource.list}
            columns={columns.data}
            rowSelection={rowSelection || null}
            // expandedRowRender={expandedData.length ? () => this.expandedRowRender() : null}
            // pagination={pagination}
            // onChange={(paginations, filters, sorter) => {
            //   if(!_.isEmpty(paginations)){
            //     let params = {
            //       pagination: {
            //         currPage: paginations.current,
            //         pageSize: paginations.pageSize,
            //         totalCount: paginations.total
            //       },
            //       orderType: []
            //     }
            //     changeTabalConfigState(params);
            //   }
            // }}
          />
        </div>
      </div>
    )
  }
}

export default CreateTable
