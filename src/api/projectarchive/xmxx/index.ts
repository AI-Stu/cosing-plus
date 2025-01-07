import type { XmxxForm, XmxxQuery, XmxxVO } from '@/api/projectarchive/xmxx/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询项目信息列表
 * @param query
 * @returns {*}
 */
export function listXmxx(query?: XmxxQuery) {
  return useGet<XmxxVO[]>(`${BASE_API}/projectarchive/xmxx/list`, query);
}

/**
 * 查询项目信息详细
 * @param xmxxid
 */
export function getXmxx(xmxxid: string | number) {
  return useGet<XmxxVO>(`${BASE_API}/projectarchive/xmxx/${xmxxid}`);
}

/**
 * 新增项目信息
 * @param data
 */
export function addXmxx(data: XmxxForm) {
  return usePost(`${BASE_API}/projectarchive/xmxx`, data);
}

/**
 * 修改项目信息
 * @param data
 */
export function updateXmxx(data: XmxxForm) {
  return usePut(`${BASE_API}/projectarchive/xmxx`, data);
}

/**
 * 删除项目信息
 * @param xmxxid
 */
export function delXmxx(xmxxid: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/xmxx/${xmxxid}`);
}
