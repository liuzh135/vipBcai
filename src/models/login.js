import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getLocalStorage, getPageQuery, setLocalStorage } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

/**
 * 登录 model
 *
 * Authorized 处理用户权限和数据权限
 */
export default {
  namespace: 'login',

  state: {
    status: undefined,
    token: null,
    userToken: '',
  },

  effects: {
    * login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      //重组数据
      response.status = response.code === 0 ? 'ok' : 'error';
      response.type = payload.type;
      // response.currentAuthority = response.status === 'ok' ? 'admin' : 'error';
      //帐号权限管理
      if (response && response.data) {
        if (response.data.isAgent) {
          response.currentAuthority = 'agent';
          console.log('account is agent');
        }
        if (response.data.isAdmin) {
          response.currentAuthority = 'admin';
          console.log('account is admin');
        }
      }
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });

      // Login successfully
      if (response.status === 'ok') {
        setLocalStorage('loginData', response);
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    * getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    * logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      console.log('*****logout*****');
      localStorage.removeItem('loginData');
      reloadAuthorized();
      let uri = window.location.href;
      if (uri && uri.indexOf('redirect') === -1) {
        uri = {
          search: stringify({
            redirect: window.location.href,
          }),
        };
      } else {
        uri = {};
      }
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          ...uri,
        }),
      );
    },
  },

  reducers: {
    getToken(state, { payload }) {
      setAuthority(payload.currentAuthority);
      reloadAuthorized();
      return {
        ...state,
        userToken: payload.data,
      };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        message: payload.msg,
        userToken: payload.data,
      };
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      const data = getLocalStorage('loginData');
      // console.log("-subscriptions -- login-data-->" + JSON.stringify(data));
      if (!data) {
        let uri = window.location.href;
        if (uri.indexOf('/user/login') === -1) {
          window.g_app._store.dispatch({ type: 'login/logout' });
        }
      } else {
        dispatch({
          type: 'getToken',
          payload: data,
        });
      }
    },
  },
};
