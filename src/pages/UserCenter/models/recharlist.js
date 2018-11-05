import {
  queryRecharList,
  removeRechar,
  addRechar,
  updateRechar,
  rejectRechar,
} from '@/services/charge';

export default {
  namespace: 'recharlist',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRecharList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRechar, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRechar, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRechar, payload);
      //成功之后 本地修改数据 不要去服务器拉去
      if (response && response.code === 0) {
        yield put({
          type: 'updateSuccee',
          payload: { response, ...payload },
        });
      }

      if (callback) callback(response);
    },
    *reject({ payload, callback }, { call, put }) {
      const response = yield call(rejectRechar, payload);
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
        if (item.chargeId === action.payload.chargeId) {
          item.chargeStatus = action.payload.chargeStatus;
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
