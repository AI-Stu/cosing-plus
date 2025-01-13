<template>
  <page-container is-full>
    <div class="w-full h-full flex justify-between ">
      <a-card class="w-[15%]">
        <template #title>
          <div class="w-full flex justify-between">
            <a-input-search v-model="search.keyword" placeholder="数据标准类型" :loading="search.loading" class="w-[calc(100%-40px)]" />
            <a-button type="primary" :icon="h(PlusOutlined)" class="addBtn" @click="clickCatalogAdd" />
          </div>
        </template>
        <!-- 目录树 -->
        <a-directory-tree
          v-model:expanded-keys="tree.expandedKeys" v-model:selected-keys="tree.selectedKeys" :field-names="defaultProps" :tree-data="search.keyword.length > 0 ? search.filterData : tree.data"
          :checkable="false" @select="treeSelect"
        />
      </a-card>

      <a-card class="w-[calc(85%-12px)]">
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
          <a-button :icon="h(RedoOutlined)" @click="queryTableData" />
        </template>
        <!-- 数据标准列表 -->

        <a-table :columns="table.columns" :data-source="table.data">
          <template #bodyCell="{ column }">
            <template v-if="column.dataIndex === 'status'" />

            <template v-if="column.dataIndex === 'handler'">
              <a-button size="small">
                修改
              </a-button>
              <a-button size="small" style="margin-left: 2px;">
                删除
              </a-button>
            </template>
          </template>
        </a-table>

        <div class="pageContainer">
          <a-pagination
            v-model:current="table.pageNum" :total="table.total" show-less-items
            @change="queryTableData"
          />
        </div>
      </a-card>
    </div>

    <!-- 添加目录对话框 -->
    <a-modal v-model:open="catalog.visible" :title="catalog.title" @ok="saveCatalog">
      <a-form :model="catalog.form" :rules="catalog.formRules" class="w-full">
        <a-form-item label="父目录名称" name="parentName">
          <a-input v-model:value="catalog.form.parentName" :maxlength="20" placeholder="" disabled />
        </a-form-item>
        <a-form-item label="目录名称" name="name">
          <a-input v-model:value="catalog.form.name" :maxlength="20" placeholder="请输入目录名称" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加或修改数据标准对话框 -->
    <a-modal v-model:open="paramObj.showDataStandardsVisible" :title="paramObj.title" @ok="submitForm" @cancel="handleCancel">
      <a-form
        ref="dataStandardsFormRef" :model="formData" class="w-full" :rules="rules" :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="文档资料名称" name="name">
          <a-input v-model:value="paramObj.formData.name" :maxlength="50" placeholder="文档资料名称" />
        </a-form-item>
        <a-form-item label="数据类型" name="dataType">
          <a-select v-model:value="paramObj.formData.dataType" placeholder="请选择数据类型" :options="dataTypeArr" />
        </a-form-item>
        <a-form-item label="资料类型" name="materialType">
          <a-select v-model:value="paramObj.formData.materialType" placeholder="请选择数据类型" :options="materialTypeArr" />
        </a-form-item>
        <a-form-item label="数量" name="sl">
          <a-input v-model:value="paramObj.formData.sl" :maxlength="50" placeholder="请输入数量" />
        </a-form-item>
        <a-form-item label="状态" name="stauts">
          <a-select v-model:value="paramObj.formData.stauts" placeholder="请选择数据类型" :options="stautsArr" />
        </a-form-item>
        <a-form-item label="顺序" name="orderindex">
          <a-input v-model:value="paramObj.formData.orderindex" :maxlength="50" placeholder="请输入顺序" />
        </a-form-item>
      </a-form>
    </a-modal>
  </page-container>
</template>

<script setup lang="ts">
import { h, reactive, watch } from 'vue';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons-vue';
import type { DataNode } from 'ant-design-vue/es/tree';
import type { TableColumnType } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/_util/type';
import type { DataStandardsQuery } from '@/api/projectarchive/dataStandards/types';
import { addDataStandardsApi, listDataStandardsApi } from '@/api/projectarchive/dataStandards';
import { addCatalogApi } from '@/api/projectarchive/catalog';
import { getStandardsCatalogTreeApi } from '@/api/projectarchive/dataStandardsCatalog';

defineOptions({
  name: 'DataStandards'
});
const ElMessage = useMessage();
const dictStore = useDictStore();
const dataStandardsFormRef = ref<FormInstance>();
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
    pid: '',
    name: ''
  }
});

const paramObj = reactive({
  showDataStandardsVisible: false,
  title: '新增数据标准',
  formData: {}
});

const dataTypeArr = [
  {
    'label': '文本',
    'value': '1'
  }
];
const materialTypeArr = [
  {
    'label': 'pdf',
    'value': 'pdf'
  },
  {
    'label': 'png',
    'value': 'png'
  }
];

const stautsArr = [
  {
    'label': '启用',
    'value': '1'
  },
  {
    'label': '不启用',
    'value': '0 '
  }
];

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
      key: 'name',
      dataIndex: 'name',
      title: '应收文档资料'
    },
    {
      key: 'standared',
      title: '技术标准'
    },
    {
      key: 'dataType',
      dataIndex: 'dataType',
      title: '数据类型'
    },
    {
      key: 'materialType',
      dataIndex: 'materialType',
      title: '资料类型'
    },
    {
      key: 'sl',
      dataIndex: 'sl',
      title: '数量'
    },
    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '创建时间'
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: '状态'
    },
    {
      title: '操作',
      dataIndex: 'handler'
    }
  ],
  total: 0,
  pageSize: 20,
  pageNum: 1,
  data: []
});

const defaultProps = {
  // 规定
  children: 'children',
  title: 'label'
};

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
  queryTableData();
});

function queryTreeData() {
  getStandardsCatalogTreeApi().then((res) => {
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
    dataStandardCatalogId: catalog.form.pid,
    pageSize: table.pageSize,
    pageNum: table.pageNum
  };
  listDataStandardsApi(param).then((res) => {
    if (res.code === 200) {
      table.total = res.total;
      table.data = res.rows;
    }
  });
}

function clickCreate() {
  if (catalog.form.pid) {
    paramObj.showDataStandardsVisible = true;
    console.log(catalog.form);
  }
}

function clickBatchImport() {

}

function clickBatchExport() {
  // useDownload('projectarchive/dataStandards/export', {
  //   ...toRaw(state.queryParams)
  // }, `dataStandards_${new Date().getTime()}.xlsx`);
}

function saveCatalog() {
  console.log(tree.selectedKeys);
  addCatalogApi(catalog.form).then((res) => {
    if (res.code === 200) {
      catalog.visible = false;
      queryTreeData();
    }
  });
}

function treeSelect(selectedKeys, e: { selected: bool, selectedNodes, node, event }) {
  console.log(e);
  catalog.form.parentName = e.node.dataRef.label;
  catalog.form.pid = e.node.dataRef.id;
  queryTableData();
}

function submitForm() {
  paramObj.formData.dataStandardCatalogId = catalog.form.pid;
  addDataStandardsApi(paramObj.formData).then((res) => {
    if (res.code === 200) {
      paramObj.showDataStandardsVisible = false;
      queryTableData();
    }
  });
}
</script>

<style lang="less" scoped>
.ant-pro-page-container {
  height: 100%;

  :deep(.ant-card) {

    .ant-card-head {
      padding: 0 8px;
    }

    .ant-card-body {
      width: 100%;
      max-height: calc(100% - 56px);
      padding: 8px;
    }
  }
}
</style>
