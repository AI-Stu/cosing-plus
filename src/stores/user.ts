import { logoutApi } from '@/api/system/login';
import { getRouteMenusApi } from '@/api/common/menu';
import { getUserInfoApi } from '@/api/system/user';
import type { MenuData } from '@/layouts/basic-layout/typing';
import { rootRoute } from '@/router/constant';
import { generateFlatRoutes, generateRoutes, generateTreeRoutes } from '@/router/generate-route';
import { DYNAMIC_LOAD_WAY, DynamicLoadEnum } from '@/utils/constant';
import type { User, UserInfo } from '@/api/system/user/types';

export const useUserStore = defineStore('user', () => {
  const routerData = shallowRef();
  const menuData = shallowRef<MenuData>([]);
  const userInfo = shallowRef<User>();
  const token = useAuthorization();
  const avatar = computed(() =>
    userInfo.value?.avatar
      ? `${import.meta.env.VITE_APP_BASE_API_DEV}/file/download/${userInfo.value?.avatar}`
      : 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
  );
  const nickname = computed(() => userInfo.value?.nickname ?? userInfo.value?.username);
  const roles = computed(() => userInfo.value?.roles);

  const getMenuRoutes = async () => {
    const { data } = await getRouteMenusApi();
    return generateTreeRoutes(data ?? []);
  };

  const generateDynamicRoutes = async () => {
    const dynamicLoadWay = DYNAMIC_LOAD_WAY === DynamicLoadEnum.BACKEND ? getMenuRoutes : generateRoutes;
    const { menuData: treeMenuData, routeData } = await dynamicLoadWay();

    menuData.value = treeMenuData;

    routerData.value = {
      ...rootRoute,
      children: generateFlatRoutes(routeData)
    };
    return routerData.value;
  };

  // 获取用户信息
  const getUserInfo = async () => {
    // 获取用户信息
    const { data } = await getUserInfoApi() as { data: UserInfo };
    data.user.roles = data.user.roles.length > 0 ? data.user.roles : data.roles;
    userInfo.value = data.user as User;
  };

  const logout = async () => {
    // 退出登录
    // 1. 清空用户信息
    try {
      await logoutApi();
    }
    finally {
      token.value = null;
      userInfo.value = undefined;
      routerData.value = undefined;
      menuData.value = [];
    }
  };

  return {
    userInfo,
    roles,
    getUserInfo,
    logout,
    routerData,
    menuData,
    generateDynamicRoutes,
    avatar,
    nickname
  };
});
