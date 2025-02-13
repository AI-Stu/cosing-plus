import type { LoginAccountParams, LoginMobileParams, LoginResultModel, TenantInfo, VerifyCodeResult } from './types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;

/**
 * 登录
 * @param { LoginAccountParams | LoginMobileParams } params
 * @returns Promise
 */
export function loginApi(params: LoginAccountParams | LoginMobileParams) {
  return usePost<LoginResultModel, LoginAccountParams | LoginMobileParams>(
    `${BASE_API}/auth/login`,
    params,
    {
      // 设置为false的时候不会携带token
      token: false,
      // 是否需要防止数据重复提交
      repeatSubmit: false,
      // 是否开启全局请求loading
      loading: true
    }
  );
}

/** 退出登录 */
export function logoutApi() {
  return usePost(`${BASE_API}/auth/logout`);
}

/**
 * 获取验证码
 */
export function getCodeImgApi() {
  return useGet<VerifyCodeResult>(
    `${BASE_API}/auth/code`,
    null,
    {
      token: false,
      repeatSubmit: false
    }
  );
}

// 获取租户列表
export function getTenantListApi() {
  return useGet<TenantInfo>(
    `${BASE_API}/auth/tenant/list`,
    null,
    {
      token: false
    }
  );
}

export type { LoginAccountParams, LoginMobileParams, LoginResultModel, TenantInfo, VerifyCodeResult };
