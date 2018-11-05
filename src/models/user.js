import { query as queryUsers, queryCurrent } from '@/services/user';
import {
  integralValue,
  getManagerBank,
  queryExchargeList,
  addExcharge,
  addExchargeAccount,
} from '@/services/charge';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    bank: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchbank({ payload }, { call, put }) {
      const response = yield call(getManagerBank, payload);
      yield put({
        type: 'saveBank',
        payload: response,
      });
    },
    *fetchIntegral({ payload }, { call, put }) {
      const response = yield call(integralValue, payload);
      // console.log('-----response--->' + JSON.stringify(response));
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
    },
    *fetchCurrent({ payload }, { call, put }) {
      const response = yield call(queryCurrent, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchexchargeList({ payload }, { call, put }) {
      const response = yield call(queryExchargeList, payload);
      yield put({
        type: 'saveExchargeList',
        payload: response,
      });
    },
    *addexchargeAccount({ payload, callback }, { call, put }) {
      const response = yield call(addExcharge, payload);

      if (callback) callback(response);
    },
    *addExcharge({ payload, callback }, { call, put }) {
      const response = yield call(addExchargeAccount, payload);

      if (callback) callback(response);
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveBank(state, action) {
      return {
        ...state,
        bank: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload.data || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      };
    },
    saveExchargeList(state, action) {
      return {
        ...state,
        exchargeList: action.payload.data || {},
      };
    },
  },
};
