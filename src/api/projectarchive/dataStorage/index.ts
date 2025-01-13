import type { DataStorageForm, DataStorageQuery, DataStorageVO } from '@/api/projectarchive/dataStorage/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询数据存储管理列表
 * @param query
 * @returns {Promise<any>} 结果列表
 */
export function listDataStorageApi(query?: DataStorageQuery) {
  return useGet<DataStorageVO[]>(`${BASE_API}/projectarchive/dataStorage/list`, query);
};

/**
 * 查询数据存储管理详细
 * @param id
 */
export function getDataStorageApi(id: string | number) {
  return useGet<DataStorageVO>(`${BASE_API}/projectarchive/dataStorage/${id}`);
};

/**
 * 新增数据存储管理
 * @param data
 */
export function addDataStorageApi(data: DataStorageForm) {
  return usePost(`${BASE_API}/projectarchive/dataStorage`, data);
};

/**
 * 修改数据存储管理
 * @param data
 */
export function updateDataStorageApi(data: DataStorageForm) {
  return usePut(`${BASE_API}/projectarchive/dataStorage`, data);
};

/**
 * 删除数据存储管理
 * @param id
 */
export function delDataStorageApi(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/dataStorage/${id}`);
};
