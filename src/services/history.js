import request from '@/utils/request';
import { stringify } from 'qs';
import { BASEWYZK } from './api';

/**
 * 我的充值记录
 * @param params
 * @returns {Promise<void>}
 * @constructor
 */
export async function chargeHistory(params) {
  return request(BASEWYZK + `/game/integral/charge/history?${stringify(params)}`);
}
