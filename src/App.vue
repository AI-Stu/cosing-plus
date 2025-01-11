<template>
  <a-config-provider :theme="theme" :locale="antd">
    <a-app class="h-full font-chinese antialiased">
      <TokenProvider>
        <RouterView />
      </TokenProvider>
    </a-app>
  </a-config-provider>
</template>

<script setup lang="ts">
import { useLayoutMenuProvide } from '@/components/page-container/context';

const dictStore = useDictStore();
const appStore = useAppStore();
const { theme } = storeToRefs(appStore);
const { antd } = useI18nLocale();
const layoutMenu = useLayoutMenu();
useLayoutMenuProvide(layoutMenu, appStore);

onBeforeMount(() => {
  dictStore.getDict('sys_service_type');
});
</script>

<style>
:root{
  --text-light-color: #696969e0;
}
</style>
