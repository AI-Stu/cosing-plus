<template>
  <page-container>
    <a-card mb-4>
      <a-form :label-col="{ span: 7 }" :model="state.queryParams">
        <a-row :gutter="[15, 0]">
          <a-col :span="8">
            <a-form-item label="${comment}" name="pid">
              <a-input v-model:value="state.queryParams.pid" placeholder="请输入${comment}" clearable @keyup.enter="initQuery" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否显示" name="isshow">
              <a-input v-model:value="state.queryParams.isshow" placeholder="请输入是否显示" clearable @keyup.enter="initQuery" />
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
          <a-button v-hasPermi="['projectarchive:catalog:add']" type="primary" @click="handleAdd">
            新增
          </a-button>
          <a-button v-hasPermi="['projectarchive:catalog:edit']" success :disabled="ids.length !== 1" @click="handleUpdate()">
            修改
          </a-button>
          <a-button v-hasPermi="['projectarchive:catalog:remove']" danger :disabled="!ids.length" @click="handleDelete()">
            删除
          </a-button>
          <a-button v-hasPermi="['projectarchive:catalog:export']" @click="handleExport">
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
          <template v-if="scope?.column?.dataIndex === 'pid'">
            <div flex gap-2>
              <span> {{ scope.record.pid }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'catalogname'">
            <div flex gap-2>
              <span> {{ scope.record.catalogname }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'catalogalias'">
            <div flex gap-2>
              <span> {{ scope.record.catalogalias }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'catalogcode'">
            <div flex gap-2>
              <span> {{ scope.record.catalogcode }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'isshow'">
            <div flex gap-2>
              <span> {{ scope.record.isshow }} </span>
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
              <a-button v-hasPermi="['projectarchive:catalog:edit']" type="link" @click="handleUpdate(scope?.record)">
                编辑
              </a-button>
              <a-popconfirm
                title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                @confirm="handleDelete(scope?.record)"
              >
                <a-button v-hasPermi="['projectarchive:catalog:remove']" type="link" danger>
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <!-- 添加或修改目录管理对话框 -->
    <a-modal v-model:open="modal.visible" :title="modal.title" @ok="submitForm" @cancel="handleCancel">
      <a-form ref="catalogFormRef" :model="formData" class="w-full" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="${comment}" name="pid">
          <a-input v-model:value="formData.pid" :maxlength="50" placeholder="请输入${comment}" />
        </a-form-item>
        <a-form-item label="是否显示" name="isshow">
          <a-input v-model:value="formData.isshow" :maxlength="50" placeholder="请输入是否显示" />
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
import { addCatalog, delCatalog, getCatalog, listCatalog, updateCatalog } from '@/api/projectarchive/catalog';
import type { CatalogForm, CatalogQuery, CatalogVO } from '@/api/projectarchive/catalog/types';

defineOptions({
  name: 'Catalog'
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
    title: '$comment',
    dataIndex: 'pid',
    resizable: true
  },
  {
    title: '名称',
    dataIndex: 'catalogname',
    resizable: true
  },
  {
    title: '别名',
    dataIndex: 'catalogalias',
    resizable: true
  },
  {
    title: '目录编号',
    dataIndex: 'catalogcode',
    resizable: true
  },
  {
    title: '是否显示',
    dataIndex: 'isshow',
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
  queryApi: listCatalog,
  queryParams: {
    pid: undefined,
    catalogname: undefined,
    catalogalias: undefined,
    catalogcode: undefined,
    isshow: undefined,
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

const catalogFormRef = ref<FormInstance>();

const modal = reactive({
  visible: false,
  title: ''
});

const initFormData: CatalogForm = {
  id: undefined,
  pid: undefined,
  catalogname: undefined,
  catalogalias: undefined,
  catalogcode: undefined,
  isshow: undefined,
  orderindex: undefined
};
const data = reactive<PageData<CatalogForm, CatalogQuery>>({
  formData: { ...initFormData },
  rules: {
    id: [
      { required: true, message: '$comment不能为空', trigger: 'blur' }
    ],
    pid: [
      { required: true, message: '$comment不能为空', trigger: 'blur' }
    ],
    catalogname: [
      { required: true, message: '名称不能为空', trigger: 'blur' }
    ],
    catalogalias: [
      { required: true, message: '别名不能为空', trigger: 'blur' }
    ],
    catalogcode: [
      { required: true, message: '目录编号不能为空', trigger: 'blur' }
    ],
    isshow: [
      { required: true, message: '是否显示不能为空', trigger: 'blur' }
    ],
    orderindex: [
      { required: true, message: '顺序不能为空', trigger: 'blur' }
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
  catalogFormRef.value?.resetFields();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  modal.visible = true;
  modal.title = '添加目录管理';
}

function handleInfo(row?: CatalogVO) {
  console.log(row);
}

/** 修改按钮操作 */
async function handleUpdate(row?: CatalogVO) {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getCatalog(_id);
  Object.assign(formData.value, res.data);
  modal.visible = true;
  modal.title = '修改目录管理';
}

/** 提交按钮 */
function submitForm() {
  catalogFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (formData.value.id) {
        await updateCatalog(formData.value).finally(() => buttonLoading.value = false);
      }
      else {
        await addCatalog(formData.value).finally(() => buttonLoading.value = false);
      }
      ElMessage.success('操作成功');
      modal.visible = false;
      await initQuery();
    }
  });
}

/** 删除按钮操作 */
async function handleDelete(row?: CatalogVO) {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm(`是否确认删除目录管理编号为"${_ids}"的数据项？`)
    .finally(() => loading.value = false);
  await delCatalog(_ids);
  ElMessage.success('删除成功');
  await initQuery();
}

/** 导出按钮操作 */
function handleExport() {
  useDownload('projectarchive/catalog/export', {
    ...toRaw(state.queryParams)
  }, `catalog_${new Date().getTime()}.xlsx`);
}

onMounted(() => {
  initQuery();
});
</script>
