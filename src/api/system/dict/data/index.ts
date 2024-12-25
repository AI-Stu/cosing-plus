import type { AxiosPromise } from 'axios';
import type { DictDataForm, DictDataQuery, DictDataVO } from './types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;

// 根据字典类型查询字典数据信息
export function getDicts(dictType: string): AxiosPromise<DictDataVO[]> {
  return useGet<DictDataVO[]>(`${BASE_API}/system/dict/data/type/${dictType}`) as AxiosPromise<DictDataVO[]>;
}

// 查询字典数据列表
export function listData(query: DictDataQuery): AxiosPromise<DictDataVO[]> {
  return useGet<DictDataVO[]>(`${BASE_API}/system/dict/data/list`, query) as AxiosPromise<DictDataVO[]>;
}

// 查询字典数据详细
export function getData(dictCode: string | number): AxiosPromise<DictDataVO> {
  return useGet<DictDataVO>(`${BASE_API}/system/dict/data/${dictCode}`) as AxiosPromise<DictDataVO>;
}

// 新增字典数据
export function addData(data: DictDataForm) {
  return usePost(`${BASE_API}/system/dict/data`, data);
}

// 修改字典数据
export function updateData(data: DictDataForm) {
  return usePut(`${BASE_API}/system/dict/data`, data);
}

// 删除字典数据
export function delData(dictCode: string | number | Array<string | number>) {
  return useDelete(`${BASE_API}/system/dict/data/${dictCode}`);
}
