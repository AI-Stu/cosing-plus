<template>
  <page-container class="h-full" :is-full="true">
    <a-row :gutter="16" class="h-full">
      <a-col :span="4">
        <a-card size="small" class="h-full">
          <DataStandardsTree
            :height="reactHeight"
            @select="handleSelect"
            @add="catalog.visible = true;"
          />
        </a-card>
      </a-col>
      <a-col :span="20">
        <a-card class="h-full">
          <template #title>
            <a-space>
              <a-button type="primary" :icon="h(PlusOutlined)" @click="handleAdd">
                新增
              </a-button>
              <a-button v-if="hasAccess(['projectarchive:xmxxDataStandardsRel:edit'])" @click="handleImport">
                批量导入
              </a-button>
              <a-button v-if="hasAccess(['projectarchive:xmxxDataStandardsRel:export'])" @click="handleExport">
                批量导出
              </a-button>
            </a-space>
          </template>
          <template #extra>
            <TableRightToolbar
              v-model:filter-columns="filterColumns"
              :columns="columns"
              @size-change="(val: 'small' | 'middle' | 'large') => tableSize = val"
              @reset-query="initQuery"
            />
          </template>
          <!-- 数据标准列表 -->

          <a-table
            row-key="id"
            :columns="filterColumns"
            :data-source="state.dataSource"
            :size="tableSize"
            :loading="state.loading"
          >
            <template #bodyCell="scope">
              <template v-if="scope.column.dataIndex === 'status'" />

              <template v-if="scope.column.dataIndex === 'action'">
                <div flex>
                  <a-button type="link" @click="handleInfo(scope.record)">
                    详情
                  </a-button>
                  <a-button v-if="hasAccess(['projectarchive:xmxxDataStandardsRel:edit'])" type="link" @click="handleUpdate(scope?.record)">
                    编辑
                  </a-button>
                  <a-popconfirm
                    title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                    @confirm="handleDelete(scope.index, scope.record)"
                  >
                    <a-button v-if="hasAccess(['projectarchive:xmxxDataStandardsRel:remove'])" type="link" danger>
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
    <a-modal v-model:open="catalog.visible" title="添加数据标准目录" @ok="saveCatalog">
      <a-form :model="catalog.form" class="w-full" :label-col="labelCol">
        <a-form-item label="父目录名称" name="parentName" :rules="[{ required: true, message: '请选择父目录' }]">
          <a-input v-model:value="catalog.form.parentName" :maxlength="20" placeholder="" disabled />
        </a-form-item>
        <a-form-item label="目录名称" name="name" :rules="[{ required: true, message: '请输入目录名称' }]">
          <a-input v-model:value="catalog.form.name" :maxlength="20" placeholder="请输入目录名称" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加或修改数据标准对话框 -->
    <a-modal v-model:open="modal.visible" :title="modal.title" @ok="submitForm" @cancel="handleCancel">
      <a-form
        ref="dataStandardsFormRef" :model="formData" class="w-full" :rules="rules" :label-col="labelCol"
        :wrapper-col="{ span: 24 }" :disabled="modal.disabled"
      >
        <a-form-item label="文档资料名称" name="name">
          <a-input v-model:value="formData.name" :maxlength="50" placeholder="文档资料名称" />
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
import type { Rule } from 'ant-design-vue/es/form';
import type { DataStandardsVO } from '@/api/projectarchive/dataStandards/types';
import { addDataStandardsCatalogApi } from '@/api/projectarchive/dataStandardsCatalog';
import { addDataStandardsApi, delDataStandardsApi, listDataStandardsApi, updateDataStandardsApi } from '@/api/projectarchive/dataStandards';
import DataStandardsTree from '@/pages/projectarchive/components/DataStandardsTree.vue';

defineOptions({
  name: 'DataStandards'
});
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { hasAccess } = useAccess();
const message = useMessage();
const dictStore = useDictStore();

const reactHeight = ref<number>(0);

/**
 * 数据标准目录
 */
const catalog = reactive({
  visible: false,
  form: {
    pid: '',
    parentName: '',
    name: ''
  }
});
const labelCol = { style: { width: '110px' } };
const columns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    customRender: ({ index }: { index: number }) => {
      return index + 1;
    },
    width: 80,
    minWidth: 80,
    maxWidth: 120,
    disabled: true
  },
  {
    title: '应收文档资料',
    key: 'name',
    dataIndex: 'name',
    width: 250,
    resizable: true
  },
  {
    title: '技术标准',
    key: 'skillStandards',
    dataIndex: 'standared',
    width: 120,
    resizable: true
  },
  {
    title: '数据类型',
    key: 'dataType',
    dataIndex: 'dataType',
    width: 120
  },
  {
    title: '资料类型',
    key: 'materialType',
    dataIndex: 'materialType',
    width: 120,
    resizable: true
  },
  {
    title: '数量',
    key: 'sl',
    dataIndex: 'sl',
    width: 120
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    width: 140
  },
  {
    title: '状态',
    key: 'stauts',
    dataIndex: 'stauts',
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 120
  }
];
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: '文档资料名称不能为空', trigger: 'change' }
  ]

};

const filterColumns = ref(columns);
const tableSize = ref<('small' | 'middle' | 'large')>('large');

const dataStandardsFormRef = ref<FormInstance>();
const formData = ref<DataStandardsVO>({});
const modal = reactive({
  visible: false,
  disabled: false,
  title: '添加数据标准'
});

const { state, initQuery } = useTableQuery({
  queryApi: listDataStandardsApi,
  queryParams: {
    dataStandardCatalogId: null
  },
  beforeQuery: () => {
    state.queryParams = {
      dataStandardCatalogId: catalog.form.pid
    };
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

/** 新增目录 */
function saveCatalog() {
  addDataStandardsCatalogApi(catalog.form).then((res) => {
    catalog.visible = false;
    message.success('添加成功');
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
  formData.value.dataStandardCatalogId = catalog.form.pid;
  delete formData.value.createTime;
  if (formData.value.id) {
    await updateDataStandardsApi(formData.value);
    message.success('修改成功');
  }
  else {
    await addDataStandardsApi(formData.value);
    message.success('新增成功');
  }

  modal.visible = false;
  initQuery();
}

/** 导出按钮操作 */
function handleExport() {
  useDownload('projectarchive/xmxxDataStandardsRel/export', {
    ...toRaw(state.queryParams)
  }, `xmxxDataStandardsRel_${new Date().getTime()}.xlsx`);
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
function handleInfo(row?: DataStandardsVO) {
  Object.assign(formData.value, row);
  modal.visible = true;
  modal.disabled = true;
  modal.title = '修改数据详情';
}

/** 编辑按钮操作 */
async function handleUpdate(row: DataStandardsVO) {
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
async function handleDelete(index: number, row: DataStandardsVO) {
  if (row.id) {
    await delDataStandardsApi(row.id);
  }
  state.dataSource.splice(index, 1);
  message.success('删除成功');
}

onMounted(() => {
  reactHeight.value = proxy?.$el.offsetHeight;
});
</script>

<style lang="less" scoped>

</style>
