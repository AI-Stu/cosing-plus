<template>
  <page-container>
    <a-card>
      <div flex items-center mb-4 justify-between>
        <div flex items-center>
          <a-upload :before-upload="handleBeforeUpload" :show-upload-list="false" multiple>
            <a-button type="primary" shape="round" :icon="h(CloudUploadOutlined)">
              上传
            </a-button>
          </a-upload>
          <a-space-compact block ml-10>
            <a-button type="primary" shape="round" :icon="h(FolderAddOutlined)" @click="handleAddFolder">
              新建文件夹
            </a-button>
            <a-button
              v-if="state.rowSelections.selectedRowKeys.length === 1"
              type="primary" shape="round" :icon="h(EditOutlined)" @click="handleReName"
            >
              重命名
            </a-button>
            <a-button
              v-if="state.rowSelections.selectedRowKeys.length > 0"
              type="primary" shape="round" :icon="h(SwapOutlined)" @click="handleReName"
            >
              移动
            </a-button>
            <a-button
              v-if="state.rowSelections.selectedRowKeys.length > 0"
              type="primary" shape="round" :icon="h(DownloadOutlined)" @click="handleDownload"
            >
              下载
            </a-button>
            <a-button
              v-if="hasAccess(['projectarchive:dataStorage:remove']) && state.rowSelections.selectedRowKeys.length > 0"
              type="primary" shape="round" :icon="h(DeleteOutlined)" @click="handleDelete()"
            >
              删除
            </a-button>
          </a-space-compact>
        </div>

        <a-flex align="center">
          <a-button v-if="fileTable.files.length > 0" class="mr-4" type="link" size="small" @click="fileTable.open = true">
            <template #icon>
              <SyncOutlined :class="fileTableLoading && 'rotate-element'" />
            </template>
            <span>正在上传 {{ fileTable.files.length }} 个文件</span>
          </a-button>
          <a-input-search
            v-model:value="searchValue"
            allow-clear
            style="width: 400px"
            :loading="loading.isSearch"
            placeholder="请输入文件夹或文件名"
            enter-button
            @search="() => {
              loading.isSearch = true
              initQuery()
            }"
          />
        </a-flex>
      </div>
      <!-- 面包屑 -->
      <div flex items-center mb-6 justify-between>
        <a-flex align="center">
          <div mr-4>
            <a-button type="link" :icon="h(LeftOutlined)" color-black />
            <a-button type="link" :icon="h(LeftOutlined)" color-black :rotate="180" />
          </div>

          <a-breadcrumb>
            <a-breadcrumb-item class="cursor-pointer" @click.stop="handleBreadcrumb({})">
              全部文件
            </a-breadcrumb-item>
            <template v-if="breadcrumbLsit.length">
              <a-breadcrumb-item
                v-for="(item, index) in breadcrumbLsit" :key="index"
                class="cursor-pointer" @click.stop="handleBreadcrumb(item)"
              >
                {{ item.name }}
              </a-breadcrumb-item>
            </template>
          </a-breadcrumb>
        </a-flex>

        <a-flex align="center">
          <span mr-4>已全部加载，共 {{ state.dataSource.length }} 个</span>
          <a-flex align="center" class="action-button-group">
            <a-button :icon="h(UnorderedListOutlined)" />
            <a-button @click="initQuery">
              <template #icon>
                <ReloadOutlined :class="state.loading && 'rotate-element'" />
              </template>
            </a-button>
          </a-flex>
        </a-flex>
      </div>

      <!-- 表格 -->
      <a-table
        row-key="id"
        :row-selection="state.rowSelections"
        :loading="state.loading"
        :columns="filterColumns"
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
          <template v-if="scope?.column?.dataIndex === 'name'">
            <div flex gap-1 items-center @click="handleBreadcrumb(scope.record)">
              <Icon v-if="scope.record.isfile === 0" :style="{ fontSize: '24px' }">
                <template #component>
                  <FolderLockIcon v-if="scope.record.isrelxm === 1" />
                  <FolderIcon v-else />
                </template>
              </Icon>
              <span class="cursor-pointer hover:underline"> {{ scope.record.name }} </span>
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
              <span> {{ typeof scope.record.isrelxm === 'number' ? scope.record.isrelxm : '-' }} </span>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'ispublish'">
            <div flex gap-2>
              <span> {{ typeof scope.record.ispublish === 'number' ? scope.record.ispublish : '-' }} </span>
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
        </template>
      </a-table>
    </a-card>

    <!-- 添加或修改数据存储管理对话框 -->
    <a-modal
      v-model:open="modal.open" :title="modal.title"
      :ok-button-props="modal.okButtonProps"
      @ok="modal.onOk" @cancel="modal.onCancel"
    >
      <a-form
        ref="dataStorageFormRef" :model="formData" :rules="rules" :label-col="{ style: { width: '100px' } }"
        :wrapper-col="{ span: 24 }"
      >
        <a-form-item label="父目录" name="filePath">
          <a-input v-model:value="formData.filePath" :maxlength="50" placeholder="请输入父目录" disabled />
        </a-form-item>
        <a-form-item label="文件名" name="name">
          <a-input v-model:value="formData.name" :maxlength="50" placeholder="请输入文件名" />
        </a-form-item>
      </a-form>
    </a-modal>

    <FileTable v-model:open="fileTable.open" v-model:files="fileTable.files" @refresh="initQuery" />
  </page-container>
</template>

<script setup lang="ts">
import Icon, {
  CloudUploadOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  FolderAddOutlined,
  LeftOutlined,
  ReloadOutlined,
  SwapOutlined,
  SyncOutlined,
  UnorderedListOutlined
} from '@ant-design/icons-vue';
import { h } from 'vue';
import type { FormInstance, ModalProps } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import type { FileType } from 'ant-design-vue/es/upload/interface';
import { Api, type DataVo, ROOT_FOLDER, columns, rules } from './data';
import FolderIcon from './src/icon/FolderIcon.vue';
import FolderLockIcon from './src/icon/FolderLockIcon.vue';
import FileTable from './src/FileTable/index.vue';
import AssociativeArray from '@/utils/AssociativeArray';
import type { FileUploadProps } from '@/composables/upload-file';

defineOptions({
  name: 'DataStorage'
});

const message = useMessage();
const { hasAccess } = useAccess();

// const { } = toRefs<any>(dictStore.getDictByKey());

const formData = ref<DataVo>({ ...ROOT_FOLDER });
const loading = reactive({
  isSearch: false,
  isButton: false
});

const filterColumns = shallowRef(columns.filter((e: any) => !e.hide));
const tableSize = ref<('small' | 'middle' | 'large')>('large');
const searchValue = ref('');
const breadcrumbAssociativeArray = new AssociativeArray();
const breadcrumbLsit = ref<DataVo[]>([]);

const { state, initQuery } = useTableQuery({
  queryApi: Api.LIST_API,
  beforeQuery: () => {
    state.queryParams = {
      pid: formData.value.pid,
      ...(searchValue.value ? { name: searchValue.value } : {})
    };
  },
  afterQuery: (res) => {
    loading.isSearch = false;
    return res;
  }
});

const dataStorageFormRef = ref<FormInstance>();

const modal = reactive<ModalProps>({
  open: false,
  title: '',
  okButtonProps: {
    disabled: false
  },
  onOk: () => {
    dataStorageFormRef.value?.validate().then(async () => {
      modal.okButtonProps && (modal.okButtonProps.disabled = true);
      if (formData.value?.id) {
        await Api.UPDATE_API(formData.value).finally(() =>
          modal.okButtonProps && (modal.okButtonProps.disabled = false)
        );
        message.success('更新成功');
      }
      else {
        await Api.ADD_API(formData.value).finally(() =>
          modal.okButtonProps && (modal.okButtonProps.disabled = false)
        );
        message.success('新增成功');
      }

      modal.open = false;
      initQuery();
    });
  },
  onCancel: () => {
    reset();
    modal.open = false;
  }
});

const fileTable = reactive<{
  open: boolean
  files: FileUploadProps[]
}>({
  open: false,
  files: []
});

const fileTableLoading = computed(() =>
  !!fileTable.files?.find((e: FileUploadProps) => ['uploading', 'wait', 'analysis', 'done'].includes(e.status))
);

// 文件上传之前
function handleBeforeUpload(file: FileType) {
  if (!file || !file.size) {
    message.error('文件异常');
    return false;
  }
  if (file.size > 10 * 1024 ** 3) {
    message.error(`${file.name}文件大小不能超过10GB`);
    return false;
  }

  const fileUpload: FileUploadProps = {
    name: file.name,
    size: file.size,
    path: formData.value.filePath,
    pid: formData.value.pid,
    status: 'pending',
    percent: 0,
    uid: file.uid,
    file
  };

  fileTable.files = [...fileTable.files, fileUpload];

  fileTable.open = true;
  return false;
}

/** 面包屑点击事件 */
function handleBreadcrumb(res: DataVo) {
  const item = toRaw(res);
  if (!item.id) {
    formData.value = { ...ROOT_FOLDER };
    breadcrumbAssociativeArray.removeAll();
  }
  else {
    // 永远指向当前文件夹
    setFormValues(item);
    const index = breadcrumbAssociativeArray.values.findIndex((e: any) => e.id === item.id);
    if (index > -1) {
      breadcrumbAssociativeArray.removeSplice(index);
    }
    breadcrumbAssociativeArray.set(item.id, item);
  }
  state.rowSelections.selectedRowKeys = [];
  state.rowSelections.selectedRows = [];
  breadcrumbLsit.value = cloneDeep(breadcrumbAssociativeArray.values);
  initQuery();
}

/**
 * 上传
 */
function handleUpload() {

}

function handleReName() {
  if (!validRows())
    return;

  modal.title = '重命名文件';
  modal.open = true;
}

/** 表单重置 */
function reset() {
  setFormValues(breadcrumbLsit.value.slice(-1)[0]);
  dataStorageFormRef.value?.resetFields();
}

function setFormValues(curFloder: DataVo | undefined) {
  formData.value = curFloder
    ? {
        ...curFloder,
        ...{
          id: undefined,
          name: undefined,
          pid: curFloder.id,
          filePath: [curFloder.filePath?.replace(/\/?$/, ''), curFloder.name].join('/')
        }
      }
    : { ...ROOT_FOLDER };
}

/** 新增文件夹 */
function handleAddFolder() {
  reset();
  modal.open = true;
  modal.title = '新建文件夹';
}

function handleInfo(row?: DataVo) {
  console.log(row);
}

/** 修改按钮操作 */
async function handleUpdate(row: DataVo) {
  reset();
  const _id = row.id as string;
  const res = await Api.GET_API(_id);
  Object.assign(formData.value, res.data);
  modal.open = true;
  modal.title = '修改数据存储管理';
}

/** 删除按钮操作 */
async function handleDelete(row?: DataVo) {
  if (!validRows())
    return;

  const ids = state.rowSelections.selectedRows.map(item => item.id);
  const _ids = row?.id || ids;
  await Api.DEL_API(_ids);
  state.rowSelections.selectedRowKeys = [];
  state.rowSelections.selectedRows = [];
  message.success('删除成功');
  initQuery();
}

// 检查是否允许操作
function validRows() {
  if (state.rowSelections.selectedRows.find(e => e.isrelxm)) {
    message.error('包含不允许操作的文件夹或文件');
    return false;
  }

  return true;
}

/** 导出按钮操作 */
function handleDownload() {
  useDownload('projectarchive/dataStorage/export', {
    ...toRaw(state.queryParams)
  }, `dataStorage_${new Date().getTime()}.xlsx`);
}

onBeforeMount(() => {

});

onMounted(() => {

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
