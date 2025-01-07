import type { DataStandardsCatalogForm, DataStandardsCatalogQuery, DataStandardsCatalogVO } from '@/api/projectarchive/dataStandardsCatalog/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询数据标准目录列表
 * @param query
 * @returns {*}
 */
export function listDataStandardsCatalog(query?: DataStandardsCatalogQuery) {
  return useGet<DataStandardsCatalogVO[]>(`${BASE_API}/projectarchive/dataStandardsCatalog/list`, query);
}

/**
 * 查询数据标准目录详细
 * @param id
 */
export function getDataStandardsCatalog(id: string | number) {
  return useGet<DataStandardsCatalogVO>(`${BASE_API}/projectarchive/dataStandardsCatalog/${id}`);
}

/**
 * 新增数据标准目录
 * @param data
 */
export function addDataStandardsCatalog(data: DataStandardsCatalogForm) {
  return usePost(`${BASE_API}/projectarchive/dataStandardsCatalog`, data);
}

/**
 * 修改数据标准目录
 * @param data
 */
export function updateDataStandardsCatalog(data: DataStandardsCatalogForm) {
  return usePut(`${BASE_API}/projectarchive/dataStandardsCatalog`, data);
}

/**
 * 删除数据标准目录
 * @param id
 */
export function delDataStandardsCatalog(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/dataStandardsCatalog/${id}`);
}
