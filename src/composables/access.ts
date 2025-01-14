import { toArray } from '@v-c/utils';
import type { AccessEnum } from '@/utils/constant';

/**
 * 角色权限校验
 * @returns {object} 角色&权限
 */
export function useAccess(): any {
  const userStore = useUserStore();
  const roles = computed(() => userStore.roles);
  const permissions = computed(() => userStore.permissions);
  const hasAccess = (roles: (string | number)[] | string | number | AccessEnum) => {
    const accessRoles = userStore.roles;
    const accessPermissions = userStore.permissions;
    const roleArr = toArray(roles).flat(1);
    const accessPermissionsArr = toArray(accessPermissions).flat(1);
    return roleArr.some(role => accessRoles?.includes(role)) || accessPermissionsArr.some(permission => accessPermissions?.includes(permission));
  };
  return {
    hasAccess,
    roles,
    permissions
  };
}
