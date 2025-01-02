<template>
  <div
    class="bg-[var(--bg-color)] ant-pro-iframe-wrap"
    w-full h-full b-rd-8px of-hidden
    flex flex-col flex-1
  >
    <a-spin
      :spinning="loading"
      wrapper-class-name="b-rd-8px of-hidden w-full h-full flex flex-col flex-1"
    >
      <iframe w-full h-full flex flex-col flex-1 :src="link" style="border: none" @load="finishLoading" />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const link = computed(() => route?.meta?.link);
const loading = ref(true);
function finishLoading() {
  loading.value = false;
}
</script>

<style>
.ant-pro-iframe-wrap{
  .ant-spin-container{
    height: 100% !important;
    width: 100% !important;
    display: flex;
    flex-direction: column;
    flex: 1;
  }
}
</style>
