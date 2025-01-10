<template>
  <!-- 新增弹窗 -->
  <a-modal v-model:open="openValue" title="选择数据清单" width="1000px" @cancel="handleCancel" @ok="handleOk">
    <a-row>
      <a-col :span="24">
        <a-form :label-col="{ span: 7 }" :model="formModel">
          <a-row :gutter="[15, 0]">
            <a-col :span="8">
              <a-form-item name="name" label="规则名称">
                <a-input v-model:value="formModel.name" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="desc" label="描述">
                <a-input v-model:value="formModel.desc" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item name="callNo" label="服务调用次数">
                <a-input-number v-model:value="formModel.callNo" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="[15, 0]">
            <a-col :span="8">
              <a-form-item name="updatedAt" label="上次调用时间">
                <a-date-picker v-model:value="formModel.updatedAt" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8" />
            <a-col :span="8">
              <a-space flex justify-end w-full>
                <a-button :loading="loading" type="primary" @click="onSearch">
                  查询
                </a-button>
                <a-button :loading="loading" @click="onReset">
                  重置
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-form>
        <a-alert
          v-if="visible"
          style="margin-bottom: 10px;"
          type="info"
          closable
          show-icon
          :after-close="handleClose"
        >
          <template #message>
            <div>共选择15项标准，共需提交45个文件</div>
          </template>
          <template #action>
            <a-button size="small" type="link">
              取消选择
            </a-button>
          </template>
        </a-alert>
        <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" :pagination="false" size="small">
          <template #bodyCell="scope">
            <template v-if="scope?.column?.dataIndex === 'action'">
              <div flex gap-2>
                <a @click="handleDelete(scope?.record as ConsultTableModel)">
                  详情
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
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup lang="ts">
// import type { TreeProps } from 'ant-design-vue';
// import { ReadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue';
import type { ConsultTableModel, ConsultTableParams } from '@/api/list/table-list';

const props = defineProps(['opens']);

// 定义事件
const emit = defineEmits(['close']);
const openValue = ref(false);
const formModel = reactive<ConsultTableParams>({
  name: undefined,
  callNo: undefined,
  desc: undefined,
  status: undefined,
  updatedAt: undefined
});
  // 数据
const columns = [
  {
    title: '应收附件',
    dataIndex: 'fj',
    key: 'fj'
  },
  {
    title: '技术标准',
    dataIndex: 'jsbz',
    key: 'jsbz'
  },
  {
    title: '资料类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '数量',
    dataIndex: 'num',
    key: 'num'
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    key: 'time'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80
  }
];
interface DataItem {
  key: number
  fj: string
  jsbz: string
  type: string
  num: number
  time: string
}
const data: DataItem[] = [
  {
    key: 1,
    fj: 'John Brown sr.',
    jsbz: '5467878',
    type: 'New York No. 1 Lake Park',
    num: 111,
    time: '2025-1-2'
  }
];
const loading = shallowRef(false);
const visible = ref(true);
const rowSelection = ref({
  checkStrictly: false,
  onChange: (selectedRowKeys: (string | number)[], selectedRows: DataItem[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record: DataItem, selected: boolean, selectedRows: DataItem[]) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected: boolean, selectedRows: DataItem[], changeRows: DataItem[]) => {
    console.log(selected, selectedRows, changeRows);
  }
});
  /**
   * 删除功能
   *  @param record
   *
   */
function handleDelete(record: ConsultTableModel) {
}

function handleClose() {}

function onSearch() {
}

function onReset() {
  // 清空所有参数重新请求
  formModel.name = undefined;
  formModel.desc = undefined;
}

// 向父组件发送事件
function handleOk() {
  emit('close');
};

function handleCancel() {
  emit('close');
}
</script>

      <style lang="less" scoped>
      </style>
