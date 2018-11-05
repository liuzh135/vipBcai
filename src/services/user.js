import request from '@/utils/request';
import { stringify } from 'qs';
import { BASEWYZK } from './api';

export async function query() {
  return request('/api/users');
}

/**
 * 获取用户当前信息
 * @param params
 * @returns {Promise<void>}
 */
export async function queryCurrent(params) {
  // return request('/api/currentUser');
  return request(BASEWYZK + `/game/user/get?${stringify(params)}`);
}
