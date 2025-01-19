import type { FileChunkFrom, FileUploadForm } from '@/api/projectarchive/fileUpload/types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;

/**
 * 初始化分片上传
 * @param {FileUploadForm} data
 */
export function initFileApi(data: FileUploadForm) {
  return usePost(`${BASE_API}/projectarchive/filemanage/upload/chunk/init`, data);
};

/**
 * 上传文件
 * @param {FileUploadForm} data
 */
export function uploadFileApi(data: FileChunkFrom) {
  return usePost(`${BASE_API}/projectarchive/filemanage/upload`, data);
};

/**
 * 合并块文件
 * @param {string | number} id 文件ID
 */
export function completedFileApi(id: string | number) {
  return usePost(`${BASE_API}/projectarchive/filemanage/upload/chunk/${id}/completed`);
};
