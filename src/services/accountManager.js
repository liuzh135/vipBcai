import request from '@/utils/request';
import { stringify } from 'qs';
import { BASEWYZK } from './api';

//===============================帐号管理==============================================
/**
 * 获取我的用户代理
 * @param params
 * @returns {Promise<void>}
 * @constructor
 */
export async function getMyAgentList(params) {
  return request(BASEWYZK + `/game/user/getMyAgentList?${stringify(params)}`);
}

/**
 * 增加代理或者用户
 * @param params
 * @returns {Promise<void>}
 * @constructor
 */
export async function addProxyOrUser(params) {
  return request(BASEWYZK + `/game/user/addProxyOrUser?${stringify(params)}`);
}

/**
 * 获取我的会员
 * @param params
 * @returns {Promise<void>}
 * @constructor
 */
export async function getMyUserList(params) {
  return request(BASEWYZK + `/game/user/getMyUserList?${stringify(params)}`);
}
