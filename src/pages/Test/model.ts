import { Effect } from 'dva';
import { Reducer } from 'redux';
import actions from '@/services/actions';

export interface UserModelState {
  firstPage?: {
    roleList?: any[];
    list?: any[];
  }
}

export interface UserModelType {
  namespace: 'test';
  state: UserModelState;
  effects: {
    fetchData: Effect;
    fetchList: Effect;
  };
  reducers: {
    save: Reducer<UserModelState>;
  };
  subscriptions?: any;
}

const UserModel: UserModelType = {
  namespace: 'test',

  state: {
    firstPage: {
      roleList: [],
      list: [],
    },
  },

  effects: {
    *fetchData(_, { call, put }) {
      const response = yield call(actions.getList, {});
      yield put({ key: 'firstPage/data', type: 'save', payload: response });
    },
    *fetchList(_, { call, put }) {
      const response = yield call(actions.getConfig);
      yield put({ key: 'firstPage/list', type: 'save', payload: response });
    },
  },

  reducers: {
    save(state: any, action) {
      const actionKeys = action.key.split('/');
      const [modelName] = actionKeys;
      let result = {};
      switch (action.key) {
        case 'firstPage/list':
          result = { roleList: action.payload || [] };
          break;
        case 'firstPage/data':
          result = { list: action.payload || [] };
          break;
        default: break;
      }
      return {
        ...state,
        [modelName]: {
          ...state[modelName],
          ...result,
        },
      };
    },
  },
};

export default UserModel;
