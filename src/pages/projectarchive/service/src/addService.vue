<template>
  <a-card :bordered="false">
    <a-steps class="max-w-750px m-y-16px m-x-a" :current="state.currentTab">
      <a-step title="填写服务信息" />
      <a-step title="关联存储数据" />
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
        <Step3 v-show="state.currentTab === 2" @prevs-step="prevStep" @finish="finish" />
      </template>
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
const rel = reactive([false, false, false]); // 优化步骤页面
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
