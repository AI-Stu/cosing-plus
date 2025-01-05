import type { DataStorageForm, DataStorageQuery, DataStorageVO } from '@/api/projectarchive/dataStorage/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询数据存储管理列表
 * @param query
 */
export function listDataStorage(query?: DataStorageQuery) {
  return useGet<DataStorageVO[]>(`${BASE_API}/projectarchive/dataStorage/list`, query);
}

/**
 * 查询数据存储管理详细
 * @param id
 */
export function getDataStorage(id: string | number) {
  return useGet<DataStorageVO>(`${BASE_API}/projectarchive/dataStorage/${id}`);
}

/**
 * 新增数据存储管理
 * @param data
 */
export function addDataStorage(data: DataStorageForm) {
  return usePost(`${BASE_API}/projectarchive/dataStorage`, data);
}

/**
 * 修改数据存储管理
 * @param data
 */
export function updateDataStorage(data: DataStorageForm) {
  return usePut(`${BASE_API}/projectarchive/dataStorage`, data);
}

/**
 * 删除数据存储管理
 * @param id
 */
export function delDataStorage(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/dataStorage/${id}`);
}
