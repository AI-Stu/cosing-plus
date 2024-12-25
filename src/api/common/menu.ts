import type { MenuData } from '@/layouts/basic-layout/typing';

const BASE_API = import.meta.env.VITE_APP_BASE_API;
export function getRouteMenusApi() {
  return useGet<MenuData>(`${BASE_API}/menu`);
}
