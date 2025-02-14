const BASE_API = import.meta.env.VITE_APP_BASE_API;
export interface ListResultModel {
  id: number
  title: string
  username: string
  password: string
}

export type ListResultParams = Partial<Omit<ListResultModel, 'id' | 'password'>>

export async function getListApi(params?: ListResultParams) {
  return usePost<ListResultModel[]>(`${BASE_API}/list`, params);
}

export type CreateListParams = Partial<Omit<ListResultModel, 'id'>>

export async function createListApi(params: CreateListParams) {
  return usePost(`${BASE_API}/list/create`, params);
}

export async function editListApi(params: ListResultModel) {
  return usePut(`${BASE_API}/list`, params);
}

export async function delListApi(id: string | number) {
  return useDelete(`${BASE_API}/list/${id}`);
}
