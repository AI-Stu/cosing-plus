const BASE_API = import.meta.env.VITE_APP_BASE_API;

interface CrudTableModel {
  id?: number
  /**
   * 名称
   */
  name: string
  /**
   * 值
   */
  value: string
  /**
   * 描述
   */
  remark?: string
}

type CrudTableParams = Partial<Omit<CrudTableModel, 'id'>>

export async function getListApi(params?: CrudTableParams) {
  return usePost<CrudTableModel[]>(`${BASE_API}/list/crud-table`, params);
}

export async function deleteApi(id: string | number) {
  return useDelete(`${BASE_API}/list/${id}`);
}

export type{
  CrudTableParams,
  CrudTableModel
};
