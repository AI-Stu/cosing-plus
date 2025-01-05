import type { MenuForm, MenuQuery, MenuTreeOption, MenuVO, RoleMenuTree, RouteRecordRaw } from './types';

const BASE_API = import.meta.env.VITE_APP_BASE_API_DEV;

// 获取路由
export function getRoutersApi() {
  return useGet<RouteRecordRaw[]>(`${BASE_API}/system/menu/getRouters`);
}

// 查询菜单列表
export function listMenuApi(query?: MenuQuery) {
  return useGet<MenuVO[]>(`${BASE_API}/system/menu/list`, query);
}

// 查询菜单详细
export function getMenuApi(menuId: string | number) {
  return useGet<MenuVO>(`${BASE_API}/system/menu/${menuId}`);
}

// 查询菜单下拉树结构
export function treeSelectApi() {
  return useGet<MenuTreeOption[]>(`${BASE_API}/system/menu/treeselect`);
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselectApi(roleId: string | number) {
  return useGet<RoleMenuTree>(`${BASE_API}/system/menu/roleMenuTreeselect/${roleId}`);
}

// 根据角色ID查询菜单下拉树结构
export function tenantPackageMenuTreeselectApi(packageId: string | number) {
  return useGet<RoleMenuTree>(`${BASE_API}/system/menu/tenantPackageMenuTreeselect/${packageId}`);
}

// 新增菜单
export function addMenuApi(data: MenuForm) {
  return usePost<RoleMenuTree>(`${BASE_API}/system/menu`, data);
}

// 修改菜单
export function updateMenuApi(data: MenuForm) {
  return usePut<MenuForm>(`${BASE_API}/system/menu`, data);
}

// 删除菜单
export function delMenuApi(menuId: string | number) {
  return useDelete(`${BASE_API}/system/menu/${menuId}`);
}

export type { MenuForm, MenuQuery, MenuTreeOption, MenuVO, RoleMenuTree };
