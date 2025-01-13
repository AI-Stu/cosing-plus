import type { ObjectUploadRecordForm, ObjectUploadRecordQuery, ObjectUploadRecordVO } from '@/api/projectarchive/objectUploadRecord/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;
/**
 * 查询文件上传记录列表
 * @param query
 * @returns {Promise<any>} 结果列表
 */
export function listObjectUploadRecordApi(query?: ObjectUploadRecordQuery) {
  return useGet<ObjectUploadRecordVO[]>(`${BASE_API}/projectarchive/objectUploadRecord/list`, query);
};

/**
 * 查询文件上传记录详细
 * @param id
 */
export function getObjectUploadRecordApi(id: string | number) {
  return useGet<ObjectUploadRecordVO>(`${BASE_API}/projectarchive/objectUploadRecord/${id}`);
};

/**
 * 新增文件上传记录
 * @param data
 */
export function addObjectUploadRecordApi(data: ObjectUploadRecordForm) {
  return usePost(`${BASE_API}/projectarchive/objectUploadRecord`, data);
};

/**
 * 修改文件上传记录
 * @param data
 */
export function updateObjectUploadRecordApi(data: ObjectUploadRecordForm) {
  return usePut(`${BASE_API}/projectarchive/objectUploadRecord`, data);
};

/**
 * 删除文件上传记录
 * @param id
 */
export function delObjectUploadRecordApi(id: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/projectarchive/objectUploadRecord/${id}`);
};
