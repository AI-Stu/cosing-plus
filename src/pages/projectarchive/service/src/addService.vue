<template>
  <a-card :bordered="false">
    <a-steps class="steps" :current="state.currentTab">
      <a-step title="填写服务信息" />
      <a-step title="关联存储数据" />
      <a-step title="完成" />
    </a-steps>
    <div class="content">
      <Step1 v-if="state.currentTab === 0" @next-step="nextStep" />
      <Step2 v-if="state.currentTab === 1" @next-step="nextStep" @prev-step="prevStep" />
      <Step3 v-if="state.currentTab === 2" @prevs-step="prevStep" @finish="finish" />
    </div>
  </a-card>
</template>

<script setup lang="ts">
import Step1 from './step1.vue';
import Step2 from './step2.vue';
import Step3 from './step3.vue';

defineOptions({
  name: 'AddService'
});

const emit = defineEmits(['goback']);
const route = useRoute();

const dictStore = useDictStore();
const { sys_service_type } = dictStore.getDict('sys_service_type');

// 提供静态值
provide('serviceId', route.query.serviceId);
provide('sys_service_type', sys_service_type);

const state = reactive({
  currentTab: 0,
  form: null
});

function nextStep() {
  if (state.currentTab < 3)
    state.currentTab += 1;
}

function prevStep() {
  if (state.currentTab > 0)
    state.currentTab -= 1;
}

function finish() {
  state.currentTab = 0;
}
</script>

<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>
