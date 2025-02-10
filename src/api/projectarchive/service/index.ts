import type { ServiceForm, ServiceQuery, ServiceVO } from '@/api/projectarchive/service/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询服务管理列表
 * @param query
 * @returns {Promise<any>} 结果列表
 */
export function listServiceApi(query?: ServiceQuery) {
  return useGet<ServiceVO[]>(`${BASE_API}/projectarchive/service/list`, query);
};

/**
 * 查询服务管理详细
 * @param id
 */
export function getServiceApi(id: string | number) {
  return useGet<ServiceVO>(`${BASE_API}/projectarchive/service/${id}`);
};

/**
 * 新增服务管理
 * @param data
 */
export function addServiceApi(data: ServiceForm) {
  return usePost(`${BASE_API}/projectarchive/service`, data);
};

/**
 * 修改服务管理
 * @param data
 */
export function updateServiceApi(data: ServiceForm) {
  return usePut(`${BASE_API}/projectarchive/service`, data);
};

/**
 * 删除服务管理
 * @param id
 */
export function delServiceApi(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/service/${id}`);
}

/**
 * 一张图目录查模块-询服务列表
 * @param query
 * @returns {*} 结果列表
 */
export function getServiceListApi(query?: ServiceQuery) {
  return usePost<ServiceVO[]>(`${BASE_API}/projectarchive/serviceEx/getServiceList`, query);
}

/**
 * 批量保存项目数据标准关系
 * @param param
 * @returns {Promise<any>} 结果列表
 */
export function saveServiceCatalogRelApi(param?: any) {
  return usePost(`${BASE_API}/projectarchive/serviceEx/saveServiceCatalogRel`, param);
}
