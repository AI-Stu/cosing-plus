<template>
  <div>
    <a-form
      ref="formRef" :model="formState" style="max-width: 500px; margin: 40px auto 0;" :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="服务编号" name="serviceCode">
        <a-input v-model:value="formState.serviceCode" placeholder="请输入服务编号" />
      </a-form-item>
      <a-form-item label="服务名称" name="serviceName" :rules="[{ required: true, message: '服务名称必须填写' }]">
        <a-input v-model:value="formState.serviceName" placeholder="请输入服务名称" />
      </a-form-item>
      <a-form-item label="服务地址" name="serviceUrl" :rules="[{ required: true, message: '服务地址必须填写' }]">
        <a-input v-model:value="formState.serviceUrl" placeholder="https://" />
      </a-form-item>
      <a-form-item label="服务年份" name="serviceYear" picker="year" :rules="[{ required: true, message: '服务年份必须填写' }]">
        <a-date-picker v-model:value="formState.serviceYear" picker="year" format="YYYY" value-format="YYYY" placeholder="请选择服务年份" />
      </a-form-item>
      <a-form-item label="服务类型" name="serviceType" :rules="[{ required: true, message: '服务类型必须填写' }]">
        <a-select v-model:value="formState.serviceType" :options="SYS_SERVICE_TYPE" placeholder="请选择服务类型" />
      </a-form-item>
      <a-form-item label="所属区域" name="region" :rules="[{ required: true, message: '所属区域必须选择' }]">
        <a-select v-model:value="formState.region" :options="regionList" placeholder="请选择所属区域" />
      </a-form-item>
      <a-form-item label="顺序" name="orderindex" :rules="[{ required: true, message: '服务顺序必须输入' }]">
        <a-input-number v-model:value="formState.orderindex" min="0" max="20000" style="width: 100%;" />
      </a-form-item>

      <a-form-item label="范围" name="bounds" :auto-link="false" :rules="[{ required: true, message: '范围必须填写' }]">
        <a-row :gutter="24" mb-4>
          <a-col class="gutter-row" :span="12">
            <a-input v-model:value="bounds.lt" type="number" placeholder="请输入左上经纬度" />
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-input v-model:value="bounds.lb" type="number" placeholder="请输入右上经纬度" />
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col class="gutter-row" :span="12">
            <a-input v-model:value="bounds.rt" type="number" placeholder="请输入左下经纬度" />
          </a-col>
          <a-col class="gutter-row" :span="12">
            <a-input v-model:value="bounds.rb" type="number" placeholder="请输入右下经纬度" />
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
import { cloneDeep, isEqual } from 'lodash-es';
import type { ServiceVO } from '@/api/projectarchive/service/types';
import { addServiceApi, getServiceApi, updateServiceApi } from '@/api/projectarchive/service';
import { regionList } from '@/assets/region';

const emit = defineEmits(['nextStep']);
const serviceId = inject('serviceId') as string;
const sys_service_type = inject('sys_service_type') as DictDataOption[];
const SYS_SERVICE_TYPE = computed(() => sys_service_type?.map((e: any) => ({ label: e.label, value: e.value })));
const message = useMessage();

const formRef = ref<FormInstance>();
const labelCol = { lg: { span: 5 }, sm: { span: 5 } };
const wrapperCol = { lg: { span: 19 }, sm: { span: 19 } };
let resetData = {} as any; // 优化提交
const formState = ref<ServiceVO>({
  orderindex: '1',
  step: '0'
});

const bounds = ref({ lt: '', lb: '', rt: '', rb: '' });
watch(bounds, () => {
  formState.value.bounds = `${bounds.value.lt},${bounds.value.lb},${bounds.value.rt},${bounds.value.rb}`;
}, { deep: true });

async function nextStep() {
  await formRef.value?.validateFields();

  if (formState.value.id) {
    if (!isEqual(resetData, formState.value)) {
      await updateServiceApi(formState.value);
      resetData = cloneDeep(formState.value);
      message.success('修改成功');
    }
  }
  else {
    await addServiceApi(formState.value);
    message.success('提交成功');
  }

  emit('nextStep');
}

onBeforeMount(async () => {
  if (serviceId) {
    getServiceApi(serviceId).then((res) => {
      delete res.data.createTime;
      const [lt, lb, rt, rb] = res.data?.bounds.split(',');
      bounds.value = { lt, lb, rt, rb };
      resetData = cloneDeep(res.data);
      formState.value = res.data;
    });
  }
});

// 重置
function reset() {
  if (resetData.bounds) {
    const [lt, lb, rt, rb] = resetData.bounds.split(',');
    bounds.value = { lt, lb, rt, rb };
  }

  formState.value = cloneDeep(resetData);
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
