import React from 'react';

export const getFormData = (that: any) => {
  const { test } = that.props;
  return {
    config: [
      {
        id: 'userName',
        type: 'input',
        options: {
          name: '账号',
          value: '123',
          placeholder: '请输入账号',
        },
      },
      {
        id: 'roleId',
        type: 'select',
        options: {
          name: '账号类型',
          value: '|',
          placeholder: '请选择账号类型',
          list: test.firstPage.roleList,
        },
      },
      {
        id: 'submit',
        type: 'button',
        options: {
          name: '查询',
          type: 'primary',
        },
      },
      {
        id: 'reset',
        type: 'button',
        options: {
          name: '重置',
        },
      },
    ],
  }
};

export const getTableData = (that: any) => {
  const { test } = that.props;
  return {
    data: test.firstPage.list,
    config: {
      showHeader: true,
    },
    tableTitle: () => (<p>123123</p>),
    header: [
      {
        title: '用户名',
        dataIndex: 'userName',
        render: (data) => data,
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '创建人',
        dataIndex: 'createUserName',
      },
      {
        title: '数量',
        dataIndex: 'amount',
        summary: true,
      },
    ],
  }
};
