const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;

// 获取目录树
export function getCatalogTree(): Promise<any> {
  return useGet(`${BASE_API}/projectarchive/dataStandardsCatalogEx/getAllTree`);
}

// 新增目录
export function addCatalog(data: any): Promise<any> {
  return usePost(`${BASE_API}//projectarchive/dataStandardsCatalog`, data);
}

// 获取标准列表
export function getStandardList(param: { bo: object, page: object }): Promise<any> {
  return useGet(`/projectarchive/dataStandards/list?bo=${param.bo}&pageQuery=${param.page}`);
}
