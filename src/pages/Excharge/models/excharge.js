import { queryExchargeRecord, rejectExchar, updateExchar } from '@/services/charge';
import { message } from 'antd';
import router from 'umi/router';

export default {
  namespace: 'excharge',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    //查询提现记录列表
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryExchargeRecord, payload);
      if (response && response.code === 0) {
        yield put({
          type: 'save',
          payload: response,
        });
      } else {
        message.error(response.msg ? response.msg : '获取失败');
      }
    },
    * update({ payload, callback }, { call, put }) {
      const response = yield call(updateExchar, payload);
      //成功之后 本地修改数据 不要去服务器拉去
      if (response && response.code === 0) {
        yield put({
          type: 'updateSuccee',
          payload: { response, ...payload },
        });
      }

      if (callback) callback(response);
    },
    * reject({ payload, callback }, { call, put }) {
      const response = yield call(rejectExchar, payload);
      //成功之后 本地修改数据 不要去服务器拉去
      if (response && response.code === 0) {
        yield put({
          type: 'updateSuccee',
          payload: { response, ...payload },
        });
      }

      if (callback) callback(response);
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
    updateSuccee(state, action) {
      const list = state.data.list;
      list.map(item => {
        if (item.exchangeId === action.payload.exchangeId) {
          item.exchangeStatus = action.payload.exchangeStatus;
          return item;
        }
      });
      return {
        ...state,
        data: {
          list: list,
        },
      };
    },
  },
};
