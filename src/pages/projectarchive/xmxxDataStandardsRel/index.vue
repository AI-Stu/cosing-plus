<template>
  <page-container class="h-full" :is-full="true">
    <a-row :gutter="16" class="h-full">
      <a-col :span="4">
        <a-card size="small" class="h-full">
          <SearchTree
            v-model:loading="loading"
            :height="reactHeight"
            @add="router.push({ path: '/project/manage/add' });"
          />
        </a-card>
      </a-col>

      <a-col :span="20">
        <a-card class="h-full">
          <template #title>
            <a-space size="middle">
              <a-button v-hasPermi="['projectarchive:xmxxDataStandardsRel:add']" type="primary" @click="handleAdd">
                添加
              </a-button>
              <a-button v-hasPermi="['projectarchive:xmxxDataStandardsRel:edit']" @click="handleUpdate()">
                批量导入
              </a-button>
              <a-button v-hasPermi="['projectarchive:xmxxDataStandardsRel:export']" @click="handleExport">
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
            :loading="state.loading" :columns="filterColumns"
            :data-source="state.dataSource"
            :pagination="false"
            :size="tableSize"
            :scroll="{ y: reactHeight - 56 - 48 - 76 }"
            @resize-column="(w, col) => {
              col.width = w;
            }"
          >
            <template #bodyCell="scope">
              <template v-if="scope?.column?.dataIndex === 'id'">
                <span> {{ scope.record.id }} </span>
              </template>
              <template v-if="scope?.column?.dataIndex === 'xmid'">
                <div flex gap-2>
                  <span> {{ scope.record.xmid }} </span>
                </div>
              </template>
              <template v-if="scope?.column?.dataIndex === 'dataStandardsId'">
                <div flex gap-2>
                  <span> {{ scope.record.dataStandardsId }} </span>
                </div>
              </template>
              <template v-if="scope?.column?.dataIndex === 'dataType'">
                <div flex gap-2>
                  <span> {{ scope.record.dataType }} </span>
                </div>
              </template>
              <template v-if="scope?.column?.dataIndex === 'dataStandards'">
                <div flex gap-2>
                  <span> {{ scope.record.dataStandards }} </span>
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
              <template v-if="scope?.column?.dataIndex === 'name'">
                <div flex gap-2>
                  <span> {{ scope.record.name }} </span>
                </div>
              </template>
              <template v-if="scope?.column?.dataIndex === 'action'">
                <div flex>
                  <a-button type="link" @click="handleInfo(scope?.record)">
                    详情
                  </a-button>
                  <a-button v-hasPermi="['projectarchive:xmxxDataStandardsRel:edit']" type="link" @click="handleUpdate(scope?.record)">
                    编辑
                  </a-button>
                  <a-popconfirm
                    title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                    @confirm="handleDelete(scope?.record)"
                  >
                    <a-button v-hasPermi="['projectarchive:xmxxDataStandardsRel:remove']" type="link" danger>
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
import { addXmxxDataStandardsRel, delXmxxDataStandardsRel, getXmxxDataStandardsRel, listXmxxDataStandardsRel, updateXmxxDataStandardsRel } from '@/api/projectarchive/xmxxDataStandardsRel';
import type { XmxxDataStandardsRelForm, XmxxDataStandardsRelQuery, XmxxDataStandardsRelVO } from '@/api/projectarchive/xmxxDataStandardsRel/types';

import SearchTree from '@/pages/projectarchive/components/SearchTree.vue';

defineOptions({
  name: 'XmxxDataStandardsRel'
});

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
console.log(proxy);

const router = useRouter();
const ElMessage = useMessage();

const dictStore = useDictStore();
// const { } = toRefs<any>(dictStore.getDictByKey());

// 表格列
const columns = [
  {
    title: '因收文档资料',
    dataIndex: 'name',
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
    title: '数量',
    dataIndex: 'sl',
    resizable: true
  },
  {
    title: '创建时间',
    dataIndex: 'updateTime',
    resizable: true
  },
  {
    title: '状态',
    dataIndex: 'stauts',
    resizable: true
  },
  {
    title: '操作',
    dataIndex: 'action'
  }
];
const filterColumns = ref(columns);
const tableSize = ref<('small' | 'middle' | 'large')>('large');
const buttonLoading = ref(false);
const loading = ref(false);
const labelCol = { style: { width: '100px' } };
const wrapperCol = { span: 24 };

const { state, initQuery, resetQuery, query } = useTableQuery({
  queryApi: listXmxxDataStandardsRel,
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
    console.log(res);
    return res;
  }
});

const ids = computed(() => state.rowSelections.selectedRows.map(item => item.id));

const xmxxDataStandardsRelFormRef = ref<FormInstance>();

const modal = reactive({
  visible: false,
  title: ''
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
const reactHeight = ref<number>(0);

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

function handleInfo(row?: XmxxDataStandardsRelVO) {
  console.log(row);
}

/** 修改按钮操作 */
async function handleUpdate(row?: XmxxDataStandardsRelVO) {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getXmxxDataStandardsRel(_id);
  Object.assign(formData.value, res.data);
  modal.visible = true;
  modal.title = '修改项目信息数据标准关系';
}

/** 提交按钮 */
function submitForm() {
  xmxxDataStandardsRelFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (formData.value.id) {
        await updateXmxxDataStandardsRel(formData.value).finally(() => buttonLoading.value = false);
      }
      else {
        await addXmxxDataStandardsRel(formData.value).finally(() => buttonLoading.value = false);
      }
      ElMessage.success('操作成功');
      modal.visible = false;
      await initQuery();
    }
  });
}

/** 删除按钮操作 */
async function handleDelete(row?: XmxxDataStandardsRelVO) {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm(`是否确认删除项目信息数据标准关系编号为"${_ids}"的数据项？`)
    .finally(() => loading.value = false);
  await delXmxxDataStandardsRel(_ids);
  ElMessage.success('删除成功');
  await initQuery();
}

/** 导出按钮操作 */
function handleExport() {
  useDownload('projectarchive/xmxxDataStandardsRel/export', {
    ...toRaw(state.queryParams)
  }, `xmxxDataStandardsRel_${new Date().getTime()}.xlsx`);
}

onMounted(() => {
  console.log(proxy?.$el.offsetHeight);
  reactHeight.value = proxy?.$el.offsetHeight;
  initQuery();
});
</script>
