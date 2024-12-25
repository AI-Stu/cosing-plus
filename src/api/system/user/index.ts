import type { UserInfo } from './types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;

/** 获取用户详细信息 */
export function getUserInfoApi() {
  return useGet<UserInfo>(`${BASE_API}/system/user/getInfo`);
}

/**
 * 用户头像上传
 * @param data 头像文件
 */
export function uploadAvatar(data: FormData) {
  return usePost(
    `${BASE_API}/system/user/profile/avatar`,
    data
  );
}

export type { UserInfo };
