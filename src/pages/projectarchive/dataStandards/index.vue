<template>
  <page-container>
    <a-card mb-4>
      <a-form :label-col="{ span: 7 }" :model="state.queryParams">
        <a-row :gutter="[15, 0]">
          <a-col :span="8">
            <a-form-item label="数据标准目录id" name="dataStandardCatalogId">
              <a-input v-model:value="state.queryParams.dataStandardCatalogId" placeholder="请输入数据标准目录id" clearable @keyup.enter="initQuery" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="数据类型" name="dataType">
              <a-select v-model:value="state.queryParams.dataType" placeholder="请选择数据类型" clearable>
                <a-select-option v-for="dict in hnt_type" :key="dict.value" :label="dict.label" :value="dict.value" />
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="数量" name="sl">
              <a-input v-model:value="state.queryParams.sl" placeholder="请输入数量" clearable @keyup.enter="initQuery" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="状态" name="stauts">
              <a-input v-model:value="state.queryParams.stauts" placeholder="请输入状态" clearable @keyup.enter="initQuery" />
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
          <a-button v-hasPermi="['projectarchive:dataStandards:add']" type="primary" @click="handleAdd">
            新增
          </a-button>
          <a-button v-hasPermi="['projectarchive:dataStandards:edit']" success :disabled="ids.length !== 1" @click="handleUpdate()">
            修改
          </a-button>
          <a-button v-hasPermi="['projectarchive:dataStandards:remove']" danger :disabled="!ids.length" @click="handleDelete()">
            删除
          </a-button>
          <a-button v-hasPermi="['projectarchive:dataStandards:export']" @click="handleExport">
            导出
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
          <template v-if="scope?.column?.dataIndex === 'dataStandardCatalogId'">
            <div flex gap-2>
              <span> {{ scope.record.dataStandardCatalogId }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'name'">
            <div flex gap-2>
              <span> {{ scope.record.name }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'dataType'">
            <div flex gap-2>
              <DictTag :options="hnt_type" :value="scope.record.dataType" />
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'skillStandards'">
            <div flex gap-2>
              <span> {{ scope.record.skillStandards }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'materialType'">
            <div flex gap-2>
              <span> {{ scope.record.materialType }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'dataStandards'">
            <div flex gap-2>
              <span> {{ scope.record.dataStandards }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'sl'">
            <div flex gap-2>
              <span> {{ scope.record.sl }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'stauts'">
            <div flex gap-2>
              <span> {{ scope.record.stauts }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'orderindex'">
            <div flex gap-2>
              <span> {{ scope.record.orderindex }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex>
              <a-button type="link" @click="handleInfo(scope?.record)">
                详情
              </a-button>
              <a-button v-hasPermi="['projectarchive:dataStandards:edit']" type="link" @click="handleUpdate(scope?.record)">
                编辑
              </a-button>
              <a-popconfirm
                title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                @confirm="handleDelete(scope?.record)"
              >
                <a-button v-hasPermi="['projectarchive:dataStandards:remove']" type="link" danger>
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <!-- 添加或修改数据标准对话框 -->
    <a-modal v-model:open="modal.visible" :title="modal.title" @ok="submitForm" @cancel="handleCancel">
      <a-form ref="dataStandardsFormRef" :model="formData" class="w-full" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="数据标准目录id" name="dataStandardCatalogId">
          <a-input v-model:value="formData.dataStandardCatalogId" :maxlength="50" placeholder="请输入数据标准目录id" />
        </a-form-item>
        <a-form-item label="数据类型" name="dataType">
          <a-select v-model:value="formData.dataType" placeholder="请选择数据类型">
            <a-select-option
              v-for="dict in hnt_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </a-select>
        </a-form-item>
        <a-form-item label="数量" name="sl">
          <a-input v-model:value="formData.sl" :maxlength="50" placeholder="请输入数量" />
        </a-form-item>
        <a-form-item label="状态" name="stauts">
          <a-input v-model:value="formData.stauts" :maxlength="50" placeholder="请输入状态" />
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
import { addDataStandards, delDataStandards, getDataStandards, listDataStandards, updateDataStandards } from '@/api/projectarchive/dataStandards';
import type { DataStandardsForm, DataStandardsQuery, DataStandardsVO } from '@/api/projectarchive/dataStandards/types';

defineOptions({
  name: 'DataStandards'
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const ElMessage = useMessage();

const dictStore = useDictStore();
const { hnt_type } = toRefs<any>(dictStore.getDictByKey('hnt_type'));

// 表格列
const columns = [
  {
    title: '$comment',
    dataIndex: 'id',
    resizable: true
  },
  {
    title: '数据标准目录id',
    dataIndex: 'dataStandardCatalogId',
    resizable: true
  },
  {
    title: '标准名称',
    dataIndex: 'name',
    resizable: true
  },
  {
    title: '数据类型',
    dataIndex: 'dataType',
    resizable: true
  },
  {
    title: '技术标准',
    dataIndex: 'skillStandards',
    resizable: true
  },
  {
    title: '资料类型',
    dataIndex: 'materialType',
    resizable: true
  },
  {
    title: '数据标准',
    dataIndex: 'dataStandards',
    resizable: true
  },
  {
    title: '数量',
    dataIndex: 'sl',
    resizable: true
  },
  {
    title: '状态',
    dataIndex: 'stauts',
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
  }
];
const filterColumns = ref(columns);
const tableSize = ref<('small' | 'middle' | 'large')>('large');
const buttonLoading = ref(false);
const loading = ref(true);
const expand = ref(false);
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 24 };

const { state, initQuery, resetQuery, query } = useTableQuery({
  queryApi: listDataStandards,
  queryParams: {
    dataStandardCatalogId: undefined,
    name: undefined,
    dataType: undefined,
    skillStandards: undefined,
    materialType: undefined,
    dataStandards: undefined,
    sl: undefined,
    stauts: undefined,
    orderindex: undefined
  },
  beforeQuery: () => {

  },
  afterQuery: (res) => {
    console.log(res);
    return res;
  }
});

const ids = computed(() => state.rowSelections.selectedRows.map(item => item.id));

const dataStandardsFormRef = ref<FormInstance>();

const modal = reactive({
  visible: false,
  title: ''
});

const initFormData: DataStandardsForm = {
  id: undefined,
  dataStandardCatalogId: undefined,
  name: undefined,
  dataType: undefined,
  skillStandards: undefined,
  materialType: undefined,
  dataStandards: undefined,
  sl: undefined,
  stauts: undefined,
  orderindex: undefined
};
const data = reactive<PageData<DataStandardsForm, DataStandardsQuery>>({
  formData: { ...initFormData },
  rules: {
    id: [
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
  dataStandardsFormRef.value?.resetFields();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  modal.visible = true;
  modal.title = '添加数据标准';
}

function handleInfo(row?: DataStandardsVO) {
  console.log(row);
}

/** 修改按钮操作 */
async function handleUpdate(row?: DataStandardsVO) {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getDataStandards(_id);
  Object.assign(formData.value, res.data);
  modal.visible = true;
  modal.title = '修改数据标准';
}

/** 提交按钮 */
function submitForm() {
  dataStandardsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (formData.value.id) {
        await updateDataStandards(formData.value).finally(() => buttonLoading.value = false);
      }
      else {
        await addDataStandards(formData.value).finally(() => buttonLoading.value = false);
      }
      ElMessage.success('操作成功');
      modal.visible = false;
      await initQuery();
    }
  });
}

/** 删除按钮操作 */
async function handleDelete(row?: DataStandardsVO) {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm(`是否确认删除数据标准编号为"${_ids}"的数据项？`)
    .finally(() => loading.value = false);
  await delDataStandards(_ids);
  ElMessage.success('删除成功');
  await initQuery();
}

/** 导出按钮操作 */
function handleExport() {
  useDownload('projectarchive/dataStandards/export', {
    ...toRaw(state.queryParams)
  }, `dataStandards_${new Date().getTime()}.xlsx`);
}

onMounted(() => {
  initQuery();
});
</script>
