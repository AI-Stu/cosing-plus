import type { ServiceDataStorageRelForm, ServiceDataStorageRelQuery, ServiceDataStorageRelVO } from '@/api/projectarchive/serviceDataStorageRel/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询服务数据存储关系列表
 * @param query
 * @returns {Promise<any>} 结果列表
 */
export function listServiceDataStorageRelApi(query?: ServiceDataStorageRelQuery) {
  return useGet<ServiceDataStorageRelVO[]>(`${BASE_API}/projectarchive/serviceDataStorageRel/list`, query);
};

/**
 * 查询服务数据存储关系详细
 * @param id
 */
export function getServiceDataStorageRelApi(id: string | number) {
  return useGet<ServiceDataStorageRelVO>(`${BASE_API}/projectarchive/serviceDataStorageRel/${id}`);
};

/**
 * 新增服务数据存储关系
 * @param data
 */
export function addServiceDataStorageRelApi(data: ServiceDataStorageRelForm) {
  return usePost(`${BASE_API}/projectarchive/serviceDataStorageRel`, data);
};

/**
 * 修改服务数据存储关系
 * @param data
 */
export function updateServiceDataStorageRelApi(data: ServiceDataStorageRelForm) {
  return usePut(`${BASE_API}/projectarchive/serviceDataStorageRel`, data);
};

/**
 * 删除服务数据存储关系
 * @param id
 */
export function delServiceDataStorageRelApi(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/serviceDataStorageRel/${id}`);
};
