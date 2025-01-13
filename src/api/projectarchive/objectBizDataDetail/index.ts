import type { ObjectBizDataDetailForm, ObjectBizDataDetailQuery, ObjectBizDataDetailVO } from '@/api/projectarchive/objectBizDataDetail/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询文件存储信息列表
 * @param query
 * @returns {Promise<any>} 结果列表
 */
export function listObjectBizDataDetailApi(query?: ObjectBizDataDetailQuery) {
  return useGet<ObjectBizDataDetailVO[]>(`${BASE_API}/projectarchive/objectBizDataDetail/list`, query);
};

/**
 * 查询文件存储信息详细
 * @param id
 */
export function getObjectBizDataDetailApi(id: string | number) {
  return useGet<ObjectBizDataDetailVO>(`${BASE_API}/projectarchive/objectBizDataDetail/${id}`);
};

/**
 * 新增文件存储信息
 * @param data
 */
export function addObjectBizDataDetailApi(data: ObjectBizDataDetailForm) {
  return usePost(`${BASE_API}/projectarchive/objectBizDataDetail`, data);
};

/**
 * 修改文件存储信息
 * @param data
 */
export function updateObjectBizDataDetailApi(data: ObjectBizDataDetailForm) {
  return usePut(`${BASE_API}/projectarchive/objectBizDataDetail`, data);
};

/**
 * 删除文件存储信息
 * @param id
 */
export function delObjectBizDataDetailApi(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/objectBizDataDetail/${id}`);
};
