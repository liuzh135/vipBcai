import request from '@/utils/request';
import { stringify } from 'qs';
import { BASEWYZK } from './api';

/**
 * 获取积分
 * @param params
 * @returns {Promise<void>}
 * @constructor
 */
export async function integralValue(params) {
  return request(BASEWYZK + `/game/integral/pageList?${stringify(params)}`);
}

//===============================帐号管理==============================================
/**
 * 获取管理员充值卡号
 * @param params
 * @returns {Promise<void>}
 * @constructor
 */
export async function getManagerBank(params) {
  return request(BASEWYZK + `/game/integral/charge/bank?${stringify(params)}`);
}

/**
 * 查询提现帐号
 * @param params
 * @returns {Promise<void>}
 */
export async function queryExchargeList(params) {
  return request(BASEWYZK + `/game/integral/exchange/account/list?${stringify(params)}`);
}

/**
 * 新增提现帐号
 * @param params
 * @returns {Promise<void>}
 */
export async function addExcharge(params) {
  return request(BASEWYZK + `/game/integral/exchange/account/add?${stringify(params)}`);
}

/**
 * 提现申请
 * @param params
 * @returns {Promise<void>}
 */
export async function addExchargeAccount(params) {
  return request(BASEWYZK + `/game/integral/exchange/add?${stringify(params)}`);
}

//===============================充值==============================================

/**
 * 获取充值列表
 * @param params
 * @returns {Promise<void>}
 */
export async function queryRecharList(params) {
  return request(BASEWYZK + `/manager/game/integral/charge/list?${stringify(params)}`);
}

/**
 * 充值申请通过
 * @param params
 * @returns {Promise<void>}
 */
export async function updateRechar(params) {
  return request(BASEWYZK + `/manager/game/integral/charge/reviewFinish?${stringify(params)}`);
}

/**
 * 充值申请驳回
 * @param params
 * @returns {Promise<void>}
 * @constructor
 */
export async function rejectRechar(params) {
  return request(BASEWYZK + `/manager/game/integral/charge/reviewReject?${stringify(params)}`);
}

/**
 * 充值申请
 * @param params
 * @returns {Promise<void>}
 */

export async function fakeSubmitRecharge(params) {
  return request(BASEWYZK + `/game/integral/charge/add?${stringify(params)}`);
}

//===============================提现==============================================
/**
 * 查询提现记录
 * @param params
 * @returns {Promise<void>}
 */
export async function queryExchargeRecord(params) {
  return request(BASEWYZK + `/manager/game/integral/exchange/list?${stringify(params)}`);
}

/**
 * 提现申请通过
 * @param params
 * @returns {Promise<void>}
 */
export async function updateExchar(params) {
  return request(BASEWYZK + `/manager/game/integral/exchange/reviewFinish?${stringify(params)}`);
}

/**
 * 提现申请驳回
 * @param params
 * @returns {Promise<void>}
 */
export async function rejectExchar(params) {
  return request(BASEWYZK + `/manager/game/integral/exchange/reviewReject?${stringify(params)}`);
}
