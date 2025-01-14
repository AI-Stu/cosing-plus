/**
 * @description: 异常相关枚举
 */
export const ExceptionEnum = {
  PAGE_NOT_ACCESS: 403,
  PAGE_NOT_FOUND: 404,
  ERROR: 500,
  NET_WORK_ERROR: 10000,
  // 页面上没有数据。其实并不是异常页面
  PAGE_NOT_DATA: 10100
};

export const ErrorTypeEnum = {
  VUE: 'vue',
  SCRIPT: 'script',
  RESOURCE: 'resource',
  AJAX: 'ajax',
  PROMISE: 'promise'
};
