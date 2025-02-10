<template>
  <!-- 添加或修改文件上传弹窗 -->
  <a-modal
    v-model:open="open" :title="modal.title"
    :ok-button-props="modal.okButtonProps"
    width="1000px"
    @ok="modal.onOk" @cancel="modal.onCancel"
  >
    <a-tabs v-model:active-key="activeKey">
      <a-tab-pane key="1" :tab="`上传中（${state.uploadFileQueue.values.length}）`">
        <div>
          <a-flex align="center" justify="space-between" class="my-4">
            <a-space-compact block>
              <a-button
                type="primary"
                :disabled="selectedRows.length === 0" :icon="h(PauseCircleOutlined)"
                shape="round" @click="handleStart"
              >
                全部开始
              </a-button>
              <a-button
                type="primary"
                :disabled="true" :icon="h(PlayCircleOutlined)"
                shape="round" @click="handleStop"
              >
                全部暂停
              </a-button>
              <a-button
                type="primary" :disabled="true"
                :icon="h(DeleteOutlined)"
                shape="round" @click="handleDelete"
              >
                全部删除
              </a-button>
            </a-space-compact>

            <span class="flex-shrink-0">
              共 {{ state.dataSource?.length }} 个文件，
              上传中 {{ state.uploadFileQueue.values.length }} 个，
              失败 {{ state.dataSource?.length }} 个
            </span>
          </a-flex>
          <a-table
            row-key="uid"
            :row-selection="waitTableState.rowSelection"
            :loading="waitTableState.loading"
            :columns="waitTableState.columns"
            :data-source="state.dataSource"
            :pagination="waitTableState.pagination"
            size="small"
            :scroll="{ y: props.height }"
            @resize-column="(w, col) => {
              col.width = w;
            }"
          >
            <template #bodyCell="scope">
              <template v-if="scope?.column?.dataIndex === 'name'">
                <div flex gap-1 items-center>
                  <span class="cursor-pointer hover:underline"> {{ scope.record.name }} </span>
                </div>
              </template>
              <template v-if="scope?.column?.dataIndex === 'size'">
                <div flex gap-1 items-center>
                  <span> {{ formatFileSize(scope.record.size) }} </span>
                </div>
              </template>

              <template v-if="scope?.column?.dataIndex === 'percent'">
                <div flex gap-2>
                  <a-progress
                    :stroke-color="{
                      from: '#108ee9',
                      to: '#87d068',
                    }"
                    :percent="scope.record.percent"
                    :status="scope.record.status === 'uploading' ? 'active' : undefined"
                  />
                </div>
              </template>
              <template v-if="scope?.column?.dataIndex === 'action'">
                <div flex>
                  <a-button v-if="['uploading', 'wait'].includes(scope.record.status)" type="link" size="small">
                    暂停
                  </a-button>
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
        </div>
      </a-tab-pane>
      <a-tab-pane key="2" :tab="`已完成（${doneTableState.dataSource?.length || 0}）`" force-render>
        <div>
          <a-flex align="center" justify="space-between" class="my-4">
            <a-space-compact block>
              <a-button
                type="primary"
                :disabled="doneTableState.dataSource?.length === 0" :icon="h(ClearOutlined)"
                shape="round" @click="handleStart"
              >
                清空全部记录
              </a-button>
            </a-space-compact>

            <span class="flex-shrink-0">共 {{ doneTableState.dataSource?.length }} 个文件</span>
          </a-flex>
          <a-table
            row-key="uid"
            :row-selection="doneTableState.rowSelection"
            :loading="doneTableState.loading"
            :columns="doneTableState.columns"
            :data-source="doneTableState.dataSource"
            :pagination="doneTableState.pagination"
            size="small"
            :scroll="{ y: props.height }"
            @resize-column="(w, col) => {
              col.width = w;
            }"
          >
            <template #bodyCell="scope">
              <template v-if="scope?.column?.dataIndex === 'size'">
                <div flex gap-1 items-center>
                  <span> {{ formatFileSize(scope.record.size) }} </span>
                </div>
              </template>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup lang="ts">
import { h } from 'vue';
import type { ModalProps, TableProps } from 'ant-design-vue';
import {
  ClearOutlined,
  DeleteOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined
} from '@ant-design/icons-vue';

import { cloneDeep, debounce } from 'lodash-es';
import { formatFileSize } from '@/utils/tools';
import type { FileUploadProps } from '@/composables/upload-file';
import { addDataStorageApi } from '@/api/projectarchive/dataStorage';
import type { DataStorageForm } from '@/api/projectarchive/dataStorage/types';

defineOptions({
  name: 'FileTable'
});

const props = withDefaults(defineProps<{
  open: boolean
  files: FileUploadProps[]
  height?: number
}>(), {
  open: false,
  files: () => [],
  height: 400
});

const emits = defineEmits(['update:open', 'update:files', 'refresh']);
const open = useVModel(props, 'open', emits);
const message = useMessage();

const activeKey = ref('1');
// 表格列
const columns = [
  {
    title: '文件ID',
    dataIndex: 'id',
    resizable: true,
    hide: true,
    width: 100
  },
  {
    title: '存储桶',
    dataIndex: 'bucket',
    resizable: true,
    hide: true,
    width: 140
  },
  {
    title: '文件名称',
    dataIndex: 'name',
    resizable: true,
    width: 250,
    ellipsis: true
  },
  {
    title: '文件大小',
    dataIndex: 'size',
    width: 100
  },
  {
    title: '文件路径前缀',
    dataIndex: 'prefix',
    resizable: true,
    hide: true,
    width: 100
  },
  {
    title: '存储路径',
    dataIndex: 'path',
    resizable: true,
    ellipsis: true,
    width: 100
  },
  {
    title: '上传进度',
    dataIndex: 'percent',
    width: 150
  },
  {
    title: '切片总数',
    dataIndex: 'partTotal',
    resizable: true,
    width: 100
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 120
  }
];

const modal = reactive<ModalProps>({
  title: '文件上传队列',

  okButtonProps: {
    disabled: false
  },
  onOk: () => {
    open.value = false;
  },
  onCancel: () => {
    open.value = false;
  }
});

const selectedRows = ref<FileUploadProps[]>([]);
const waitTableState = reactive<TableProps>({
  dataSource: [],
  loading: false,
  pagination: false,
  columns: columns.filter((e: any) => !e.hide),
  rowSelection: {
    type: 'checkbox',
    selectedRowKeys: [],
    onChange: (keys: any[], rows: any[]) => {
      console.log(keys, rows);
      waitTableState.rowSelection && (waitTableState.rowSelection.selectedRowKeys = keys);
      selectedRows.value = toRaw(rows);
    }
  }
});

const doneTableState = reactive<TableProps>({
  dataSource: [],
  loading: false,
  pagination: false,
  columns: columns.filter((e: any) => !e.hide),
  rowSelection: {
    type: 'checkbox',
    selectedRowKeys: [],
    onChange: (keys: any[], rows: any[]) => {
      console.log(keys, rows);
      doneTableState.rowSelection && (doneTableState.rowSelection.selectedRowKeys = keys);
      selectedRows.value = toRaw(rows);
    }
  }
});

const { state, onStart, onRemove } = useFileUpload({
  onUploadDone: (uid) => {
    console.log('onUploadDone', uid);
    const index = state.dataSource.findIndex(e => e.uid === uid);
    const row = cloneDeep(state.dataSource[index]);
    const match = row?.file.name.match(/\.([^.]+)$/);
    const formData: DataStorageForm = {
      name: row?.name,
      pid: row?.pid,
      filePath: row?.path,
      fileSize: row?.size,
      fileType: match ? match[1] : '',
      fileSuffix: match ? match[0] : '',
      ispublish: 0,
      isrelxm: 0,
      isfile: 1
    };

    addDataStorageApi(formData).then(() => {
      message.success(`${row?.name}上传成功`);
      onRemove(uid);
      doneTableState.dataSource?.push();
      emits('refresh');
    });
  }
});

watch(
  () => props.files,
  (val) => {
    state.dataSource = val;
    console.log(state.dataSource);
  }
);

function handleRowDelete(index: number, record: FileUploadProps) {
  state.dataSource?.splice(index, 1);
}

/**
 * 全部开始
 */

const handleStart = debounce(() => {
  console.log('Start uploading files');
  onStart(selectedRows.value);
}, 500);

/**
 * 全部暂停
 */
function handleStop() {
  console.log('Stop uploading files');
}

/**
 * 全部删除
 */
function handleDelete() {
  console.log('Delete files');
}
</script>
