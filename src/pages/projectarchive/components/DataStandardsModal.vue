<!-- 选取数据标准弹窗 -->
<template>
  <a-modal v-model:open="openValue" title="选择数据清单" width="1300px" @cancel="handleCancel" @ok="handleOk">
    <a-row v-if="true" :gutter="16">
      <!-- 数据标准类型树 -->
      <a-col :span="5">
        <DataStandardsTree
          ref="dataStandardsTreeRef"
          v-model="selectNode"
          class="border-0 border-r-1px border-rd-0 h-full"
          :height="800"
          :add="false"
          @select="handleSelect"
        />
      </a-col>

      <!-- 附件列表 -->
      <a-col :span="19">
        <a-flex align="center" justify="space-between" class="mb-4">
          <a-breadcrumb separator=">" font-bold>
            <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
              {{ item }}
            </a-breadcrumb-item>
          </a-breadcrumb>
          <TableRightToolbar
            v-model:filter-columns="dataStandardsfilterColumns"
            v-model:table-size="tableSize"
            :columns="dataStandardsColumns"
            @reset-query="initQuery"
          />
        </a-flex>

        <a-table
          row-key="id"
          :columns="dataStandardsColumns"
          :data-source="state.dataSource"
          :size="tableSize"
          :row-selection="rowSelection"
          :loading="state.loading"
          :scroll="{ y: 400 }"
          @resize-column="(w, col) => {
            col.width = w || 0;
          }"
        >
          <template #bodyCell="scope">
            <template v-if="scope.column.dataIndex === 'status'" />

            <template v-if="scope.column.dataIndex === 'action'">
              <div flex>
                <a-button type="link" size="small" @click="handleInfo(scope.record)">
                  详情
                </a-button>
                <a-button
                  v-if="hasAccess([AccessKey.EDIT])" type="link" size="small"
                  @click="handleUpdate(scope?.record)"
                >
                  编辑
                </a-button>
                <a-popconfirm
                  title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                  @confirm="handleDelete(scope.index, scope.record)"
                >
                  <a-button v-if="hasAccess([AccessKey.DEL])" type="link" size="small" danger>
                    删除
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>

        <a-button size="small" type="primary" mt-2 float-right>
          添加
        </a-button>
        <div style="clear: both;" />
        <a-alert v-if="visible" style="margin: 10px 0;" type="info" closable show-icon :after-close="handleClose">
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
        <a-table
          :columns="fileColumns" :data-source="data" :row-selection="rowSelection" :pagination="false" :scroll="{
            y: '400',
          }"
          size="small"
        />
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
        <a-table
          :columns="dataStandardsColumns" :data-source="data" :row-selection="rowSelection" :pagination="false"
          size="small"
        />
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup lang="ts">
import type { ConsultTableModel } from '@/api/list/table-list';
import DataStandardsTree from '@/pages/projectarchive/components/DataStandardsTree.vue';

defineOptions({ name: 'DataModal' });

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emits = defineEmits(['update:open', 'close']);
const openValue = useVModel(props, 'open', emits);
const breadcrumbs = ref<string[]>([]);

const dataStandardsTreeRef = ref();
const selectNode = ref<any>({});

// 数据标准列
const dataStandardsColumns = [
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

// 附件列
const fileColumns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    customRender: ({ index }: { index: number }) => {
      return index + 1;
    },
    width: 70,
    minWidth: 70,
    maxWidth: 120,
    disabled: true
  },
  {
    title: '附件名',
    dataIndex: 'fj',
    key: 'fj',
    width: 250,
    ellipsis: true,
    resizable: true
  },
  {
    title: '数据标准',
    dataIndex: 'type',
    key: 'type',
    width: 160,
    ellipsis: true
  },
  {
    title: '技术标准',
    dataIndex: 'jsbz',
    key: 'jsbz',
    width: 150,
    ellipsis: true
  },
  {
    title: '数量',
    dataIndex: 'num',
    key: 'num',
    width: 100
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

/**
 * 树节点选中事件
 */
function handleSelect({ info }: { info: any }) {
  console.log('handleSelect', info);

  if (info.node.dataRef.id) {
    breadcrumbs.value = info.node.dataRef.dataStandardsPath.split('/').filter(e => e);
    // catalog.form.parentName = info.node.dataRef.name;
    // catalog.form.pid = info.node.dataRef.id;
    // state.queryParams.dataStandardCatalogId = catalog.form.pid;
    // initQuery();
  }
}

function handle(record: ConsultTableModel) {
  ishow.value = true;
}

function handleClose() { }

// 向父组件发送事件
function handleOk() {
  emits('close');
};

function handleCancel() {
  emits('close');
}
</script>

<style lang="less" scoped></style>
