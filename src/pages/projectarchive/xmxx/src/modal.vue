<template>
  <!-- 新增弹窗 -->
  <a-modal v-model:open="openValue" title="选择数据清单" width="1000px" @cancel="handleCancel" @ok="handleOk">
    <a-row v-if="!ishow" :gutter="20">
      <a-col :span="18" :push="6">
        <a-breadcrumb>
          <a-breadcrumb-item>施工图建筑面积预绘测</a-breadcrumb-item>
          <a-breadcrumb-item>商业及其他用房-附件列表</a-breadcrumb-item>
        </a-breadcrumb>
        <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" :pagination="false" size="small">
          <template #bodyCell="scope">
            <template v-if="scope?.column?.dataIndex === 'action'">
              <div flex gap-2>
                <a @click="handle(scope?.record as ConsultTableModel)">
                  详情
                </a>
              </div>
            </template>
          </template>
        </a-table>
        <a-button size="small" type="primary" style="float: right;margin-top: 10px;">
          添加
        </a-button>
        <div style="clear: both;" />
        <a-alert
          v-if="visible"
          style="margin: 10px 0;"
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
        <div style="margin-bottom: 10px;">
          <a-button size="small" type="primary" style="margin-right: 10px;">
            自定义附件
          </a-button>
          <a-button size="small" type="primary" danger>
            删除
          </a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" :pagination="false" size="small" />
      </a-col>
      <a-col :span="6" :pull="18">
        <a-input v-model:value="searchValue" style="margin-bottom: 8px" placeholder="数据标准类型" />
        <a-tree
          v-model:selected-keys="selectedKeys"
          show-icon default-expand-all
          :expanded-keys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="gData"
          @expand="onExpand"
        >
          <template #title="{ title }">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substring(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substring(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
          <template #icon="{ children }">
            <template v-if="children?.length">
              <UnorderedListOutlined />
            </template>
            <template v-else>
              <ReadOutlined />
            </template>
          </template>
        </a-tree>
      </a-col>
    </a-row>
    <a-row v-else>
      <a-col :span="24">
        <a-breadcrumb>
          <a-breadcrumb-item>施工图建筑面积预绘测</a-breadcrumb-item>
          <a-breadcrumb-item>商业及其他用房-附件列表</a-breadcrumb-item>
        </a-breadcrumb>
        <div style="margin: 10px 0;">
          <a-button size="small" type="primary" style="margin-right: 10px;">
            自定义附件
          </a-button>
          <a-button size="small" type="primary" danger>
            删除
          </a-button>
        </div>
        <a-table :columns="columns" :data-source="data" :row-selection="rowSelection" :pagination="false" size="small" />
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';
import { ReadOutlined, UnorderedListOutlined } from '@ant-design/icons-vue';
import type { ConsultTableModel } from '@/api/list/table-list';

const { open } = defineProps(['open']);

// 定义事件
const emit = defineEmits(['close']);
console.log(open, 'open');

const openValue = ref(open);
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
const ishow = ref(false);
const visible = ref<boolean>(true);
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
const selectedKeys = ref(['0-0']);
const genData: TreeProps['treeData'] = [{ title: '项目启动标准', key: '0-0', children: [{ title: '测绘服务', key: '0-1-0' }] }, { title: '施工图建筑面积预测绘', key: '0-2' }];

const dataList: TreeProps['treeData'] = [];
function generateList(data: TreeProps['treeData']) {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.key;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
}
generateList(genData);

function getParentKey(key: string | number, tree: TreeProps['treeData']): string | number | undefined {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: any) => item.key === key)) {
        parentKey = node.key;
      }
      else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
}
const expandedKeys = ref<(string | number)[]>([]);
const searchValue = ref<string>('');
const autoExpandParent = ref<boolean>(true);
const gData = ref<TreeProps['treeData']>(genData);

function onExpand(keys: string[]) {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
}

watch(searchValue, (value) => {
  const expanded = dataList
    .map((item: TreeProps['treeData'][number]) => {
      if (item.title.includes(value)) {
        return getParentKey(item.key, gData.value);
      }
      return null;
    })
    .filter((item, i, self) => item && self.indexOf(item) === i);
  expandedKeys.value = expanded;
  searchValue.value = value;
  autoExpandParent.value = true;
});

function handle(record: ConsultTableModel) {
  ishow.value = true;
}

function handleClose() {}

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
