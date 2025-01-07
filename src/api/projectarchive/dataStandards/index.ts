import type { DataStandardsForm, DataStandardsQuery, DataStandardsVO } from '@/api/projectarchive/dataStandards/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询数据标准列表
 * @param query
 * @returns {*}
 */
export function listDataStandards(query?: DataStandardsQuery) {
  return useGet<DataStandardsVO[]>(`${BASE_API}/projectarchive/dataStandards/list`, query);
}

/**
 * 查询数据标准详细
 * @param id
 */
export function getDataStandards(id: string | number) {
  return useGet<DataStandardsVO>(`${BASE_API}/projectarchive/dataStandards/${id}`);
}

/**
 * 新增数据标准
 * @param data
 */
export function addDataStandards(data: DataStandardsForm) {
  return usePost(`${BASE_API}/projectarchive/dataStandards`, data);
}

/**
 * 修改数据标准
 * @param data
 */
export function updateDataStandards(data: DataStandardsForm) {
  return usePut(`${BASE_API}/projectarchive/dataStandards`, data);
}

/**
 * 删除数据标准
 * @param id
 */
export function delDataStandards(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/dataStandards/${id}`);
}
