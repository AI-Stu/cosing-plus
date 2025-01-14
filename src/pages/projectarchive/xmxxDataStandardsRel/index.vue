<template>
  <page-container class="h-full" :is-full="true">
    <a-row :gutter="16" class="h-full">
      <a-col :span="4">
        <a-card size="small" class="h-full">
          <DataStandardsTree
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
              <a-button v-if="hasAccess(['projectarchive:xmxxDataStandardsRel:add'])" type="primary" @click="handleAdd">
                添加
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
            <span pr-8>已加载全部，共 {{ state.dataSource.length }} 个</span>
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
              <template v-if="scope?.column?.dataIndex === 'action'">
                <div flex>
                  <a-button type="link" @click="handleInfo(scope?.record)">
                    详情
                  </a-button>
                  <a-button v-if="hasAccess(['projectarchive:xmxxDataStandardsRel:edit'])" type="link" @click="handleUpdate(scope?.record)">
                    编辑
                  </a-button>
                  <a-popconfirm
                    title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                    @confirm="handleDelete(scope?.index, scope?.record)"
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

    <!-- 添加或修改项目信息数据标准关系对话框 -->
    <a-modal v-model:open="modal.visible" :title="modal.title" @ok="submitForm" @cancel="handleCancel">
      <a-form ref="xmxxDataStandardsRelFormRef" :model="formData" class="w-full" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="xmid" name="xmid">
          <a-input v-model:value="formData.xmid" :maxlength="50" placeholder="请输入xmid" />
        </a-form-item>
        <a-form-item label="数据标准id" name="dataStandardsId">
          <a-input v-model:value="formData.dataStandardsId" :maxlength="50" placeholder="请输入数据标准id" />
        </a-form-item>
        <a-form-item label="数量" name="sl">
          <a-input v-model:value="formData.sl" :maxlength="50" placeholder="请输入数量" />
        </a-form-item>
        <a-form-item label="状态" name="stauts">
          <a-input v-model:value="formData.stauts" :maxlength="50" placeholder="请输入状态" />
        </a-form-item>
      </a-form>
    </a-modal>
  </page-container>
</template>

<script setup lang="ts">
import type { FormInstance } from 'ant-design-vue';
import { addXmxxDataStandardsRelApi, delXmxxDataStandardsRelApi, getXmxxDataStandardsRelApi, listXmxxDataStandardsRelApi, updateXmxxDataStandardsRelApi } from '@/api/projectarchive/xmxxDataStandardsRel';
import type { XmxxDataStandardsRelForm, XmxxDataStandardsRelQuery, XmxxDataStandardsRelVO } from '@/api/projectarchive/xmxxDataStandardsRel/types';

import DataStandardsTree from '@/pages/projectarchive/components/DataStandardsTree.vue';

defineOptions({
  name: 'XmxxDataStandardsRel'
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const router = useRouter();
const ElMessage = useMessage();
const { hasAccess } = useAccess();
const dictStore = useDictStore();
const reactHeight = ref<number>(0);
// const { } = toRefs<any>(dictStore.getDictByKey(['sys_service_type']));

// 表格列
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
    dataIndex: 'skillStandards',
    width: 120,
    resizable: true
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
const filterColumns = ref(columns);
const tableSize = ref<('small' | 'middle' | 'large')>('large');
const loading = ref(false);
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 24 };

const { state, initQuery, resetQuery, query } = useTableQuery({
  queryApi: listXmxxDataStandardsRelApi,
  queryParams: {
    xmid: undefined,
    dataStandardsId: undefined,
    dataType: undefined,
    dataStandards: undefined,
    skillStandards: undefined,
    materialType: undefined,
    sl: undefined,
    stauts: undefined,
    name: undefined
  },
  beforeQuery: () => {

  },
  afterQuery: (res) => {
    return res;
  }
});

const ids = computed(() => state.rowSelections.selectedRows.map(item => item.id));

const xmxxDataStandardsRelFormRef = ref<FormInstance>();

const modal = reactive({
  visible: false,
  title: '',
  formData: {}
});

const initFormData: XmxxDataStandardsRelForm = {
  id: undefined,
  xmid: undefined,
  dataStandardsId: undefined,
  dataType: undefined,
  dataStandards: undefined,
  skillStandards: undefined,
  materialType: undefined,
  sl: undefined,
  stauts: undefined,
  name: undefined
};
const data = reactive<PageData<XmxxDataStandardsRelForm, XmxxDataStandardsRelQuery>>({
  formData: { ...initFormData },
  rules: {
    id: [
      { required: true, message: '$comment不能为空', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '标准名称不能为空', trigger: 'blur' }
    ]
  }
});

const { queryParams, formData, rules } = toRefs(data);

/**
 * 目录树节点选中事件
 */
function handleSelect({ key, info }) {

}

/** 取消按钮 */
function handleCancel() {
  reset();
  modal.visible = false;
}

/** 表单重置 */
function reset() {
  formData.value = { ...initFormData };
  xmxxDataStandardsRelFormRef.value?.resetFields();
}

/** 新增按钮操作 */
function handleAdd() {
  reset();
  modal.visible = true;
  modal.title = '添加项目信息数据标准关系';
}

/** 提交按钮 */
function submitForm() {
  xmxxDataStandardsRelFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true;
      if (formData.value.id) {
        await updateXmxxDataStandardsRelApi(formData.value).finally(() => loading.value = false);
      }
      else {
        await addXmxxDataStandardsRelApi(formData.value).finally(() => loading.value = false);
      }
      ElMessage.success('操作成功');
      modal.visible = false;
      await initQuery();
    }
  });
}

/** 详情按钮操作 */
function handleInfo(row?: XmxxDataStandardsRelVO) {
  console.log(row);
}

/** 修改按钮操作 */
async function handleUpdate(row?: XmxxDataStandardsRelVO) {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getXmxxDataStandardsRelApi(_id);
  Object.assign(formData.value, res.data);
  modal.visible = true;
  modal.title = '修改项目信息数据标准关系';
}

/** 删除按钮操作 */
async function handleDelete(index: number, row?: XmxxDataStandardsRelVO) {
  const _ids = row?.id || ids.value;
  await delXmxxDataStandardsRelApi(_ids);
  ElMessage.success('删除成功');
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

onMounted(() => {
  reactHeight.value = proxy?.$el.offsetHeight;
  initQuery();
});
</script>
