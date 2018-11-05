import { message } from 'antd';
import { getLocalStorage, setLocalStorage } from '@/utils/utils';
import router from 'umi/router';
import { routerRedux } from 'dva/router';

import { fakeSubmitRecharge } from '@/services/charge';

export default {
  namespace: 'rechargesteps',

  state: {
    step: {
      receiverAccount: '',
      managerPayAccountBank: '',
      receiverName: '',
      amount: '',
    },
  },

  effects: {
    *submitAdvancedForm({ payload }, { call }) {
      // yield call(fakeSubmitForm, payload);
      message.success('提交成功');
    },

    *submitRechargeStepForm({ payload }, { call, put }) {
      const response = yield call(fakeSubmitRecharge, payload);
      if (response && response.code === 0) {
        localStorage.removeItem('stepData');
        yield put({
          type: 'saveStepFormData',
          payload,
        });
        yield put(routerRedux.push('/recharge/rechargePage/result'));
      } else {
        message.error(response.msg ? response.msg : '充值失败，请稍后再试！！！');
      }
    },
  },

  reducers: {
    saveStepFormData(state, { payload }) {
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
    getStepData(state, { payload }) {
      setLocalStorage('stepData', payload);
      return {
        ...state,
        step: {
          ...state.step,
          ...payload,
        },
      };
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      const data = getLocalStorage('stepData');
      // console.log('-data->' + JSON.stringify(data));
      if (!data) {
        // router.push('/recharge/rechargePage/info');
      } else {
        dispatch({
          type: 'getStepData',
          payload: data,
        });
      }
    },
  },
};
