import { Request, Response } from 'express';

const getConfig = (req: Request, res: Response) => {
  res.json([
    {
      id: '000000001',
      label: '足球',
      value: '001',
    },
    {
      id: '000000002',
      label: '篮球',
      value: '002',
    },
    {
      id: '000000003',
      label: '排球',
      value: '003',
    },
    {
      id: '000000004',
      label: '网球',
      value: '004',
    },
  ]);
};

const getList = (req: Request, res: Response) => {
  res.json([
    {
      id: 1,
      userName: '张三',
      name: 'elie',
      createUserName: '2019-09-20',
      amount: 10,
    },
    {
      id: 2,
      userName: '里斯',
      name: 'lis',
      createUserName: '2019-09-20',
      amount: 10,
    },
    {
      id: 3,
      userName: '艾伦',
      name: 'alen',
      createUserName: '2019-09-20',
      amount: 10,
    },
  ]);
};
export default {
  'POST /api/config': getConfig,
  'POST /api/list': getList,
};
