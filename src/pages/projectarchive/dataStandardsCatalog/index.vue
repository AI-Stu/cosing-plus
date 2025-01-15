<template>
  <page-container>
    <a-card mb-4>
      <a-form :label-col="{ span: 7 }" :model="state.queryParams">
        <a-row :gutter="[15, 0]">
          <a-col :span="8">
            <a-form-item label="父id" name="pid">
              <a-input v-model:value="state.queryParams.pid" placeholder="请输入父id" clearable @keyup.enter="initQuery" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="顺序" name="orderindex">
              <a-input v-model:value="state.queryParams.orderindex" placeholder="请输入顺序" clearable @keyup.enter="initQuery" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :span="24" style="text-align: right">
          <a-col :span="24">
            <a-space flex justify-end w-full>
              <a-button :loading="loading" type="primary" @click="initQuery">
                查询
              </a-button>
              <a-button :loading="loading" @click="resetQuery">
                重置
              </a-button>
              <a-button type="link" @click="expand = !expand">
                {{ expand ? '收起' : '展开' }}
                <UpOutlined v-if="expand" />
                <DownOutlined v-else />
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-card>
      <template #title>
        <a-space size="middle">
          <a-button v-hasPermi="['projectarchive:dataStandardsCatalog:add']" type="primary" @click="handleAdd">
            新增
          </a-button>
          <a-button v-hasPermi="['projectarchive:dataStandardsCatalog:edit']" success :disabled="ids.length !== 1" @click="handleUpdate()">
            修改
          </a-button>
          <a-button v-hasPermi="['projectarchive:dataStandardsCatalog:remove']" danger :disabled="!ids.length" @click="handleDelete()">
            删除
          </a-button>
          <a-button v-hasPermi="['projectarchive:dataStandardsCatalog:export']" @click="handleExport">
            导出
          </a-button>
        </a-space>
      </template>
      <template #extra>
        <TableRightToolbar
          v-model:filter-columns="filterColumns"
          v-model:table-size="tableSize"
          :columns="columns"
          @reset-query="initQuery"
        />
      </template>

      <a-table
        row-key="id"
        :row-selection="state.rowSelections"
        :loading="state.loading" :columns="filterColumns"
        :data-source="state.dataSource"
        :pagination="state.pagination"
        :size="tableSize"
        @resize-column="(w, col) => {
          col.width = w;
        }"
      >
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'id'">
            <span> {{ scope.record.id }} </span>
          </template>
          <template v-if="scope?.column?.dataIndex === 'pid'">
            <div flex gap-2>
              <span> {{ scope.record.pid }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'name'">
            <div flex gap-2>
              <span> {{ scope.record.name }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'orderindex'">
            <div flex gap-2>
              <span> {{ scope.record.orderindex }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'dataStandardsPath'">
            <div flex gap-2>
              <span> {{ scope.record.dataStandardsPath }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex>
              <a-button type="link" @click="handleInfo(scope?.record)">
                详情
              </a-button>
              <a-button v-hasPermi="['projectarchive:dataStandardsCatalog:edit']" type="link" @click="handleUpdate(scope?.record)">
                编辑
              </a-button>
              <a-popconfirm
                title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                @confirm="handleDelete(scope?.record)"
              >
                <a-button v-hasPermi="['projectarchive:dataStandardsCatalog:remove']" type="link" danger>
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <!-- 添加或修改数据标准目录对话框 -->
    <a-modal v-model:open="modal.visible" :title="modal.title" @ok="submitForm" @cancel="handleCancel">
      <a-form ref="dataStandardsCatalogFormRef" :model="formData" class="w-full" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="父id" name="pid">
          <a-input v-model:value="formData.pid" :maxlength="50" placeholder="请输入父id" />
        </a-form-item>
        <a-form-item label="顺序" name="orderindex">
          <a-input v-model:value="formData.orderindex" :maxlength="50" placeholder="请输入顺序" />
        </a-form-item>
      </a-form>
    </a-modal>
  </page-container>
</template>

<script setup lang="ts">
import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
import type { FormInstance } from 'ant-design-vue';
import { addDataStandardsCatalogApi, delDataStandardsCatalogApi, getDataStandardsCatalogApi, listDataStandardsCatalogApi, updateDataStandardsCatalogApi } from '@/api/projectarchive/dataStandardsCatalog';
import type { DataStandardsCatalogForm, DataStandardsCatalogQuery, DataStandardsCatalogVO } from '@/api/projectarchive/dataStandardsCatalog/types';

defineOptions({
  name: 'DataStandardsCatalog'
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const ElMessage = useMessage();

const dictStore = useDictStore();
// const { } = toRefs<any>(dictStore.getDictByKey());

// 表格列
const columns = [
  {
    title: '$comment',
    dataIndex: 'id',
    resizable: true
  },
  {
    title: '父id',
    dataIndex: 'pid',
    resizable: true
  },
  {
    title: '标准名称',
    dataIndex: 'name',
    resizable: true
  },
  {
    title: '顺序',
    dataIndex: 'orderindex',
    resizable: true
  },
  {
    title: '租户号',
    dataIndex: 'tenantId',
    resizable: true
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    resizable: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    resizable: true
  },
  {
    title: '更新人',
    dataIndex: 'updateBy',
    resizable: true
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    resizable: true
  },
  {
    title: '$comment',
    dataIndex: 'dataStandardsPath',
    resizable: true
  }
];
const filterColumns = shallowRef(columns.filter((e: any) => !e.hide));
const tableSize = ref<('small' | 'middle' | 'large')>('large');
const buttonLoading = ref(false);
const loading = ref(true);
const expand = ref(false);
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 24 };

const { state, initQuery, resetQuery, query } = useTableQuery({
  queryApi: listDataStandardsCatalogApi,
  queryParams: {
    pid: undefined,
    name: undefined,
    orderindex: undefined,
    dataStandardsPath: undefined
  },
  beforeQuery: () => {

  },
  afterQuery: (res) => {
    return res;
  }
});

const ids = computed(() => state.rowSelections.selectedRows.map(item => item.id));

const dataStandardsCatalogFormRef = ref<FormInstance>();

const modal = reactive({
  visible: false,
  title: ''
});

const initFormData: DataStandardsCatalogForm = {
  id: undefined,
  pid: undefined,
  name: undefined,
  orderindex: undefined,
  dataStandardsPath: undefined
};
const data = reactive<PageData<DataStandardsCatalogForm, DataStandardsCatalogQuery>>({
  formData: { ...initFormData },
  rules: {
    id: [
      { required: true, message: '$comment不能为空', trigger: 'blur' }
    ],
    dataStandardsPath: [
      { required: true, message: '$comment不能为空', trigger: 'blur' }
    ]
  }
});

const { queryParams, formData, rules } = toRefs(data);

/** 取消按钮 */
function handleCancel() {
  reset();
  modal.visible = false;
}

/** 表单重置 */
function reset() {
  formData.value = { ...initFormData };
  dataStandardsCatalogFormRef.value?.resetFields();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  modal.visible = true;
  modal.title = '添加数据标准目录';
}

function handleInfo(row?: DataStandardsCatalogVO) {
  console.log(row);
}

/** 修改按钮操作 */
async function handleUpdate(row?: DataStandardsCatalogVO) {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getDataStandardsCatalogApi(_id);
  Object.assign(formData.value, res.data);
  modal.visible = true;
  modal.title = '修改数据标准目录';
}

/** 提交按钮 */
function submitForm() {
  dataStandardsCatalogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (formData.value.id) {
        await updateDataStandardsCatalogApi(formData.value).finally(() => buttonLoading.value = false);
      }
      else {
        await addDataStandardsCatalogApi(formData.value).finally(() => buttonLoading.value = false);
      }
      ElMessage.success('操作成功');
      modal.visible = false;
      await initQuery();
    }
  });
}

/** 删除按钮操作 */
async function handleDelete(row?: DataStandardsCatalogVO) {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm(`是否确认删除数据标准目录编号为"${_ids}"的数据项？`)
    .finally(() => loading.value = false);
  await delDataStandardsCatalogApi(_ids);
  ElMessage.success('删除成功');
  await initQuery();
}

/** 导出按钮操作 */
function handleExport() {
  useDownload('projectarchive/dataStandardsCatalog/export', {
    ...toRaw(state.queryParams)
  }, `dataStandardsCatalog_${new Date().getTime()}.xlsx`);
}

onMounted(() => {
  initQuery();
});
</script>
