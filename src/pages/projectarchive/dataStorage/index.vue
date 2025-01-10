<template>
  <page-container>
    <a-card>
      <div flex items-center mb-4 justify-between>
        <div flex items-center>
          <a-upload :file-list="fileList" :before-upload="handleBeforeUpload" :show-upload-list="false" multiple>
            <a-button type="primary" shape="round" :icon="h(CloudUploadOutlined)" mr-10 @click="handleUpload">
              上传
            </a-button>
          </a-upload>

          <a-flex mb-4 class="action-button-group">
            <a-button type="primary" shape="round" :icon="h(FolderAddOutlined)" @click="handleAddFolder">
              新建文件夹
            </a-button>
            <a-button type="primary" shape="round" :icon="h(EditOutlined)" @click="handleReName">
              重命名
            </a-button>
            <a-button type="primary" shape="round" :icon="h(DownloadOutlined)" @click="handleDownload">
              下载
            </a-button>
            <a-button type="primary" shape="round" :icon="h(DeleteOutlined)" @click="handleDelete">
              删除
            </a-button>
          </a-flex>
        </div>

        <a-input-search
          v-model:value="searchValue"
          style="width: 400px"
          :loading="loading.isSearch"
          placeholder="请输入文件夹或文件名"
          enter-button
          @search="initQuery"
        />
      </div>
      <!-- 面包屑 -->
      <div flex items-center mb-6 justify-between>
        <a-flex align="center">
          <div mr-4>
            <a-button type="link" :icon="h(LeftOutlined)" color-black />
            <a-button type="link" :icon="h(LeftOutlined)" color-black :rotate="180" />
          </div>

          <a-breadcrumb>
            <template v-if="breadcrumbLsit.values.length">
              <a-breadcrumb-item v-for="(item, index) in breadcrumbLsit.values" :key="index">
                {{ renderTitle(item?.title) }}
              </a-breadcrumb-item>
            </template>
            <a-breadcrumb-item>
              {{ renderTitle('全部文件') }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </a-flex>

        <a-flex align="center">
          <span mr-4>已全部加载，共 {{ state.dataSource.length }} 个</span>
          <a-flex align="center" class="action-button-group">
            <a-button :icon="h(UnorderedListOutlined)" />
            <a-button :icon="h(RedoOutlined)" :loading="loading.isRefresh" @clik="initQuery" />
          </a-flex>
        </a-flex>
      </div>

      <!-- 表格 -->
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
              <span> {{ scope.record.isfile || '-' }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'isrelxm'">
            <div flex gap-2>
              <span> {{ scope.record.isrelxm || '-' }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'ispublish'">
            <div flex gap-2>
              <span> {{ scope.record.ispublish || '-' }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'fileSize'">
            <div flex gap-2>
              <span> {{ scope.record.fileSize || '-' }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'fileType'">
            <div flex gap-2>
              <span> {{ scope.record.fileType || '-' }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'fileSuffix'">
            <div flex gap-2>
              <span> {{ scope.record.fileSuffix || '-' }} </span>
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
              <!-- <a-button
                v-hasPermi="['projectarchive:dataStorage:edit']" type="link"
                @click="handleUpdate(scope?.record as DataStorageVO)"
              >
                编辑
              </a-button> -->
              <a-popconfirm
                title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                @confirm="handleDelete(scope?.record as DataStorageVO)"
              >
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
    <a-modal v-model:open="modal.open" :title="modal.title" @ok="submitForm" @cancel="handleCancel">
      <template #title>
        <div style="width: 100%; cursor: move">
          Draggable Modal
        </div>
      </template>
      <a-form
        ref="dataStorageFormRef" :model="formData" class="w-full" :rules="rules" :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="父目录" name="filePath">
          <a-input v-model:value="formData.filePath" :maxlength="50" placeholder="请输入父目录" disabled />
        </a-form-item>
        <a-form-item label="文件名" name="name">
          <a-input v-model:value="formData.name" :maxlength="50" placeholder="请输入文件名" />
        </a-form-item>
      </a-form>
    </a-modal>
  </page-container>
</template>

<script setup lang="ts">
import {
  CloudUploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FolderAddOutlined,
  LeftOutlined,
  RedoOutlined,
  UnorderedListOutlined
} from '@ant-design/icons-vue';
import { type VNodeChild, h } from 'vue';
import type { FormInstance, ModalProps, UploadFile, UploadProps } from 'ant-design-vue';
import { isFunction } from '@v-c/utils';
import { addDataStorage, delDataStorage, getDataStorage, listDataStorage, updateDataStorage } from '@/api/projectarchive/dataStorage';
import type { DataStorageForm, DataStorageQuery, DataStorageVO } from '@/api/projectarchive/dataStorage/types';
import AssociativeArray from '@/utils/AssociativeArray';

defineOptions({
  name: 'DataStorage'
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const ElMessage = useMessage();

const loading = reactive({
  isRefresh: false,
  isSearch: false
});

const selectRow = ref<DataStorageForm>();

// const { } = toRefs<any>(dictStore.getDictByKey());

// 表格列
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    resizable: true,
    hide: true,
    width: '100px'
  },
  {
    title: '文件名',
    dataIndex: 'name',
    resizable: true
  },
  {
    title: '类型',
    dataIndex: 'fileType',
    resizable: true,
    width: '140px'
  },
  {
    title: '父目录id',
    dataIndex: 'pid',
    resizable: true,
    hide: true,
    width: '140px'
  },
  {
    title: '是否文件',
    dataIndex: 'isfile',
    resizable: true,
    width: '100px',
    hide: true
  },

  {
    title: '大小',
    dataIndex: 'fileSize',
    resizable: true,
    width: '140px'
  },

  {
    title: '文件后缀',
    dataIndex: 'fileSuffix',
    resizable: true,
    hide: true,
    width: '100px'
  },
  {
    title: '文件路径',
    dataIndex: 'filePath',
    resizable: true,
    hide: true,
    width: '100px'
  },
  {
    title: '是否关联项目',
    dataIndex: 'isrelxm',
    resizable: true,
    width: '140px'
  },
  {
    title: '是否发布服务',
    dataIndex: 'ispublish',
    resizable: true,
    width: '140px'
  },
  {
    title: '顺序',
    dataIndex: 'orderindex',
    resizable: true,
    hide: true,
    width: '100px'
  },
  {
    title: '租户号',
    dataIndex: 'tenantId',
    resizable: true,
    hide: true,
    width: '100px'
  },
  {
    title: '创建人',
    dataIndex: 'createBy',
    resizable: true,
    hide: true,
    width: '100px'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    resizable: true,
    hide: true,
    width: '100px'
  },
  {
    title: '更新人',
    dataIndex: 'updateBy',
    resizable: true,
    hide: true,
    width: '100px'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    resizable: true,
    hide: true,
    width: '100px'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '100px'
  }
];
const filterColumns = shallowRef(columns.filter(e => !e.hide));
const tableSize = ref<('small' | 'middle' | 'large')>('large');
const buttonLoading = ref(false);
const searchValue = ref('');
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 24 };
const breadcrumbLsit = shallowRef(new AssociativeArray());

const { state, initQuery, resetQuery } = useTableQuery({
  queryApi: listDataStorage,
  queryParams: {
    name: undefined,
    filePath: undefined
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

const modal = reactive<ModalProps>({
  open: false,
  title: ''
});
const fileList = ref<UploadProps['fileList']>([]);

// 文件上传之前
function handleBeforeUpload(file: UploadFile) {
  if (!file || !file.size) {
    ElMessage.error('文件异常');
    return false;
  }
  if (file.size > 10 * 1024 ** 3) {
    ElMessage.error(`${file.name}文件大小不能超过10GB`);
    return false;
  }
  fileList.value = [...(fileList.value || []), file];
  return false;
}

function handleUpload() {

}

function handleReName() {

}

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

  }
});

const { formData, rules } = toRefs<PageData<DataStorageForm, DataStorageQuery>>(data);

function renderTitle(title: VNodeChild | (() => VNodeChild)) {
  if (isFunction(title))
    return title();

  return title;
}

/** 取消按钮 */
function handleCancel() {
  reset();
  modal.open = false;
}

/** 表单重置 */
function reset() {
  formData.value = { ...initFormData };
  dataStorageFormRef.value?.resetFields();
}

/** 新增文件夹 */
function handleAddFolder() {
  reset();
  modal.open = true;
  modal.title = '新建文件夹';
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
  modal.open = true;
  modal.title = '修改数据存储管理';
}

/** 提交按钮 */
function submitForm() {
  dataStorageFormRef.value?.validate().then(async () => {
    buttonLoading.value = true;
    if (formData.value?.id) {
      await updateDataStorage(formData.value).finally(() => buttonLoading.value = false);
    }
    else {
      await addDataStorage(formData.value).finally(() => buttonLoading.value = false);
    }
    ElMessage.success('操作成功');
    modal.open = false;
    initQuery();
  });
}

/** 删除按钮操作 */
async function handleDelete(row?: DataStorageVO) {
  const _ids = row?.id || ids.value;
  await delDataStorage(_ids);
  ElMessage.success('删除成功');
  initQuery();
}

/** 导出按钮操作 */
function handleDownload() {
  useDownload('projectarchive/dataStorage/export', {
    ...toRaw(state.queryParams)
  }, `dataStorage_${new Date().getTime()}.xlsx`);
}

onMounted(() => {
  initQuery();
});
</script>

<style land="less" scoped>
.action-button-group {
  button {

    &:not(:first-child):not(:last-child) {
      border-radius: 0;

      &:before {
        position: absolute;
        top: 20%;
        left: 0;
        width: 0.5px;
        height: 60%;
        background-color: #e7e7e7;
        content: "";
      }
    }

    &:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: unset;
    }

    &:last-child {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: unset;

      &:before {
        position: absolute;
        top: 20%;
        left: 0;
        width: 0.5px;
        height: 60%;
        background-color: #e7e7e7;
        content: "";
      }
    }
  }
}
</style>
