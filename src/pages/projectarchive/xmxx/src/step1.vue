<template>
  <div>
    <a-form
      ref="formRef" :model="formState" style="max-width: 500px; margin: 40px auto 0;" :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="项目编号" name="xmbh" :rules="[{ required: true, message: '项目编号必须填写' }]">
        <a-input v-model:value="formState.xmbh" placeholder="请输入项目编号" />
      </a-form-item>
      <a-form-item label="项目名称" name="xmmc" :rules="[{ required: true, message: '项目名称必须填写' }]">
        <a-input v-model:value="formState.xmmc" placeholder="请输入项目名称" />
      </a-form-item>
      <a-form-item label="委托单位" name="unit" :rules="[{ required: true, message: '委托单位必须填写' }]">
        <a-input v-model:value="formState.unit" placeholder="请输入委托单位" />
      </a-form-item>
      <a-form-item label="所属区域" name="region" :rules="[{ required: true, message: '所属区域必须选择' }]">
        <a-select v-model:value="formState.region" :options="regionList" placeholder="请选择所属区域" />
      </a-form-item>
      <a-form-item label="签订时间" name="signdata" :rules="[{ required: true, message: '签订时间必须输入' }]">
        <a-date-picker v-model:value="formState.signdata" value-format="YYYY-MM-DD" />
      </a-form-item>
      <a-form-item label="竣工时间" name="jgsj" :rules="[{ required: true, message: '竣工时间必须输入' }]">
        <a-date-picker v-model:value="formState.jgsj" value-format="YYYY-MM-DD" />
      </a-form-item>
      <a-form-item label="是否竣工" name="isjg" :rules="[{ required: true, message: '是否竣工必须选择' }]">
        <a-switch v-model:checked="formState.isjg" :checked-value="1" :un-checked-value="0" />
      </a-form-item>
      <a-form-item label="项目地址" name="xmdz" :rules="[{ required: true, message: '项目地址必须填写' }]">
        <a-input v-model:value="formState.xmdz" placeholder="请选择项目地址">
          <template #suffix>
            <AimOutlined style="color: rgba(0, 0, 0, 0.45)" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="经度" name="longitude" :rules="[{ required: true, message: '经度必须填写' }]">
        <a-input v-model:value="formState.longitude" placeholder="请输入经度" />
      </a-form-item>
      <a-form-item label="纬度" name="latitude" :rules="[{ required: true, message: '纬度必须填写' }]">
        <a-input v-model:value="formState.latitude" placeholder="请输入纬度" />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24, offset: 16 }">
        <a-button mr-4 @click="reset">
          重置
        </a-button>
        <a-button type="primary" @click="nextStep">
          下一步
        </a-button>
      </a-form-item>
    </a-form>
    <a-divider />
    <div class="step-form-style-desc ant-steps-item-title">
      <h3>
        说明
      </h3>
      <h4>经纬度一定要录入，后续时空化处理。</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { AimOutlined } from '@ant-design/icons-vue';
import { cloneDeep, isEqual } from 'lodash-es';
import type { XmxxVO } from '@/api/projectarchive/xmxx/types';
import { regionList } from '@/assets/region';
import { addXmxx, getXmxx, updateXmxx } from '@/api/projectarchive/xmxx';

const emit = defineEmits(['nextStep']);
const xmxxid = inject('xmxxid') as string;
const message = useMessage();

const formRef = ref<FormInstance>();
const labelCol = { lg: { span: 5 }, sm: { span: 5 } };
const wrapperCol = { lg: { span: 19 }, sm: { span: 19 } };

let resetForm = {}; // 优化提交
const formState = ref<XmxxVO>({
  step: 0
});
async function nextStep() {
  await formRef.value?.validateFields();
  if (formState.value.xmxxid) {
    if (!isEqual(resetForm, formState.value)) {
      await updateXmxx(formState.value);
      resetForm = cloneDeep(formState.value);
      message.success('修改成功');
    }
  }
  else {
    await addXmxx(formState.value);
    message.success('提交成功');
  }

  emit('nextStep');
}

onBeforeMount(async () => {
  if (xmxxid) {
    getXmxx(xmxxid).then((res) => {
      resetForm = cloneDeep(res.data);
      formState.value = res.data;
    });
  }
});

// 重置
function reset() {
  formState.value = resetForm;
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
