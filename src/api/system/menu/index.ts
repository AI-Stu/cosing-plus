import type { AxiosPromise } from 'axios';
import type { MenuForm, MenuQuery, MenuTreeOption, MenuVO, RoleMenuTree } from './types';
import request from '@/utils/request';

// 查询菜单列表
export function listMenu(query?: MenuQuery): AxiosPromise<MenuVO[]> {
  return request({
    url: '/system/menu/list',
    method: 'get',
    params: query
  });
}

// 查询菜单详细
export function getMenu(menuId: string | number): AxiosPromise<MenuVO> {
  return request({
    url: `/system/menu/${menuId}`,
    method: 'get'
  });
}

// 查询菜单下拉树结构
export function treeselect(): AxiosPromise<MenuTreeOption[]> {
  return request({
    url: '/system/menu/treeselect',
    method: 'get'
  });
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId: string | number): AxiosPromise<RoleMenuTree> {
  return request({
    url: `/system/menu/roleMenuTreeselect/${roleId}`,
    method: 'get'
  });
}

// 根据角色ID查询菜单下拉树结构
export function tenantPackageMenuTreeselect(packageId: string | number): AxiosPromise<RoleMenuTree> {
  return request({
    url: `/system/menu/tenantPackageMenuTreeselect/${packageId}`,
    method: 'get'
  });
}

// 新增菜单
export function addMenu(data: MenuForm) {
  return request({
    url: '/system/menu',
    method: 'post',
    data
  });
}

// 修改菜单
export function updateMenu(data: MenuForm) {
  return request({
    url: '/system/menu',
    method: 'put',
    data
  });
}

// 删除菜单
export function delMenu(menuId: string | number) {
  return request({
    url: `/system/menu/${menuId}`,
    method: 'delete'
  });
}
