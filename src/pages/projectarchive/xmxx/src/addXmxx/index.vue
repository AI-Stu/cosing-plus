<template>
  <a-card :bordered="false">
    <a-steps class="max-w-750px m-y-16px m-x-a" :current="state.currentTab">
      <a-step title="填写项目信息" />
      <a-step title="选择归档数据清单" />
      <a-step title="挂接服务数据" />
      <a-step title="完成" />
    </a-steps>
    <div class="content">
      <template v-if="rel[0]">
        <Step1 v-show="state.currentTab === 0" @next-step="nextStep" />
      </template>
      <template v-if="rel[1]">
        <Step2 v-show="state.currentTab === 1" @next-step="nextStep" @prev-step="prevStep" />
      </template>
      <template v-if="rel[2]">
        <Step3 v-show="state.currentTab === 2" @next-step="nextStep" @prev-step="prevStep" />
      </template>
      <template v-if="rel[3]">
        <Step4 v-show="state.currentTab === 3" @prevs-step="prevStep" @finish="finish" />
      </template>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import Step1 from './src/step1.vue';
import Step2 from './src/step2.vue';
import Step3 from './src/step3.vue';
import Step4 from './src/step4.vue';

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
const rel = reactive([false, false, false, false]); // 优化步骤页面
rel[state.currentTab] = true;

function nextStep() {
  if (state.currentTab < 3) {
    state.currentTab += 1;
    rel[state.currentTab] = true;
  }
}

function prevStep() {
  if (state.currentTab > 0) {
    state.currentTab -= 1;
    rel[state.currentTab] = true;
  }
}

function finish() {
  state.currentTab = 0;
  rel[state.currentTab] = true;
}
</script>

<style lang="less" scoped>

</style>
