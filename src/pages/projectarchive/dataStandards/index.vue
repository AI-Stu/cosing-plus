<template>
  <page-container class="h-full" :is-full="true">
    <a-row :gutter="16" class="h-full">
      <a-col :span="4">
        <a-card size="small" class="h-full">
          <DataStandardsTree
            ref="dataStandardsTreeRef"
            v-model="selectNode"
            :height="reactHeight"
            @select="handleSelect"
            @add="addStandardsCatalog"
          />
        </a-card>
      </a-col>
      <a-col :span="20">
        <a-card class="h-full">
          <template #title>
            <a-space>
              <a-button v-if="hasAccess([AccessKey.ADD])" type="primary" :icon="h(PlusOutlined)" @click="handleAdd">
                新增
              </a-button>
              <a-button v-if="hasAccess([AccessKey.EDIT])" @click="handleImport">
                批量导入
              </a-button>
              <a-button v-if="hasAccess([AccessKey.EXPORT])" @click="handleExport">
                批量导出
              </a-button>
            </a-space>
          </template>
          <template #extra>
            <TableRightToolbar
              v-model:filter-columns="filterColumns"
              v-model:table-size="tableSize"
              v-model:loading="state.loading"
              :columns="columns"
              @reset-query="initQuery"
            />
          </template>
          <!-- 数据标准列表 -->

          <a-table
            row-key="id"
            :columns="filterColumns"
            :data-source="state.dataSource"
            :pagination="state.pagination"
            :size="tableSize"
            :loading="state.loading"
            :scroll="{ y: reactHeight - 56 - 48 - 76 }"
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
        </a-card>
      </a-col>
    </a-row>

    <!-- 添加目录对话框 -->
    <a-modal
      v-model:open="catalog.visible"
      title="添加数据标准目录"
      :ok-button-props="{
        disabled: loading.isButton,
      }"
      @ok="saveCatalog"
    >
      <a-form :model="catalog.form" class="w-full" :label-col="labelCol">
        <a-form-item label="父目录名称" name="parentName" :rules="[{ required: true, message: '请选择父目录' }]">
          <a-input v-model:value="catalog.form.parentName" :maxlength="20" placeholder="" disabled />
        </a-form-item>
        <a-form-item label="目录名称" name="name" :rules="[{ required: true, message: '请输入目录名称' }]">
          <a-input v-model:value="catalog.form.name" :maxlength="20" placeholder="请输入目录名称" />
        </a-form-item>
        <a-form-item label="顺序" name="orderindex" :rules="[{ required: true, message: '请输入顺序' }]">
          <a-input-number v-model:value="catalog.form.orderindex" :min="0" :max="9999" class="w-full" placeholder="请输入顺序" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加或修改数据标准对话框 -->
    <a-modal
      v-model:open="modal.visible" :title="modal.title"
      :ok-button-props="{
        disabled: loading.isButton,
      }"
      @ok="submitForm" @cancel="handleCancel"
    >
      <a-form
        ref="dataStandardsFormRef"
        :model="formData" class="w-full"
        :rules="rules" :label-col="labelCol"
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
  </page-container>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { AccessKey, Api, type DataVo, columns, rules } from './data';
import DataStandardsTree from '@/pages/projectarchive/components/DataStandardsTree.vue';

defineOptions({
  name: 'DataStandards'
});
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { hasAccess } = useAccess();
const message = useMessage();
const dictStore = useDictStore();

const reactHeight = ref<number>(0);

const loading = reactive({
  isButton: false
});

/**
 * 数据标准目录
 */
const catalog = reactive({
  visible: false,
  form: {
    pid: '',
    parentName: '',
    name: '',
    orderindex: 1
  }
});
const selectNode = ref<any>({});
const labelCol = { style: { width: '110px' } };
const filterColumns = shallowRef(columns.filter((e: any) => !e.hide));
const tableSize = ref<('small' | 'middle' | 'large')>('small');

const dataStandardsFormRef = ref<FormInstance>();
const dataStandardsTreeRef = ref();
const formData = ref<DataVo>({});
const modal = reactive({
  visible: false,
  disabled: false,
  title: '添加数据标准'
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

function addStandardsCatalog() {
  catalog.visible = true;
}

/** 新增目录 */
async function saveCatalog() {
  loading.isButton = true;
  await Api.ADD_CATALOG_API(catalog.form).finally(() => {
    loading.isButton = false;
  });
  catalog.visible = false;
  message.success('添加成功');
  Api.LIST_CATALOG_API({
    pid: catalog.form.pid,
    pageNum: 1,
    pageSize: 2000
  }).then(({ rows }) => {
    selectNode.value.node.dataRef.children = rows.map((item: any) => ({
      key: item.id,
      title: item.name,
      ...item
    }));
    // dataStandardsTreeRef.value?.addNode(catalog.form.pid, rows);
  });
}

/**
 * 树节点选中事件
 */
function handleSelect({ info }: { info: any }) {
  if (info.node.dataRef.id) {
    catalog.form.parentName = info.node.dataRef.name;
    catalog.form.pid = info.node.dataRef.id;
    state.queryParams.dataStandardCatalogId = catalog.form.pid;
    initQuery();
  }
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  modal.visible = true;
  modal.disabled = false;
  modal.title = '添加数据标准';
}

/** 提交按钮 */
async function submitForm() {
  if (!modal.disabled) {
    formData.value.dataStandardCatalogId = catalog.form.pid;
    delete formData.value.createTime;
    loading.isButton = true;
    if (formData.value.id) {
      await Api.UPDATE_API(formData.value).finally(() => {
        loading.isButton = false;
      });
      message.success('修改成功');
    }
    else {
      await Api.ADD_API(formData.value).finally(() => {
        loading.isButton = false;
      });
      message.success('新增成功');
    }
    initQuery();
  }
  modal.visible = false;
}

/** 导出按钮操作 */
function handleExport() {
  useDownload(Api.DOWNLOAD, { ...toRaw(state.queryParams) }, `数据标准_${new Date().getTime()}.xlsx`);
}

/** 导入按钮操作 */
function handleImport() {

}

/** 取消按钮 */
function handleCancel() {
  reset();
  modal.visible = false;
}

/** 表单重置 */
function reset() {
  formData.value = {};
  dataStandardsFormRef.value?.resetFields();
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

/** 编辑按钮操作 */
async function handleUpdate(row: DataVo) {
  reset();
  Object.assign(formData.value, row);
  modal.visible = true;
  modal.disabled = false;
  modal.title = '修改数据标准';
}

/**
 * 删除功能
 * @param index
 * @param row
 */
async function handleDelete(index: number, row: DataVo) {
  if (row.id) {
    await Api.DEL_API(row.id);
  }
  state.dataSource.splice(index, 1);
  message.success('删除成功');
}

onMounted(() => {
  reactHeight.value = proxy?.$el.offsetHeight;
});
</script>

<style lang="less" scoped></style>
