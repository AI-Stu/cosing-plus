import type { XmxxDataStandardsRelForm, XmxxDataStandardsRelQuery, XmxxDataStandardsRelVO } from '@/api/projectarchive/xmxxDataStandardsRel/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询项目信息数据标准关系列表
 * @param query
 * @returns {*}
 */
export function listXmxxDataStandardsRel(query?: XmxxDataStandardsRelQuery) {
  return useGet<XmxxDataStandardsRelVO[]>(`${BASE_API}/projectarchive/xmxxDataStandardsRel/list`, query);
}

/**
 * 查询项目信息数据标准关系详细
 * @param id
 */
export function getXmxxDataStandardsRel(id: string | number) {
  return useGet<XmxxDataStandardsRelVO>(`${BASE_API}/projectarchive/xmxxDataStandardsRel/${id}`);
}

/**
 * 新增项目信息数据标准关系
 * @param data
 */
export function addXmxxDataStandardsRel(data: XmxxDataStandardsRelForm) {
  return usePost(`${BASE_API}/projectarchive/xmxxDataStandardsRel`, data);
}

/**
 * 修改项目信息数据标准关系
 * @param data
 */
export function updateXmxxDataStandardsRel(data: XmxxDataStandardsRelForm) {
  return usePut(`${BASE_API}/projectarchive/xmxxDataStandardsRel`, data);
}

/**
 * 删除项目信息数据标准关系
 * @param id
 */
export function delXmxxDataStandardsRel(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/xmxxDataStandardsRel/${id}`);
}
