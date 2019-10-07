import request from '@/utils/request';
import { GlobalState } from '@/models/connect';
import Api from '@/services/api';

const actions:GlobalState = {};

Object.keys(Api).forEach(requestName => {
  actions[requestName] = async (params: GlobalState):Promise<any> => request(Api[requestName], {
      method: 'POST',
      data: params,
    })
});

export default actions;
