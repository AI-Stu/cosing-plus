import type { DataStandardsCatalogForm, DataStandardsCatalogQuery, DataStandardsCatalogVO } from '@/api/projectarchive/dataStandardsCatalog/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询数据标准目录列表
 * @param query
 * @returns {Promise<any>} 结果列表
 */
export function listDataStandardsCatalogApi(query?: DataStandardsCatalogQuery) {
  return useGet<DataStandardsCatalogVO[]>(`${BASE_API}/projectarchive/dataStandardsCatalog/list`, query);
};

/**
 * 查询数据标准目录详细
 * @param id
 */
export function getDataStandardsCatalogApi(id: string | number) {
  return useGet<DataStandardsCatalogVO>(`${BASE_API}/projectarchive/dataStandardsCatalog/${id}`);
};

/**
 * 新增数据标准目录
 * @param data
 */
export function addDataStandardsCatalogApi(data: DataStandardsCatalogForm) {
  return usePost(`${BASE_API}/projectarchive/dataStandardsCatalog`, data);
};

/**
 * 修改数据标准目录
 * @param data
 */
export function updateDataStandardsCatalogApi(data: DataStandardsCatalogForm) {
  return usePut(`${BASE_API}/projectarchive/dataStandardsCatalog`, data);
};

/**
 * 删除数据标准目录
 * @param id
 */
export function delDataStandardsCatalogApi(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/dataStandardsCatalog/${id}`);
};

/**
 * 获取全部数据标准目录树
 * @returns {Promise<any>} 树
 */
export function getStandardsCatalogTreeApi(): Promise<any> {
  return useGet(`${BASE_API}/projectarchive/dataStandardsCatalogEx/getAllTree`);
}
