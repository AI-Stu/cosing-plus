<template>
  <a-modal v-model:open="openValue" title="选择数据清单" width="1300px" @cancel="emits('close')" @ok="handleOk">
    <a-row :gutter="16" class="h-65vh overflow-hidden">
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
            :columns="columns"
            @reset-query="initQuery"
          />
        </a-flex>

        <a-table
          row-key="id"
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
          <a-button size="small" type="primary" danger>
            删除
          </a-button>
        </div>
        <a-table
          row-key="id"
          :columns="filterFileColumns"
          :data-source="fileState.dataSource"
          :row-selection="rowSelection"
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
                  @confirm="handleDelete(scope.index, scope.record)"
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
import { Api, type DataVo, columns, fileColumns, rules } from './data';
import AssociativeArray from '@/utils/AssociativeArray';
import DataStandardsTree from '@/pages/projectarchive/components/DataStandardsTree.vue';

defineOptions({
  name: 'DataStandardsModal'
});
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emits = defineEmits(['update:open', 'close']);
const openValue = useVModel(props, 'open', emits);
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const associativeArray = new AssociativeArray();
const reactHeight = ref<number>(0);
const breadcrumbs = ref<string[]>([]);
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
    return res;
  }
});

const { state: fileState } = useTableQuery({
  queryOnMounted: false
});

const rowSelection = ref({
  checkStrictly: false,
  onSelect: (record: any, selected: boolean, selectedRows: any[]) => {
    // console.log(record, selected, selectedRows);
    selected
      ? selectedRows.forEach((e) => {
          associativeArray.set(e.id, toRaw(e));
        })
      : associativeArray.remove(record.id);
    console.log(associativeArray.values);
  },
  onSelectAll: (selected: boolean, selectedRows: any[], changeRows: any[]) => {
    // console.log(selected, selectedRows, changeRows);
    selected
      ? selectedRows.forEach((e) => {
          associativeArray.set(e.id, toRaw(e));
        })
      : changeRows.forEach((e) => {
          associativeArray.remove(e.id);
        });
    console.log(associativeArray.values);
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
 * @param index
 * @param row
 */
async function handleDelete(index: number, row: DataVo) {
  // associativeArray.remove(row.id);
  fileState.dataSource.splice(index, 1);
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

function handleClose() { }

// 向父组件发送事件
function handleOk() {
  emits('close', fileState.dataSource);
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
