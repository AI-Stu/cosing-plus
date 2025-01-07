import type { CatalogForm, CatalogQuery, CatalogVO } from '@/api/projectarchive/catalog/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询目录管理列表
 * @param query
 * @returns {*}
 */
export function listCatalog(query?: CatalogQuery) {
  return useGet<CatalogVO[]>(`${BASE_API}/projectarchive/catalog/list`, query);
}

/**
 * 查询目录管理详细
 * @param id
 */
export function getCatalog(id: string | number) {
  return useGet<CatalogVO>(`${BASE_API}/projectarchive/catalog/${id}`);
}

/**
 * 新增目录管理
 * @param data
 */
export function addCatalog(data: CatalogForm) {
  return usePost(`${BASE_API}/projectarchive/catalog`, data);
}

/**
 * 修改目录管理
 * @param data
 */
export function updateCatalog(data: CatalogForm) {
  return usePut(`${BASE_API}/projectarchive/catalog`, data);
}

/**
 * 删除目录管理
 * @param id
 */
export function delCatalog(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/catalog/${id}`);
}
