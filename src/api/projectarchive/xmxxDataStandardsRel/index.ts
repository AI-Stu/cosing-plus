import type { XmxxDataStandardsRelForm, XmxxDataStandardsRelQuery, XmxxDataStandardsRelVO } from '@/api/projectarchive/xmxxDataStandardsRel/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询项目信息数据标准关系列表
 * @param query
 * @returns {Promise<any>} 结果列表
 */
export function listXmxxDataStandardsRelApi(query?: XmxxDataStandardsRelQuery) {
  return useGet<XmxxDataStandardsRelVO[]>(`${BASE_API}/projectarchive/xmxxDataStandardsRel/list`, query);
};

/**
 * 查询项目信息数据标准关系详细
 * @param id
 */
export function getXmxxDataStandardsRelApi(id: string | number) {
  return useGet<XmxxDataStandardsRelVO>(`${BASE_API}/projectarchive/xmxxDataStandardsRel/${id}`);
};

/**
 * 新增项目信息数据标准关系
 * @param data
 */
export function addXmxxDataStandardsRelApi(data: XmxxDataStandardsRelForm) {
  return usePost(`${BASE_API}/projectarchive/xmxxDataStandardsRel`, data);
};

/**
 * 修改项目信息数据标准关系
 * @param data
 */
export function updateXmxxDataStandardsRelApi(data: XmxxDataStandardsRelForm) {
  return usePut(`${BASE_API}/projectarchive/xmxxDataStandardsRel`, data);
};

/**
 * 删除项目信息数据标准关系
 * @param id
 */
export function delXmxxDataStandardsRelApi(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/xmxxDataStandardsRel/${id}`);
};

/**
 * 批量保存项目数据标准关系
 * @param xmxxid
 */
export function saveXmxxDataStandardsListApi(xmxxid: string | number, data: XmxxDataStandardsRelVO[]) {
  return usePost(`${BASE_API}/projectarchive/xmxxEx/saveXmxxDataStandardsList/${xmxxid}`, data);
};
