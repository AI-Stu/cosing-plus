<template>
  <page-container class="h-full" :is-full="true">
    <a-row :gutter="16" class="h-full">
      <a-col :span="4">
        <a-card size="small" class="h-full">
          <DataStandardsTree
            v-model="selectNode"
            :height="reactHeight"
            @select="handleSelect"
            @add="router.push({ path: '/project/manage/add' });"
          />
        </a-card>
      </a-col>

      <a-col :span="20">
        <a-card class="h-full">
          <template #title>
            <a-space size="middle">
              <a-button v-if="hasAccess([AccessKey.ADD])" type="primary" @click="handleAdd">
                添加
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
            <span pr-8>已加载全部，共 {{ state.dataSource.length }} 个</span>
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
            :loading="state.loading"
            :columns="filterColumns"
            :data-source="state.dataSource"
            :pagination="false"
            :size="tableSize"
            :scroll="{ y: reactHeight - 56 - 48 - 76 }"
            @resize-column="(w, col) => {
              col.width = w || 0;
            }"
          >
            <template #bodyCell="scope">
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

    <!-- 添加或修改项目信息数据标准关系对话框 -->
    <a-modal v-model:open="modal.visible" :title="modal.title" @ok="submitForm" @cancel="handleCancel">
      <a-form
        ref="xmxxDataStandardsRelFormRef"
        :model="formData" class="w-full"
        :rules="rules" :label-col="labelCol"
        :wrapper-col="{ span: 24 }"
        :disabled="modal.disabled"
      >
        <a-form-item label="xmid" name="xmid">
          <a-input v-model:value="formData.xmid" :maxlength="50" placeholder="请输入xmid" />
        </a-form-item>
        <a-form-item label="数据标准id" name="dataStandardsId">
          <a-input v-model:value="formData.dataStandardsId" :maxlength="50" placeholder="请输入数据标准id" />
        </a-form-item>
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
      </a-form>
    </a-modal>
  </page-container>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { AccessKey, Api, type DataVo, columns, rules } from './data';

import DataStandardsTree from '@/pages/projectarchive/components/DataStandardsTree.vue';

defineOptions({
  name: 'XmxxDataStandardsRel'
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const router = useRouter();
const { hasAccess } = useAccess();
const message = useMessage();
const dictStore = useDictStore();
const reactHeight = ref<number>(0);
// const { } = toRefs<any>(dictStore.getDictByKey(['sys_service_type']));

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

const selectNode = ref<any>({});
const labelCol = { style: { width: '110px' } };
const filterColumns = shallowRef(columns.filter((e: any) => !e.hide));
const tableSize = ref<('small' | 'middle' | 'large')>('large');

const xmxxDataStandardsRelFormRef = ref<FormInstance>();
const formData = ref<DataVo>({});
const modal = reactive({
  visible: false,
  disabled: false,
  title: '添加数据标准'
});

const { state, initQuery } = useTableQuery({
  queryApi: Api.LIST_API,
  queryParams: {
    xmid: undefined,
    dataStandardsId: undefined
  },
  beforeQuery: () => {

  },
  afterQuery: (res) => {
    return res;
  }
});

const ids = computed(() => state.rowSelections.selectedRows.map(item => item.id));

/**
 * 树节点选中事件
 */
function handleSelect({ info }: { info: any }) {
  console.log('handleSelect', info);

  if (info.node.dataRef.id) {
    catalog.form.parentName = info.node.dataRef.name;
    catalog.form.pid = info.node.dataRef.id;
    state.queryParams.dataStandardCatalogId = catalog.form.pid;
    initQuery();
  }
}

/** 取消按钮 */
function handleCancel() {
  reset();
  modal.visible = false;
}

/** 表单重置 */
function reset() {
  formData.value = {};
  xmxxDataStandardsRelFormRef.value?.resetFields();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  modal.visible = true;
  modal.disabled = false;
  modal.title = '添加项目信息数据标准关系';
}

/** 提交按钮 */
async function submitForm() {
  formData.value.id = catalog.form.pid;
  delete formData.value.createTime;
  if (formData.value.id) {
    await Api.UPDATE_API(formData.value);
    message.success('修改成功');
  }
  else {
    await Api.ADD_API(formData.value);
    message.success('新增成功');
  }
  modal.visible = false;
  initQuery();
}

/** 导出按钮操作 */
function handleExport() {
  useDownload(Api.DOWNLOAD, { ...toRaw(state.queryParams) }, `数据标准_${new Date().getTime()}.xlsx`);
}

/** 导入按钮操作 */
function handleImport() {

}

/**
 * 详情
 * @param row
 */
function handleInfo(row?: DataVo) {
  Object.assign(formData.value, row);
  modal.visible = true;
  modal.disabled = true;
  modal.title = '修改数据详情';
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
  initQuery();
});
</script>
