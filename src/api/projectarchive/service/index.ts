import type { ServiceForm, ServiceQuery, ServiceVO } from '@/api/projectarchive/service/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询服务管理列表
 * @param query
 * @returns {*}
 */
export function listService(query?: ServiceQuery) {
  return useGet<ServiceVO[]>(`${BASE_API}/projectarchive/service/list`, query);
}

/**
 * 查询服务管理详细
 * @param id
 */
export function getService(id: string | number) {
  return useGet<ServiceVO>(`${BASE_API}/projectarchive/service/${id}`);
}

/**
 * 新增服务管理
 * @param data
 */
export function addService(data: ServiceForm) {
  return usePost(`${BASE_API}/projectarchive/service`, data);
}

/**
 * 修改服务管理
 * @param data
 */
export function updateService(data: ServiceForm) {
  return usePut(`${BASE_API}/projectarchive/service`, data);
}

/**
 * 删除服务管理
 * @param id
 */
export function delService(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/service/${id}`);
}
