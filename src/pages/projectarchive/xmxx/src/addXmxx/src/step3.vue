<template>
  <div>
    <div style="width:700px;margin: 0 auto;">
      <a-alert v-if="visible" type="info" closable show-icon :after-close="handleClose">
        <template #message>
          <div>共选择15项标准，共需提交45个文件</div>
        </template>
        <template #action>
          <a-button size="small" type="link">
            取消选择
          </a-button>
        </template>
      </a-alert>
      <div class="flex justify-between" style="align-items: center;">
        <a-button type="primary" my-3 @click="openClick">
          添加
        </a-button>
        <div>一张图目录是否展示 <a-switch v-model:checked="checked" /></div>
      </div>
      <a-table
        style="margin-bottom: 10px;" :loading="loading" :columns="filterColumns" :pagination="false"
        :data-source="dataSource" size="small"
      >
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a c-error @click="handleDelete(scope?.record as ConsultTableModel)">
                删除
              </a>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'fj'">
            <div gap-2>
              <a-button type="link" block>
                {{ scope?.record?.fj || 1 }}
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
      <div style="float:right; margin-bottom: 10px;">
        <a-button @click="prevStep">
          上一步
        </a-button>
        <a-button ml-4 type="primary" @click="nextStep">
          确定
        </a-button>
      </div>
    </div>
    <a-divider />
    <div class="step-form-style-desc ant-steps-item-title">
      <h3>
        说明
      </h3>
      <h4>数据标注来自数据标准管理，有补充请联系管理员。</h4>
      <h4>附件除数据标准内已有选项，缺失项可以自行添加。</h4>
    </div>
    <ServiceModal :open="open" @close="modalClose" />
  </div>
</template>

<script setup lang="ts">
import ServiceModal from '@/pages/projectarchive/components/ServiceModal.vue';
import type { ConsultTableModel } from '@/api/list/table-list';

const emit = defineEmits(['prevStep', 'nextStep']);
// const message = useMessage();

const open = ref(false);
const columns = shallowRef([
  {
    title: '序号',
    dataIndex: 'id'
  },
  {
    title: '数据标准',
    dataIndex: 'name'
  },
  {
    title: '父级目录',
    dataIndex: 'desc',
    ellipsis: true
  },
  {
    title: '技术标准',
    dataIndex: 'callNo',
    ellipsis: true
  },
  {
    title: '附件',
    dataIndex: 'fj',
    width: 50
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80
  }
]);
const dataSource = shallowRef<ConsultTableModel[]>([]);
const visible = ref<boolean>(true);
const checked = ref<boolean>(false);
const loading = shallowRef(false);

const getCheckList = computed(() => columns.value.map(item => item.dataIndex));

// 备份columns
const filterColumns = ref(filterAction(getCheckList.value));

function modalClose() {
  open.value = false;
}

/**
 * 过滤
 *
 */
function filterAction(value: string[]) {
  return columns.value.filter((item) => {
    if (value.includes(item.dataIndex)) {
      // 为true时，循环遍历的值会暴露出去
      return true;
    }
    return false;
  });
}

/**
 * 删除功能
 *  @param record
 *
 */
async function handleDelete(record: ConsultTableModel) {

}

function handleClose() {
  visible.value = false;
}

function openClick() {
  open.value = true;
}

function nextStep() {
  emit('nextStep');
}

function prevStep() {
  emit('prevStep');
}
</script>

<style lang="less" scoped>
.stepFormText {
  margin-bottom: 24px;

  .ant-form-item-label,
  .ant-form-item-control {
    line-height: 22px;
  }
}
</style>
