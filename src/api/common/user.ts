const BASE_API = import.meta.env.VITE_APP_BASE_API;
export interface UserInfo {
  id: number | string
  username: string
  nickname: string
  avatar: string
  roles?: (string | number)[]
}

export function getUserInfoApi() {
  return useGet<UserInfo>(`${BASE_API}/user/info`);
}
