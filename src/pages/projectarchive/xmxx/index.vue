<template>
  <page-container>
    <a-card mb-4>
      <a-form :label-col="{ span: 7 }" :model="state.queryParams">
        <a-row :gutter="[15, 0]">
          <a-col :span="8">
            <a-form-item label="父目录id" name="pid">
              <a-input
                v-model:value="state.queryParams.pid" placeholder="请输入父目录id" clearable
                @keyup.enter="initQuery"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="是否关联项目" name="isrelxm">
              <a-input
                v-model:value="state.queryParams.isrelxm" placeholder="请输入是否关联项目" clearable
                @keyup.enter="initQuery"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="文件大小" name="fileSize">
              <a-input
                v-model:value="state.queryParams.fileSize" placeholder="请输入文件大小" clearable
                @keyup.enter="initQuery"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="顺序" name="orderindex">
              <a-input
                v-model:value="state.queryParams.orderindex" placeholder="请输入顺序" clearable
                @keyup.enter="initQuery"
              />
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
          <a-button v-hasPermi="['projectarchive:dataStorage:add']" type="primary" @click="handleAdd">
            新增
          </a-button>
          <a-button
            v-hasPermi="['projectarchive:dataStorage:edit']" success :disabled="ids.length !== 1"
            @click="handleUpdate()"
          >
            修改
          </a-button>
          <a-button
            v-hasPermi="['projectarchive:dataStorage:remove']" danger :disabled="!ids.length"
            @click="handleDelete()"
          >
            删除
          </a-button>
          <a-button v-hasPermi="['projectarchive:dataStorage:export']" @click="handleExport">
            导出
          </a-button>
        </a-space>
      </template>
      <template #extra>
        <TableRightToolbar
          v-model:filter-columns="filterColumns" :columns="columns"
          @size-change="(val: 'small' | 'middle' | 'large') => tableSize = val" @reset-query="initQuery"
        />
      </template>

      <a-table
        row-key="id" :row-selection="state.rowSelections" :loading="state.loading" :columns="filterColumns"
        :data-source="state.dataSource" :pagination="state.pagination" :size="tableSize" @resize-column="(w, col) => {
          col.width = w;
        }"
      >
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'id'">
            <span> {{ scope.record.id }} </span>
          </template>
          <template v-if="scope?.column?.dataIndex === 'name'">
            <div flex gap-2>
              <span> {{ scope.record.name }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'pid'">
            <div flex gap-2>
              <span> {{ scope.record.pid }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'isfile'">
            <div flex gap-2>
              <span> {{ scope.record.isfile }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'isrelxm'">
            <div flex gap-2>
              <span> {{ scope.record.isrelxm }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'ispublish'">
            <div flex gap-2>
              <span> {{ scope.record.ispublish }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'fileSize'">
            <div flex gap-2>
              <span> {{ scope.record.fileSize }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'fileType'">
            <div flex gap-2>
              <span> {{ scope.record.fileType }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'fileSuffix'">
            <div flex gap-2>
              <span> {{ scope.record.fileSuffix }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'filePath'">
            <div flex gap-2>
              <span> {{ scope.record.filePath }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'orderindex'">
            <div flex gap-2>
              <span> {{ scope.record.orderindex }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex>
              <a-button type="link" @click="handleInfo(scope?.record as DataStorageVO)">
                详情
              </a-button>
              <a-button
                v-hasPermi="['projectarchive:dataStorage:edit']" type="link"
                @click="handleUpdate(scope?.record as DataStorageVO)"
              >
                编辑
              </a-button>
              <a-popconfirm title="确定删除该条数据？" ok-text="确定" cancel-text="取消" @confirm="handleDelete(scope?.record as DataStorageVO)">
                <a-button v-hasPermi="['projectarchive:dataStorage:remove']" type="link" danger>
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <!-- 添加或修改数据存储管理对话框 -->
    <a-modal v-model:open="modal.visible" :title="modal.title" @ok="submitForm" @cancel="handleCancel">
      <a-form
        ref="dataStorageFormRef" :model="formData" class="w-full" :rules="rules" :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="父目录id" name="pid">
          <a-input v-model:value="formData.pid" :maxlength="50" placeholder="请输入父目录id" />
        </a-form-item>
        <a-form-item label="是否文件" name="isfile">
          <FileUpload v-model:value="formData.isfile" />
        </a-form-item>
        <a-form-item label="是否关联项目" name="isrelxm">
          <a-input v-model:value="formData.isrelxm" :maxlength="50" placeholder="请输入是否关联项目" />
        </a-form-item>
        <a-form-item label="文件大小" name="fileSize">
          <a-input v-model:value="formData.fileSize" :maxlength="50" placeholder="请输入文件大小" />
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
import { addDataStorage, delDataStorage, getDataStorage, listDataStorage, updateDataStorage } from '@/api/projectarchive/dataStorage';
import type { DataStorageForm, DataStorageQuery, DataStorageVO } from '@/api/projectarchive/dataStorage/types';

defineOptions({
  name: 'DataStorage'
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const ElMessage = useMessage();

const dictStore = useDictStore();
// const { } = toRefs<any>(dictStore.getDictByKey());

// 表格列
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    resizable: true,
    width: '100px'
  },
  {
    title: '目录名称',
    dataIndex: 'name',
    resizable: true,
    width: '200px'
  },
  {
    title: '父目录id',
    dataIndex: 'pid',
    resizable: true,
    width: '140px'
  },
  {
    title: '是否文件',
    dataIndex: 'isfile',
    resizable: true,
    width: '100px'
  },
  {
    title: '是否关联项目',
    dataIndex: 'isrelxm',
    resizable: true,
    width: '100px'
  },
  {
    title: '是否发布服务',
    dataIndex: 'ispublish',
    resizable: true,
    width: '100px'
  },
  {
    title: '文件大小',
    dataIndex: 'fileSize',
    resizable: true,
    width: '100px'
  },
  {
    title: '文件类型',
    dataIndex: 'fileType',
    resizable: true,
    width: '100px'
  },
  {
    title: '文件后缀',
    dataIndex: 'fileSuffix',
    resizable: true,
    width: '100px'
  },
  {
    title: '文件路径',
    dataIndex: 'filePath',
    resizable: true,
    width: '100px'
  },
  {
    title: '顺序',
    dataIndex: 'orderindex',
    resizable: true,
    width: '100px'
  },
  {
    title: '租户号',
    dataIndex: 'tenantId',
    resizable: true,
    width: '100px'
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    resizable: true,
    width: '100px'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    resizable: true,
    width: '100px'
  },
  {
    title: '更新人',
    dataIndex: 'updateBy',
    resizable: true,
    width: '100px'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    resizable: true,
    width: '100px'
  }
];
const filterColumns = ref(columns);
const tableSize = ref<('small' | 'middle' | 'large')>('large');
const buttonLoading = ref(false);
const loading = ref(true);
const expand = ref(false);
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 24 };

const { state, initQuery, resetQuery } = useTableQuery({
  queryApi: listDataStorage,
  queryParams: {
    name: undefined,
    pid: undefined,
    isfile: undefined,
    isrelxm: undefined,
    ispublish: undefined,
    fileSize: undefined,
    fileType: undefined,
    fileSuffix: undefined,
    filePath: undefined,
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

const dataStorageFormRef = ref<FormInstance>();

const modal = reactive({
  visible: false,
  title: ''
});

const initFormData: DataStorageForm = {
  id: undefined,
  name: undefined,
  pid: undefined,
  isfile: undefined,
  isrelxm: undefined,
  ispublish: undefined,
  fileSize: undefined,
  fileType: undefined,
  fileSuffix: undefined,
  filePath: undefined,
  orderindex: undefined
};
const data = reactive<PageData<DataStorageForm, DataStorageQuery>>({
  formData: { ...initFormData },
  rules: {
    id: [
      { required: true, message: 'ID不能为空', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '目录名称不能为空', trigger: 'blur' }
    ],
    pid: [
      { required: true, message: '父目录id不能为空', trigger: 'blur' }
    ],
    isfile: [
      { required: true, message: '是否文件不能为空', trigger: 'blur' }
    ],
    isrelxm: [
      { required: true, message: '是否关联项目不能为空', trigger: 'blur' }
    ],
    ispublish: [
      { required: true, message: '是否发布服务不能为空', trigger: 'blur' }
    ],
    fileSize: [
      { required: true, message: '文件大小不能为空', trigger: 'blur' }
    ],
    fileType: [
      { required: true, message: '文件类型不能为空', trigger: 'change' }
    ],
    fileSuffix: [
      { required: true, message: '文件后缀不能为空', trigger: 'blur' }
    ],
    filePath: [
      { required: true, message: '文件路径不能为空', trigger: 'blur' }
    ],
    orderindex: [
      { required: true, message: '顺序不能为空', trigger: 'blur' }
    ]
  }
});

const { formData, rules } = toRefs<PageData<DataStorageForm, DataStorageQuery>>(data);

/** 取消按钮 */
function handleCancel() {
  reset();
  modal.visible = false;
}

/** 表单重置 */
function reset() {
  formData.value = { ...initFormData };
  dataStorageFormRef.value?.resetFields();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  modal.visible = true;
  modal.title = '添加数据存储管理';
}

function handleInfo(row?: DataStorageVO) {
  console.log(row);
}

/** 修改按钮操作 */
async function handleUpdate(row?: DataStorageVO) {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getDataStorage(_id);
  Object.assign(formData.value, res.data);
  modal.visible = true;
  modal.title = '修改数据存储管理';
}

/** 提交按钮 */
function submitForm() {
  dataStorageFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (formData.value?.id) {
        await updateDataStorage(formData.value).finally(() => buttonLoading.value = false);
      }
      else {
        await addDataStorage(formData.value).finally(() => buttonLoading.value = false);
      }
      ElMessage.success('操作成功');
      modal.visible = false;
      await initQuery();
    }
  });
}

/** 删除按钮操作 */
async function handleDelete(row?: DataStorageVO) {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm(`是否确认删除数据存储管理编号为"${_ids}"的数据项？`)
    .finally(() => loading.value = false);
  await delDataStorage(_ids);
  ElMessage.success('删除成功');
  await initQuery();
}

/** 导出按钮操作 */
function handleExport() {
  useDownload('projectarchive/dataStorage/export', {
    ...toRaw(state.queryParams)
  }, `dataStorage_${new Date().getTime()}.xlsx`);
}

onMounted(() => {
  initQuery();
});
</script>
