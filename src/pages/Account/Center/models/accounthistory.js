import { chargeHistory, exchargeHistory } from '@/services/history';

import { queryExchargeList, addExcharge, deleteCard } from '@/services/charge';

export default {
  namespace: 'accounthistory',

  state: {
    data: {
      list: [],
      pagination: {},
      datas: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      //获取充值记录
      const response = yield call(chargeHistory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchExcharge({ payload }, { call, put }) {
      //获取提现记录
      const response = yield call(exchargeHistory, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCardList({ payload }, { call, put }) {
      //获取提现卡号
      const response = yield call(queryExchargeList, payload);
      yield put({
        type: 'cards',
        payload: response,
      });
    },
    *deleteCard({ payload, callback }, { call, put }) {
      //删除提现卡号
      const response = yield call(deleteCard, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          list: action.payload.data.rows,
          pagination: {
            total: action.payload.data.records,
            current: parseInt(action.payload.data.page, 10) || 1,
          },
        },
      };
    },
    cards(state, action) {
      return {
        ...state,
        data: {
          datas: action.payload.data,
        },
      };
    },
  },
};
