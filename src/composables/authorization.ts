import { StorageSerializers } from '@vueuse/core';

export const STORAGE_AUTHORIZE_KEY = 'Authorization';
export const SESSION_REQUEST_KEY = 'SESSION_REQUEST_KEY';

export const useAuthorization = createGlobalState(() => useStorage<null | string>(STORAGE_AUTHORIZE_KEY, null));
export const useSessionRequest = createGlobalState(() => useSessionStorage<null | string | object>(
  SESSION_REQUEST_KEY,
  null,
  { serializer: StorageSerializers.object }
));
