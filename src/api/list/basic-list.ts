const BASE_API = import.meta.env.VITE_APP_BASE_API;

export interface ListResultModel {
  id: number
  title: string
  username: string
  password: string
}

export type ListResultParams = Partial<Omit<ListResultModel, 'id' | 'password'>>

export async function getListApi(params?: ListResultParams) {
  return usePost<ListResultModel[]>(`${BASE_API}/list/basic-list`, params);
}
