<template>
  <div>
    <a-alert
      v-if="visible"
      type="info"
      closable
      show-icon
      style="width:600px;margin: 0 auto;"
      :after-close="handleClose"
    >
      <template #message>
        <div>11111111111</div>
      </template>
      <template #action>
        <a-button size="small" type="link">
          取消选择
        </a-button>
      </template>
    </a-alert>
    <a-button size="small" type="primary">
      添加
    </a-button>
    <div style="float:right;">
      <a-button type="primary" @click="nextStep">
        下一步
      </a-button>
      <a-button style="margin-left: 8px" @click="prevStep">
        上一步
      </a-button>
    </div>
    <a-divider />
    <div class="step-form-style-desc ant-steps-item-title">
      <h3>
        说明
      </h3>
      <h4>数据标注来自数据标准管理，有补充请联系管理员。</h4>
      <h4>附件除数据标准内已有选项，缺失项可以自行添加。</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['prevStep', 'nextStep']);

const visible = ref<boolean>(true);
function handleClose() {
  visible.value = false;
}

function prevStep() {
  emit('prevStep');
}
async function nextStep() {
  emit('nextStep');
}
</script>

<style lang="less" scoped>
.step-form-style-desc {
  padding: 0 56px;

  h3 {
    margin: 0 0 12px;
    font-size: 16px;
    line-height: 32px;
  }

  h4 {
    margin: 0 0 4px;
    font-size: 14px;
    line-height: 22px;
  }

  p {
    margin-top: 0;
    margin-bottom: 12px;
    line-height: 22px;
  }
}
</style>
