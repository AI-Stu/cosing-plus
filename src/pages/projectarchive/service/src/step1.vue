<template>
  <div>
    <a-form
      ref="formRef" :model="formState" style="max-width: 500px; margin: 40px auto 0;" :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="服务编号" name="serviceCode" :rules="[{ required: true, message: '服务编号必须填写' }]">
        <a-input v-model:value="formState.serviceCode" placeholder="请输入服务编号" />
      </a-form-item>
      <a-form-item label="服务名称" name="serviceName" :rules="[{ required: true, message: '服务名称必须填写' }]">
        <a-input v-model:value="formState.serviceName" placeholder="请输入服务名称" />
      </a-form-item>
      <a-form-item label="服务地址" name="serviceUrl" :rules="[{ required: true, message: '服务地址必须填写' }]">
        <a-input v-model:value="formState.serviceUrl" placeholder="https://" />
      </a-form-item>
      <a-form-item label="服务年份" name="serviceYear" picker="year" :rules="[{ required: true, message: '服务年份必须填写' }]">
        <a-date-picker v-model:value="formState.serviceYear" picker="year" placeholder="请选择服务年份" />
      </a-form-item>
      <a-form-item label="服务类型" name="serviceType" :rules="[{ required: true, message: '服务类型必须填写' }]">
        <a-select v-model:value="formState.serviceType" :options="SYS_SERVICE_TYPE" placeholder="请选择服务类型">
          <a-select-option value="1">
            倾斜摄影
          </a-select-option>
          <a-select-option value="2">
            基础地形
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="所属区域" name="region" :rules="[{ required: true, message: '所属区域必须选择' }]">
        <a-select v-model:value="formState.region" :options="regionList" placeholder="请选择所属区域" />
      </a-form-item>

      <a-form-item label="范围" name="bounds" :auto-link="false" :rules="[{ required: true, message: '范围必须填写' }]">
        <a-row :gutter="24" mb-4>
          <a-col class="gutter-row" :span="12">
            <a-input v-model:value.trim="bounds.lt" placeholder="请输入左上经纬度" />
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-input v-model:value.trim="bounds.lb" placeholder="请输入右上经纬度" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col class="gutter-row" :span="12">
            <a-input v-model:value.trim="bounds.rt" placeholder="请输入左下经纬度" />
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-input v-model:value.trim="bounds.rb" placeholder="请输入右下经纬度" />
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 24, offset: 16 }" text-right>
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
import type { ServiceVO } from '@/api/projectarchive/service/types';
import { addService } from '@/api/projectarchive/service';
import { regionList } from '@/assets/region';

const emit = defineEmits(['nextStep']);
const dictStore = useDictStore();
const formRef = ref<FormInstance>();
const labelCol = { lg: { span: 5 }, sm: { span: 5 } };
const wrapperCol = { lg: { span: 19 }, sm: { span: 19 } };
const { sys_service_type } = toRefs<any>(dictStore.getDict('sys_service_type'));
const SYS_SERVICE_TYPE = computed(() => sys_service_type?.value.map((e: any) => ({ label: e.label, value: e.value })));
const formState = reactive<ServiceVO>({
  orderindex: '1',
  step: 0
});

const bounds = reactive({
  lt: '',
  lb: '',
  rt: '',
  rb: ''
});
watch(bounds, () => {
  formState.bounds = `${bounds.lt},${bounds.lb},${bounds.rt},${bounds.rb}`;
});
async function nextStep() {
  formRef.value?.validateFields().then(async () => {
    const res = await addService(formState);
    console.log(res);
    emit('nextStep');
  });
}

// 重置
function reset() { }
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
