<template>
  <div>
    <a-form
      ref="formRef" :model="formState" style="max-width: 500px; margin: 40px auto 0;"
      :label-col="labelCol" :wrapper-col="wrapperCol"
    >
      <a-form-item
        label="项目编号"
        name="xmbh"
        :rules="[{ required: true, message: '项目编号必须填写' }]"
      >
        <a-input
          v-model:value="formState.xmbh" placeholder="请输入项目编号"
        />
      </a-form-item>
      <a-form-item
        label="项目名称"
        name="xmmc"
        :rules="[{ required: true, message: '项目名称必须填写' }]"
      >
        <a-input
          v-model:value="formState.xmmc" placeholder="请输入项目名称"
        />
      </a-form-item>
      <a-form-item
        label="委托单位"
        name="unit"
        :rules="[{ required: true, message: '委托单位必须填写' }]"
      >
        <a-input v-model:value="formState.unit" placeholder="请输入委托单位" />
      </a-form-item>
      <a-form-item
        label="所属区域"
        name="region"
        :rules="[{ required: true, message: '所属区域必须选择' }]"
      >
        <a-select
          v-model:value="formState.region"
          placeholder="请选择所属区域"
        >
          <a-select-option value="1">
            湖北
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="签订时间"
        name="signdata"
        :rules="[{ required: true, message: '签订时间必须输入' }]"
      >
        <a-date-picker v-model:value="formState.signdata" :format="dateFormat" />
      </a-form-item>
      <a-form-item
        label="竣工时间"
        name="jgsj"
        :rules="[{ required: true, message: '竣工时间必须输入' }]"
      >
        <a-date-picker v-model:value="formState.jgsj" :format="dateFormat" />
      </a-form-item>
      <a-form-item
        label="是否竣工" name="isjg"
        :rules="[{ required: true, message: '是否竣工必须选择' }]"
      >
        <a-switch v-model:checked="formState.isjg" />
      </a-form-item>
      <a-form-item
        label="项目地址"
        name="xmdz"
        :rules="[{ required: true, message: '项目地址必须填写' }]"
      >
        <a-input v-model:value="formState.xmdz" placeholder="请选择项目地址">
          <template #suffix>
            <AimOutlined style="color: rgba(0, 0, 0, 0.45)" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="经纬度">
        <div class="flex">
          <a-input
            v-model:value="formState.longitude" placeholder="请输入经度" style="margin-right:5px;"
          />
          <a-input
            v-model:value="formState.latitude" placeholder="请输入纬度"
          />
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
        <a-button style="margin-right:10px;" @click="reset">
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
// import dayjs from 'dayjs';
import { reactive, ref } from 'vue';

const emit = defineEmits(['nextStep']);
const dateFormat = 'YYYY/MM/DD'; // 日期格式
const formRef = ref<FormInstance>();
const labelCol = { lg: { span: 5 }, sm: { span: 5 } };
const wrapperCol = { lg: { span: 19 }, sm: { span: 19 } };

// const value1 = ref(dayjs('2015/01/01', dateFormat));
// const value2 = ref(dayjs('2015/01/01', dateFormat));

interface FirstFormState {
  xmbh: string
  xmmc: string
  unit: string
  region: string
  signdata: string
  jgsj: string
  isjg: boolean
  xmdz: string
  longitude: string
  latitude: string
}
const formState = reactive<FirstFormState>({
  xmbh: '11123',
  xmmc: '水立方项目',
  unit: '湖北华强有限公司',
  region: '1',
  signdata: '',
  jgsj: '',
  isjg: true,
  xmdz: '华强北',
  longitude: '32.43525256',
  latitude: '182.884548744'
});
async function nextStep() {
  try {
    await formRef.value?.validateFields();
    emit('nextStep');
  }
  catch (errorInfo) {
    console.log('Failed:', errorInfo);
  }
}

// 重置
function reset() {}
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
