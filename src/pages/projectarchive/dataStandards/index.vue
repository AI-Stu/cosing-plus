<template>
  <div class="dataStandards">
    <div class="left">
      <div class="topBar">
        <a-input-search v-model="search.keyword" placeholder="数据标准类型" :loading="search.loading" />
        <a-button type="primary" :icon="h(PlusOutlined)" class="addBtn" @click="onClickLeftAdd" />
      </div>

      <!-- 目录树 -->
      <a-directory-tree
        v-model:expanded-keys="tree.expandedKeys"
        v-model:selected-keys="tree.selectedKeys" :tree-data="search.keyword.length > 0 ? search.filterData : tree.data" :checkable="false"
      />
    </div>

    <div class="right">
      <!-- 顶部操作栏 -->
      <div class="topBar">
        <div class="flexLeft">
          <a-button type="primary" :icon="h(PlusOutlined)" @click="onClickCreateBtn">
            新建
          </a-button>
          <a-button @click="onClickBatchImport">
            批量导入
          </a-button>
          <a-button @click="onClickBatchExport">
            批量导出
          </a-button>
        </div>
        <div class="flexRight">
          <div class="capsule">
            <OrderedListOutlined @click="onClickCapsuleList" />
            <RedoOutlined @click="onClickCapsuleRefresh" />
          </div>
        </div>
      </div>

      <!-- 列表 -->
      <a-table :columns="table.columns" :data-source="table.data" />
      <div class="pageContainer">
        <a-pagination
          v-model:current="table.pageNum" :total="table.total" show-less-items hide-on-single-page
          @change="queryTableData"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, reactive, watch } from 'vue';
import { OrderedListOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons-vue';
import type { DataNode } from 'ant-design-vue/es/tree';
import type { TableColumnType } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/_util/type';
import { getCatalogTree, getStandardList } from '@/api/projectarchive/dataStandards';

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

// 左侧类型分组 添加按钮事件
function onClickLeftAdd() {
  console.log('onClickLeftAdd');
}

// 左侧类型分组 选中事件
watch(() => tree.selectedKeys, (nv, _ov) => {
  if (nv.length > 0) {
    table.total = 0;
    table.data = [];
    table.pageNum = 1;
    queryTableData();
  }
});

// 右侧 查询列表数据
function queryTableData() {
  const param = {
    bo: {
      dataStandardCatalogId: tree.selectedKeys[0]
    },
    page: {
      pageSize: table.pageSize,
      pageNum: table.pageNum
    }
  };
  getStandardList(param).then((res) => {
    if (res.code === 200) {
      table.total = res.total;
      table.data = res.rows;
    }
  });
}

// 右侧列表 新建按钮
function onClickCreateBtn() {

}

// 右侧列表 批量导入按钮
function onClickBatchImport() {

}

// 右侧列表 批量导出按钮
function onClickBatchExport() {

}

// 胶囊 清单按钮
function onClickCapsuleList() {

}

// 胶囊 刷新按钮
function onClickCapsuleRefresh() {
  queryTableData();
}
</script>

<style lang="less" scoped>
.dataStandards {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
  justify-items: stretch;
  border: 1px solid #f00;
  padding: 0;

  .left {
    width: 330px;
    background-color: #fff;
    border-radius: 8px;

    .topBar {
      display: flex;
      justify-content: space-between;
      padding: 8px;

      .addBtn {
        margin-left: 8px;
      }
    }

    .ant-menu {
      max-height: calc(100% - 48px);
      overflow: hidden auto;
    }
  }

  .right {
    width: calc(100% - 330px - 16px);
    background-color: #fff;
    border-radius: 8px;

    .topBar {
      display: flex;
      justify-content: space-between;
      padding: 8px;

      .flexLeft {
        :deep(.ant-btn+.ant-btn) {
          margin-left: 8px;
        }

      }

      .flexRight {
        display: flex;
        align-items: center;
        font-size: 13px;

        .capsule {
          width: 56px;
          height: 22px;
          padding: 0 10px;
          border-radius: 13px;
          border: 1px solid #eaeaea;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-left: 24px;
        }
      }
    }

    .pageContainer {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
