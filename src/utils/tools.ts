import { get } from 'lodash-es';
import router from '@/router';

export function getQueryParam(param: string | string[], defaultVal = '') {
  const query = router.currentRoute.value?.query ?? {};
  const val = get(query, param) ?? defaultVal;
  return decodeURIComponent(val);
}

/**
 * 添加日期范围
 * @param params
 * @param dateRange
 * @param propName
 */
export function addDateRange(params: any, dateRange: any[], propName?: string) {
  const search = params;
  search.params = typeof search.params === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
  dateRange = Array.isArray(dateRange) ? dateRange : [];

  if (typeof propName === 'undefined') {
    search.params.beginTime = dateRange[0];
    search.params.endTime = dateRange[1];
  }
  else {
    search.params[`begin${propName}`] = dateRange[0];
    search.params[`end${propName}`] = dateRange[1];
  }
  return search;
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params: any) {
  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    const part = `${encodeURIComponent(propName)}=`;
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            const params = `${propName}[${key}]`;
            const subPart = `${encodeURIComponent(params)}=`;
            result += `${subPart + encodeURIComponent(value[key])}&`;
          }
        }
      }
      else {
        result += `${part + encodeURIComponent(value)}&`;
      }
    }
  }
  return result;
}

export type FileSizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB';
export type FileSizeUnits = Record<FileSizeUnit, number>;

/**
 * 文件大小格式化
 * @param {number} sizeInBytes
 */
export function formatFileSize(sizeInBytes = 0) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let size = sizeInBytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
}

/**
 * 统一转成 MB
 */
export function convertToMB(fileSizeStr: string): number {
  const units: FileSizeUnits = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 ** 2,
    'GB': 1024 ** 3,
    'TB': 1024 ** 4,
    'PB': 1024 ** 5
  };
  const regex = /^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB|TB|PB)$/;
  const match = fileSizeStr.match(regex);

  if (match) {
    const size = match[1] ? Number.parseFloat(match[1]) : 0;
    const unit = match[2] as FileSizeUnit; ;
    const sizeInBytes = size * (units[unit] || 0);
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return Math.round(sizeInMB * 100) / 100;
  }
  else {
    throw new Error('Invalid file size format');
  }
}
