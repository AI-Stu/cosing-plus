<template>
  <page-container is-full>
    <div class="w-full h-full flex justify-between ">
      <a-card class="w-[15%]">
        <template #title>
          <div class="w-full flex justify-between">
            <a-input-search v-model="search.keyword" placeholder="目录名称" :loading="search.loading" class="w-[calc(100%-40px)]" />
            <a-button type="primary" :icon="h(PlusOutlined)" class="addBtn" @click="clickCatalogAdd" />
          </div>
        </template>
        <!-- 目录树 -->
        <a-directory-tree
          v-model:expanded-keys="tree.expandedKeys"
          v-model:selected-keys="tree.selectedKeys"
          :field-names="defaultProps"
          :tree-data="search.keyword.length > 0 ? search.filterData : tree.data"
          :checkable="false"
          @select="treeSelect"
        />
      </a-card>

      <a-card class="w-[calc(85%-12px)]">
        <template #title>
          <a-space>
            <a-button type="primary" :icon="h(PlusOutlined)" @click="clickCreate">
              挂接
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
          <a-input v-model:value="catalog.form.catalogname" :maxlength="20" placeholder="请输入目录名称" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 添加或修改数据标准对话框 -->
    <a-modal v-model:open="paramObj.showAddServicePanelVisible" :title="paramObj.title" width="80%" @ok="addServiceRel" @cancel="handleCancel">
      <a-table :columns="serviceHookingTable.columns" :data-source="serviceHookingTable.data" :row-selection="rowSelection">
        <template #bodyCell="{ column }">
          <template v-if="column.dataIndex === 'handler'">
            <a-button size="small" style="margin-left: 2px;">
              删除
            </a-button>
          </template>
        </template>
      </a-table>

      <div class="pageContainer">
        <a-pagination
          v-model:current="serviceHookingTable.pageNum" :total="serviceHookingTable.total" show-less-items
          @change="queryServiceHookingData"
        />
      </div>
    </a-modal>
  </page-container>
</template>

<script setup lang="ts">
import { h, reactive, watch } from 'vue';
import { PlusOutlined, RedoOutlined } from '@ant-design/icons-vue';
import type { DataNode } from 'ant-design-vue/es/tree';
import type { TableColumnType } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/_util/type';

import { addCatalog, getCatalogTree } from '@/api/projectarchive/catalog';
import { getServiceList, saveServiceCatalogRel } from '@/api/projectarchive/service';

defineOptions({
  name: 'DataStandards'
});
const ElMessage = useMessage();
const dictStore = useDictStore();

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
    catalogname: ''
  }
});

const paramObj = reactive({
  showAddServicePanelVisible: false,
  title: '服务挂接'

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
      key: 'serviceName',
      dataIndex: 'serviceName',
      title: '服务名称'
    },
    {
      key: 'serviceUrl',
      dataIndex: 'serviceUrl',
      title: '服务地址'
    },
    {
      key: 'serviceType',
      dataIndex: 'serviceType',
      title: '服务类型'
    },

    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '创建时间'
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
const serviceHookingTable = reactive<{
  columns: TableColumnType[]
  selectedRows: any[]
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
      key: 'serviceName',
      dataIndex: 'serviceName',
      title: '服务名称'
    },
    {
      key: 'serviceUrl',
      dataIndex: 'serviceUrl',
      title: '服务地址'
    },
    {
      key: 'serviceType',
      dataIndex: 'serviceType',
      title: '服务类型'
    },

    {
      key: 'createTime',
      dataIndex: 'createTime',
      title: '创建时间'
    }
  ],
  total: 0,
  pageSize: 20,
  pageNum: 1,
  data: [],
  selectedRows: []
});

const defaultProps = {
  // 规定
  children: 'children',
  title: 'label'
};

const rowSelection = ref({
  onChange: (selectedRowKeys, selectedRows) => {
    serviceHookingTable.selectedRows = selectedRows;
  },
  onSelect: (record, selected, selectedRows) => {
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
  }
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
  catalog.form.catalogname = '';
}

// 右侧 查询列表数据
function queryTableData() {
  const param: listService = {
    catalogId: catalog.form.pid,
    pageSize: table.pageSize,
    pageNum: table.pageNum
  };
  getServiceList(param).then((res) => {
    if (res.code === 200) {
      table.total = res.total;
      table.data = res.rows;
    }
  });
}

function queryServiceHookingData() {
  const param: listService = {
    pageSize: serviceHookingTable.pageSize,
    pageNum: serviceHookingTable.pageNum
  };
  getServiceList(param).then((res) => {
    if (res.code === 200) {
      serviceHookingTable.total = res.total;
      serviceHookingTable.data = res.rows;
    }
  });
}

function clickCreate() {
  if (catalog.form.pid) {
    paramObj.showAddServicePanelVisible = true;
    queryServiceHookingData();
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
  addCatalog(catalog.form).then((res) => {
    if (res.code === 200) {
      catalog.visible = false;
      queryTreeData();
    }
  });
}

function treeSelect(selectedKeys, e: { selected: bool, selectedNodes, node, event }) {
  catalog.form.parentName = e.node.dataRef.label;
  catalog.form.pid = e.node.dataRef.id;
  queryTableData();
}

function addServiceRel() {
  console.log(serviceHookingTable.selectedRows);
  const objArr = [];
  if (catalog.form.pid && serviceHookingTable.selectedRows.length > 0) {
    serviceHookingTable.selectedRows.forEach((item) => {
      const obj = {
        serviceid: item.id,
        catalogid: catalog.form.pid
      };
      objArr.push(obj);
    });
    saveServiceCatalogRel(objArr).then((res) => {
      paramObj.showAddServicePanelVisible = false;
      queryTableData();
    });
  }
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
