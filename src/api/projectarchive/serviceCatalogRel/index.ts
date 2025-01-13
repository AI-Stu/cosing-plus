import type { ServiceCatalogRelForm, ServiceCatalogRelQuery, ServiceCatalogRelVO } from '@/api/projectarchive/serviceCatalogRel/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询服务目录关系列表
 * @param query
 * @returns {Promise<any>} 结果列表
 */
export function listServiceCatalogRelApi(query?: ServiceCatalogRelQuery) {
  return useGet<ServiceCatalogRelVO[]>(`${BASE_API}/projectarchive/serviceCatalogRel/list`, query);
};

/**
 * 查询服务目录关系详细
 * @param id
 */
export function getServiceCatalogRelApi(id: string | number) {
  return useGet<ServiceCatalogRelVO>(`${BASE_API}/projectarchive/serviceCatalogRel/${id}`);
};

/**
 * 新增服务目录关系
 * @param data
 */
export function addServiceCatalogRelApi(data: ServiceCatalogRelForm) {
  return usePost(`${BASE_API}/projectarchive/serviceCatalogRel`, data);
};

/**
 * 修改服务目录关系
 * @param data
 */
export function updateServiceCatalogRelApi(data: ServiceCatalogRelForm) {
  return usePut(`${BASE_API}/projectarchive/serviceCatalogRel`, data);
};

/**
 * 删除服务目录关系
 * @param id
 */
export function delServiceCatalogRelApi(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/serviceCatalogRel/${id}`);
};
