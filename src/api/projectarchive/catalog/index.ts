import type { CatalogForm, CatalogQuery, CatalogVO } from '@/api/projectarchive/catalog/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询目录管理列表
 * @param query
 * @returns {Promise<any>} 结果列表
 */
export function listCatalogApi(query?: CatalogQuery) {
  return useGet<CatalogVO[]>(`${BASE_API}/projectarchive/catalog/list`, query);
};

/**
 * 查询目录管理详细
 * @param id
 */
export function getCatalogApi(id: string | number) {
  return useGet<CatalogVO>(`${BASE_API}/projectarchive/catalog/${id}`);
};

/**
 * 新增目录管理
 * @param data
 */
export function addCatalogApi(data: CatalogForm) {
  return usePost(`${BASE_API}/projectarchive/catalog`, data);
};

/**
 * 修改目录管理
 * @param data
 */
export function updateCatalogApi(data: CatalogForm) {
  return usePut(`${BASE_API}/projectarchive/catalog`, data);
};

/**
 * 删除目录管理
 * @param id
 */
export function delCatalogApi(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/catalog/${id}`);
};

/**
 * 获取全部一张图目录树
 * @returns {Promise<any>} 树
 */
export function getOneMapCatalogTreeApi(): Promise<any> {
  return useGet(`${BASE_API}/projectarchive/catalogEx/getAllTree`);
}
