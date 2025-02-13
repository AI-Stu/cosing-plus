import type { DictTypeForm, DictTypeQuery, DictTypeVO } from './types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;

// 查询字典类型列表
export function listTypeApi(query: DictTypeQuery) {
  return useGet<DictTypeVO[]>(`${BASE_API}/system/dict/type/list`, query);
}

// 查询字典类型详细
export function getTypeApi(dictId: number | string) {
  return useGet<DictTypeVO>(`${BASE_API}/system/dict/type/${dictId}`);
}

// 获取字典选择框列表
export function optionSelectApi() {
  return useGet<DictTypeVO[]>(`${BASE_API}/system/dict/type/optionselect`);
}

// 新增字典类型
export function addTypeApi(data: DictTypeForm) {
  return usePost(`${BASE_API}/system/dict/type`, data);
}

// 修改字典类型
export function updateTypeApi(data: DictTypeForm) {
  return usePut(`${BASE_API}/system/dict/type`, data);
}

// 删除字典类型
export function delTypeApi(dictId: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/system/dict/type/${dictId}`);
}

// 刷新字典缓存
export function refreshCacheApi() {
  return useDelete(`${BASE_API}/system/dict/type/refreshCache`);
}

export type { DictTypeForm, DictTypeQuery, DictTypeVO };
