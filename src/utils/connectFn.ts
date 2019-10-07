import { connect } from 'dva';
import actions from '@/services/actions';
import { ConnectState, GlobalState } from '@/models/connect';
import { types } from '@/utils/utils';

/**
 * connectFn 方法
 * @param paramDisptch
 * @param paramState
 */
const connectFn = (paramState?: any[], paramDisptch?: any[]) => {
  const actionObj: GlobalState = {};
  if (paramDisptch) {
    paramDisptch.map((item: string) => {
      if (actions.hasOwnProperty(item)) {
        actionObj[item] = actions[item];
      }
      return item;
    });
  }
  return connect(
    (state: ConnectState) => {
      if (paramState && types(paramState) === 'array') {
        const newState: GlobalState = {};
        // 当参数中包含关键字all时，返回整个state
        if (paramState.some(stateItem => types(stateItem) === 'string' && stateItem === 'all')) {
          return state;
        }
        // 遍历参数，返回新的state
        paramState.map(stateItem => {
          if (types(stateItem) === 'string') {
            newState[stateItem] = state[stateItem]
          }
          if (types(stateItem) === 'object') {
            Object.keys(stateItem).map(key => {
              if (state.hasOwnProperty(key) && types(stateItem[key]) === 'array') {
                const stateItemChild: [] = stateItem[key];
                stateItemChild.map((keys: string) => {
                  newState[keys] = state[key][keys];
                  return keys;
                })
              }
              return key;
            })
          }
          return stateItem;
        });
        return newState;
      }
      // 当没有参数时，返回空对象，防止redux更新影响页面更新
      return {};
    },
    (dispatch: () => void) => ({ dispatch, ...actionObj }),
  )
};

export default connectFn
