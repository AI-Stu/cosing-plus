import type { AxiosPromise } from 'axios';
import type { DictTypeForm, DictTypeQuery, DictTypeVO } from './types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;

// 查询字典类型列表
export function listType(query: DictTypeQuery): AxiosPromise<DictTypeVO[]> {
  return useGet<DictTypeVO[]>(`${BASE_API}/system/dict/type/list`, query) as AxiosPromise<DictTypeVO[]>;
}

// 查询字典类型详细
export function getType(dictId: number | string): AxiosPromise<DictTypeVO> {
  return useGet<DictTypeVO>(`${BASE_API}/system/dict/type/${dictId}`) as AxiosPromise<DictTypeVO>;
}

// 获取字典选择框列表
export function optionselect(): AxiosPromise<DictTypeVO[]> {
  return useGet<DictTypeVO[]>(`${BASE_API}/system/dict/type/optionselect`) as AxiosPromise<DictTypeVO[]>;
}

// 新增字典类型
export function addType(data: DictTypeForm) {
  return usePost(`${BASE_API}/system/dict/type`, data);
}

// 修改字典类型
export function updateType(data: DictTypeForm) {
  return usePut(`${BASE_API}/system/dict/type`, data);
}

// 删除字典类型
export function delType(dictId: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/system/dict/type/${dictId}`);
}

// 刷新字典缓存
export function refreshCache() {
  return useDelete(`${BASE_API}/system/dict/type/refreshCache`);
}
