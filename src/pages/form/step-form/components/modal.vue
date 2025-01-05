<template>
  <!-- 新增弹窗 -->
  <!-- <a-modal v-model:open="props.open" title="选择数据清单" width="800px" @ok="handleOk">
    <a-row>
      <a-col :span="18" :push="6">
        <a-breadcrumb>
          <a-breadcrumb-item>施工图建筑面积预绘测</a-breadcrumb-item>
          <a-breadcrumb-item>商业及其他用房-附件列表</a-breadcrumb-item>
        </a-breadcrumb>
        <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" :pagination="false" size="small">
          <template #bodyCell="scope">
            <template v-if="scope?.column?.dataIndex === 'action'">
              <div flex gap-2>
                <a c-error @click="handle(scope?.record as ConsultTableModel)">
                  详情
                </a>
              </div>
            </template>
          </template>
        </a-table>
      </a-col>
      <a-col :span="6" :pull="18" />
    </a-row>
  </a-modal> -->
  <div>1</div>
</template>

<script setup lang="ts">
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['childEvent']);
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

function handle() {}

// 向父组件发送事件
function handleOk() {
  emit('childEvent', props.open);
};
</script>

  <style lang="less" scoped>
  </style>
