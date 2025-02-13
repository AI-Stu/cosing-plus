<template>
  <a-modal v-model:open="openValue" title="选择数据清单" width="1300px" @cancel="emits('close')" @ok="handleOk">
    <a-row v-if="isAdd" :gutter="16" class="h-65vh overflow-hidden">
      <a-col :span="5">
        <DataStandardsTree
          ref="dataStandardsTreeRef"
          v-model="selectNode"
          class="d-border"
          :height="reactHeight"
          :add="false"
          @select="handleSelect"
        />
      </a-col>
      <a-col :span="19" class="overflow-y-auto h-full">
        <a-flex align="center" justify="space-between" class="mb-4">
          <a-breadcrumb separator=">" font-bold>
            <a-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
              {{ item }}
            </a-breadcrumb-item>
          </a-breadcrumb>
          <TableRightToolbar
            v-model:filter-columns="filterColumns"
            v-model:table-size="tableSize"
            v-model:loading="state.loading"
            :columns="columns"
            @reset-query="initQuery"
          />
        </a-flex>

        <a-table
          :row-key="PRIMARY_KEY"
          :columns="filterColumns"
          :data-source="state.dataSource"
          :pagination="state.pagination"
          :row-selection="rowSelection"
          :size="tableSize"
          :loading="state.loading"
          :scroll="{ y: 240 }"
          @resize-column="(w, col) => {
            col.width = w;
          }"
        >
          <template #bodyCell="scope">
            <template v-if="scope.column.dataIndex === 'action'">
              <div flex>
                <a-button type="link" size="small" @click="handleInfo(scope.record)">
                  详情
                </a-button>
              </div>
            </template>
          </template>
        </a-table>

        <a-button size="small" type="primary" mt-2 float-right @click="handleAddFileList">
          添加
        </a-button>
        <div style="clear: both;" />
        <a-alert style="margin: 10px 0;" type="info" closable show-icon :after-close="handleClose" size="small">
          <template #message>
            <div>共选择 {{ total.dataStandards }} 项标准，共需提交 {{ total.file }} 个文件</div>
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
          <a-button size="small" type="primary" danger @click="handleDelete">
            删除
          </a-button>
        </div>
        <a-table
          :row-key="PRIMARY_KEY"
          :columns="filterFileColumns"
          :data-source="fileState.dataSource"
          :row-selection="fileRowSelection"
          :pagination="false"
          :scroll="{
            y: 400,
          }"
          size="small"
          @resize-column="(w, col) => {
            col.width = w;
          }"
        >
          <template #bodyCell="scope">
            <template v-if="scope.column.dataIndex === 'action'">
              <div flex>
                <a-popconfirm
                  title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                  @confirm="handleRowDelete(scope.index, scope.record)"
                >
                  <a-button type="link" size="small" danger>
                    删除
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>
    <a-row v-else>
      <a-col :span="24">
        <a-breadcrumb separator=">" font-bold>
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
          :row-key="PRIMARY_KEY"
          :columns="filterFileColumns"
          :data-source="fileState.dataSource"
          :row-selection="fileRowSelection"
          :pagination="false"
          :scroll="{
            y: 400,
          }"
          size="small"
          @resize-column="(w, col) => {
            col.width = w;
          }"
        >
          <template #bodyCell="scope">
            <template v-if="scope.column.dataIndex === 'action'">
              <div flex>
                <a-popconfirm
                  title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                  @confirm="handleRowDelete(scope.index, scope.record)"
                >
                  <a-button type="link" size="small" danger>
                    删除
                  </a-button>
                </a-popconfirm>
              </div>
            </template>
          </template>
        </a-table>
      </a-col>
    </a-row>

    <!-- 添加或修改数据标准对话框 -->
    <a-modal v-model:open="modal.visible" :title="modal.title" @cancel="handleCancel" @ok="handleCancel">
      <a-form
        ref="dataStandardsFormRef"
        :model="formData" class="w-full"
        :rules="rules" :label-col="{ style: { width: '110px' } }"
        :wrapper-col="{ span: 24 }"
        :disabled="modal.disabled"
      >
        <a-form-item label="文档资料名称" name="name">
          <a-input v-model:value="formData.name" :maxlength="50" placeholder="文档资料名称" />
        </a-form-item>
        <a-form-item label="技术标准" name="skillStandards">
          <a-input v-model:value="formData.skillStandards" :maxlength="50" placeholder="请输入技术标准" />
        </a-form-item>
        <a-form-item label="数据类型" name="dataType">
          <a-select v-model:value="formData.dataType" placeholder="请选择数据类型" :options="dataTypeArr" />
        </a-form-item>
        <a-form-item label="资料类型" name="materialType">
          <a-select v-model:value="formData.materialType" placeholder="请选择数据类型" :options="materialTypeArr" />
        </a-form-item>
        <a-form-item label="数量" name="sl">
          <a-input v-model:value="formData.sl" :maxlength="50" placeholder="请输入数量" />
        </a-form-item>
        <a-form-item label="状态" name="stauts">
          <a-select v-model:value="formData.stauts" placeholder="请选择数据类型" :options="stautsArr" />
        </a-form-item>
        <a-form-item label="顺序" name="orderindex">
          <a-input-number v-model:value="formData.orderindex" :min="0" :max="9999" class="w-full" placeholder="请输入顺序" />
        </a-form-item>
      </a-form>
    </a-modal>
  </a-modal>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es';
import type { Key } from 'ant-design-vue/es/table/interface';
import { Api, type DataVo, columns, fileColumns, rules } from './data';
import AssociativeArray from '@/utils/AssociativeArray';
import DataStandardsTree from '@/pages/projectarchive/components/DataStandardsTree.vue';
import { TableRightToolbar } from '@/components/Table';

defineOptions({
  name: 'DataStandardsModal'
});
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  value: {
    type: Array,
    default: () => []
  },
  isAdd: {
    type: Boolean,
    default: true
  },
  breadcrumbs: {
    type: Array,
    default: () => []
  }
});

// 定义事件
const emits = defineEmits(['update:open', 'update:breadcrumbs', 'close', 'ok']);
const openValue = useVModel(props, 'open', emits);
const breadcrumbs = useVModel(props, 'breadcrumbs', emits);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const PRIMARY_KEY = 'dataStandardsId';
interface defineDataV0 extends DataVo {
  [PRIMARY_KEY]: string | number
  parentPath: string
}

const associativeArray = new AssociativeArray(); // 已选全部附件
const reactHeight = ref<number>(0);
const selectNode = ref<any>({});
const filterColumns = shallowRef(columns.filter((e: any) => !e.hide));
const filterFileColumns = shallowRef(fileColumns.filter((e: any) => !e.hide));
const tableSize = ref<('small' | 'middle' | 'large')>('small');

const dataStandardsFormRef = ref<FormInstance>();
const dataStandardsTreeRef = ref();
const formData = ref<DataVo>({});
const modal = reactive({
  visible: false,
  disabled: false,
  title: '添加数据标准'
});

const total = reactive({
  dataStandards: 0,
  file: 0
});

const { state, initQuery } = useTableQuery({
  queryApi: Api.LIST_API,
  queryOnMounted: false,
  queryParams: {
    dataStandardCatalogId: null
  },
  afterQuery: (res) => {
    res.forEach((e: any) => {
      e[PRIMARY_KEY] = e.id;
      e.parentPath = e.dataStandards.split('/').slice(0, -1).join('/') || '/';
      delete e.id;
    });

    console.log(res);

    return res;
  }
});

const { state: fileState } = useTableQuery({
  queryOnMounted: false
});

const rowSelection = ref({
  selectedRowKeys: [] as Key[],
  checkStrictly: false,
  onSelect: (record: any, selected: boolean, selectedRows: any[]) => {
    // console.log(record, selected, selectedRows);
    selected
      ? selectedRows.forEach((e) => {
          delete e.createTime;
          associativeArray.set(e[PRIMARY_KEY], toRaw(e));
        })
      : associativeArray.remove(record[PRIMARY_KEY]);
    rowSelection.value.selectedRowKeys = associativeArray.keys;
  },
  onSelectAll: (selected: boolean, selectedRows: any[], changeRows: any[]) => {
    // console.log(selected, selectedRows, changeRows);
    selected
      ? selectedRows.forEach((e) => {
          delete e.createTime;
          associativeArray.set(e[PRIMARY_KEY], toRaw(e));
        })
      : changeRows.forEach((e) => {
          associativeArray.remove(e[PRIMARY_KEY]);
        });
    rowSelection.value.selectedRowKeys = associativeArray.keys;
  }
});

const fileRowSelection = ref({
  selectedRowKeys: [] as Key[],
  checkStrictly: false,
  onChange: (changableRowKeys: Key[]) => {
    fileRowSelection.value.selectedRowKeys = changableRowKeys;
    console.log('selectedRowKeys changed: ', changableRowKeys);
  }
});

const dataTypeArr = [
  {
    'label': '文本',
    'value': '1'
  }
];
const materialTypeArr = [
  {
    'label': 'pdf',
    'value': 'pdf'
  },
  {
    'label': 'png',
    'value': 'png'
  }
];

const stautsArr = [
  {
    'label': '启用',
    'value': '1'
  },
  {
    'label': '不启用',
    'value': '0 '
  }
];

/**
 * 树节点选中事件
 */
function handleSelect({ info }: { info: any }) {
  if (info.node.dataRef.id) {
    state.queryParams.dataStandardCatalogId = info.node.dataRef.id;
    breadcrumbs.value = info.node.dataRef.dataStandardsPath.split('/').filter((e: string) => e);
    initQuery();
  }
}

/** 取消按钮 */
function handleCancel() {
  formData.value = {};
  dataStandardsFormRef.value?.resetFields();
  modal.visible = false;
}

function handleAddFileList() {
  fileState.dataSource = cloneDeep(associativeArray.values);
  total.dataStandards = fileState.dataSource.length;
  total.file = fileState.dataSource.reduce((a, b) => a + (b.sl || 0), 0);
}

/**
 * 删除功能
 */
async function handleDelete() {
  fileRowSelection.value.selectedRowKeys.forEach((e) => {
    const index = fileState.dataSource.findIndex(item => item[PRIMARY_KEY] === e);
    associativeArray.remove(e);
    fileState.dataSource.splice(index, 1);
  });
  rowSelection.value.selectedRowKeys = rowSelection.value.selectedRowKeys.filter(e => !fileRowSelection.value.selectedRowKeys.includes(e));
  fileRowSelection.value.selectedRowKeys = [];
  total.dataStandards = fileState.dataSource.length;
  total.file = fileState.dataSource.reduce((a, b) => a + (b.sl || 0), 0);
}

/**
 * row 行删除功能
 * @param index
 * @param row
 */
async function handleRowDelete(index: number, row: defineDataV0) {
  associativeArray.remove(row.id);
  fileState.dataSource.splice(index, 1);
  fileRowSelection.value.selectedRowKeys = fileRowSelection.value.selectedRowKeys.filter(e => e !== row[PRIMARY_KEY]);
  rowSelection.value.selectedRowKeys = rowSelection.value.selectedRowKeys.filter(e => e !== row[PRIMARY_KEY]);
  total.dataStandards = fileState.dataSource.length;
  total.file = fileState.dataSource.reduce((a, b) => a + (b.sl || 0), 0);
}

/**
 * 详情
 * @param row
 */
function handleInfo(row?: DataVo) {
  Object.assign(formData.value, row);
  modal.visible = true;
  modal.disabled = true;
  modal.title = '数据标准详情';
}

// 全部取消
function handleClose() {
  openValue.value = false;
  emits('close', fileState.dataSource);
}

// 向父组件发送事件
function handleOk() {
  openValue.value = false;
  emits('ok', fileState.dataSource);
};

onMounted(() => {
  reactHeight.value = proxy?.$el.offsetHeight;
});
</script>

<style lang="less" scoped>
.d-border{
  border-right: 1px solid var(--pro-ant-color-border);
}
</style>
