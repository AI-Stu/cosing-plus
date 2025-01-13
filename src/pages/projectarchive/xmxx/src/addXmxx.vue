<template>
  <a-card :bordered="false">
    <a-steps class="steps" :current="state.currentTab">
      <a-step title="填写项目信息" />
      <a-step title="选择归档数据清单" />
      <a-step title="挂接服务数据" />
      <a-step title="完成" />
    </a-steps>
    <div class="content">
      <Step1 v-show="state.currentTab === 0" @next-step="nextStep" />
      <Step2 v-show="state.currentTab === 1" @next-step="nextStep" @prev-step="prevStep" />
      <Step3 v-show="state.currentTab === 2" @next-step="nextStep" @prev-step="prevStep" />
      <Step4 v-show="state.currentTab === 3" @prevs-step="prevStep" @finish="finish" />
    </div>
  </a-card>
</template>

<script setup lang="ts">
import Step1 from './step1.vue';
import Step2 from './step2.vue';
import Step3 from './step3.vue';
import Step4 from './step4.vue';

defineOptions({
  name: 'AddXmxx'
});
const emit = defineEmits(['goback']);
const route = useRoute();

// 提供静态值
provide('xmxxid', route.query.xmxxid);

const state = reactive({
  currentTab: Number(route.query.step) || 0,
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
