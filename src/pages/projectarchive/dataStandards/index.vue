<template>
  <page-container is-full>
    <div style="display: flex; justify-content: space-between; border: 1px solid #f00; width: 100%; height: 100%;">
      <a-card class="w-260px" style="padding: 0;">
        <template #title>
          <a-space class="w-full" style="border: 1px solid #f00;">
            <a-input-search v-model="search.keyword" placeholder="数据标准类型" :loading="search.loading" />
            <a-button type="primary" :icon="h(PlusOutlined)" class="addBtn" @click="clickCatalogAdd" />
          </a-space>
        </template>

        <a-directory-tree
          v-model:expanded-keys="tree.expandedKeys" v-model:selected-keys="tree.selectedKeys"
          :tree-data="search.keyword.length > 0 ? search.filterData : tree.data" :checkable="false"
        />
      </a-card>

      <a-card class="w-[calc(100%-276px)]">
        <a-card>
          <template #title>
            <a-space>
              <a-button type="primary" :icon="h(PlusOutlined)" @click="clickCreate">
                新建
              </a-button>
              <a-button @click="clickBatchImport">
                批量导入
              </a-button>
              <a-button @click="clickBatchExport">
                批量导出
              </a-button>
            </a-space>
          </template>
          <template #extra>
            <RedoOutlined @click="queryTableData" />
          </template>
          <template>
            <a-table :columns="table.columns" :data-source="table.data" />
            <div class="pageContainer">
              <a-pagination
                v-model:current="table.pageNum" :total="table.total" show-less-items
                @change="queryTableData"
              />
            </div>
          </template>
        </a-card>
      </a-card>
    </div>

    <!-- 添加目录对话框 -->
    <a-modal v-model:open="catalog.visible" :title="catalog.title">
      <a-form :model="catalog.form" :rules="catalog.formRules" class="w-full">
        <a-form-item label="目录名称" name="name">
          <a-input v-model:value="catalog.form.name" :maxlength="20" placeholder="请输入目录名称" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加或修改数据标准对话框 -->
    <!-- <a-modal v-model:open="modal.visible" :title="modal.title" @ok="submitForm" @cancel="handleCancel">
      <a-form ref="dataStandardsFormRef" :model="formData" class="w-full" :rules="rules" :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <a-form-item label="数据标准目录id" name="dataStandardCatalogId">
          <a-input v-model:value="formData.dataStandardCatalogId" :maxlength="50" placeholder="请输入数据标准目录id" />
        </a-form-item>
        <a-form-item label="数据类型" name="dataType">
          <a-select v-model:value="formData.dataType" placeholder="请选择数据类型">
            <a-select-option v-for="dict in hnt_type" :key="dict.value" :label="dict.label" :value="dict.value" />
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
    </a-modal> -->
  </page-container>
</template>

<script setup lang="ts">
import { h, reactive, watch } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import type { DataNode } from 'ant-design-vue/es/tree';
import type { TableColumnType } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/_util/type';
import type { DataStandardsQuery, DataStandardsVO } from '@/api/projectarchive/dataStandards/types';
import { addDataStandards, delDataStandards, getCatalogTree, getDataStandards, listDataStandards, updateDataStandards } from '@/api/projectarchive/dataStandards';

defineOptions({
  name: 'DataStandards'
});

const tree = reactive<{
  data: DataNode[]
  expandedKeys: Key[]
  selectedKeys: Key[]
}>({
  data: [],
  expandedKeys: [],
  selectedKeys: []
});

const search = reactive<{
  keyword: string
  timer: number | null
  loading: boolean
  filterData: DataNode[]
}>({
  keyword: '',
  timer: null,
  loading: false,
  filterData: []
});

const catalog = reactive({
  visible: false,
  title: '添加目录',
  formRules: {},
  form: {
    name: ''
  }
});

const table = reactive<{
  columns: TableColumnType[]
  total: number
  pageSize: number
  pageNum: number
  data: any[]
}>({
  columns: [
    {
      title: '序号',
      key: 'serialNumber',
      customRender: ({ index }) => {
        return index + 1;
      }
    },
    {
      key: 'profile',
      title: '应收文档资料'
    },
    {
      key: 'standared',
      title: '技术标准'
    },
    {
      key: 'dataType',
      title: '数据类型'
    },
    {
      key: 'profileType',
      title: '资料类型'
    },
    {
      key: 'count',
      title: '数量'
    },
    {
      key: 'createTime',
      title: '创建时间'
    },
    {
      key: 'status',
      title: '状态'
    },
    {
      key: 'handler',
      title: '操作'
    }
  ],
  total: 0,
  pageSize: 20,
  pageNum: 1,
  data: []
});

watch(() => search.keyword, (nv, _ov) => {
  if (nv.length > 0) {
    if (search.timer) {
      clearTimeout(search.timer);
      search.timer = null;
    }
    search.timer = setTimeout(() => {
      search.filterData = tree.data.filter((item) => {
        return item.title.includes(nv);
      }, 250);
    });
  }
  else {
    search.filterData = [];
  }
});

onMounted(() => {
  queryTreeData();
});

function queryTreeData() {
  getCatalogTree().then((res) => {
    if (res.code === 200) {
      tree.data = res.data;
    }
    else {
      console.log(res.msg);
    }
  });
}

function clickCatalogAdd() {
  catalog.visible = true;
  console.log(catalog.form);
}

// 右侧 查询列表数据
function queryTableData() {
  const param: DataStandardsQuery = {
    dataStandardCatalogId: tree.selectedKeys[0],
    pageSize: table.pageSize,
    pageNum: table.pageNum
  };
  listDataStandards(param).then((res) => {
    if (res.code === 200) {
      table.total = res.total;
      table.data = res.rows;
    }
  });
}

function clickCreate() {

}

function clickBatchImport() {

}

function clickBatchExport() {
  useDownload('projectarchive/dataStandards/export', {
    ...toRaw(state.queryParams)
  }, `dataStandards_${new Date().getTime()}.xlsx`);
}

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
</script>

<style lang="less" scoped>
.ant-pro-page-container {
  height: 100%;
}
</style>
