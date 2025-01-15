<template>
  <page-container>
    <a-card mb-4>
      <a-form class="system-crud-wrapper" :label-col="{ span: 7 }" :model="state.queryParams">
        <a-row :gutter="[15, 0]">
          <a-col :span="6">
            <a-form-item name="name" label="名">
              <a-input v-model:value="state.queryParams.name" placeholder="请输入名" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item name="value" label="值">
              <a-input v-model:value="state.queryParams.value" placeholder="请输入值" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item name="remark" label="备注">
              <a-input v-model:value="state.queryParams.remark" placeholder="请输入备注" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-space flex justify-end w-full>
              <a-button :loading="state.loading" type="primary" @click="initQuery">
                查询
              </a-button>
              <a-button :loading="state.loading" @click="resetQuery">
                重置
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-card>
      <!-- 左 -->
      <template #title>
        <a-space size="middle">
          <a-button type="primary" @click="handleAdd">
            新增
          </a-button>

          <a-button danger @click="handleDelete()">
            删除
          </a-button>

          <a-button success @click="handleExport">
            导出
          </a-button>
        </a-space>
      </template>
      <template #extra>
        <TableRightToolbar
          v-model:filter-columns="filterColumns"
          v-model:table-size="tableSize"
          :columns="columns"
          @reset-query="initQuery"
        />
      </template>
      <a-table
        row-key="id" :row-selection="state.rowSelections"
        :loading="state.loading" :columns="filterColumns"
        :data-source="state.dataSource"
        :pagination="state.pagination"
        :size="tableSize"
      >
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex>
              <a-button type="link" @click="handleInfo(scope?.record as CrudTableModel)">
                详情
              </a-button>
              <a-button type="link" @click="handleEdit(scope?.record as CrudTableModel)">
                编辑
              </a-button>
              <a-popconfirm
                title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                @confirm="handleDelete(scope?.record as CrudTableModel)"
              >
                <a-button type="link">
                  删除
                </a-button>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>

    <CrudTableModal ref="crudTableModal" />
  </page-container>
</template>

<script setup lang="ts">
import CrudTableModal from './components/crud-table-modal.vue';
import type { CrudTableModel } from '@/api/list/crud-table';
import { deleteApi, getListApi } from '@/api/list/crud-table';
import { useTableQuery } from '@/composables/table-query';

const message = useMessage();

const columns = [
  {
    title: '名',
    dataIndex: 'name'
  },
  {
    title: '值',
    dataIndex: 'value'
  },
  {
    title: '描述',
    dataIndex: 'remark'
  },
  {
    title: '操作',
    dataIndex: 'action'
  }
];
const filterColumns = ref(columns);
const tableSize = ref<('small' | 'middle' | 'large')>('large');
const { state, initQuery, resetQuery, query } = useTableQuery({
  queryApi: getListApi,
  queryParams: {
    name: undefined,
    value: undefined,
    remark: undefined
  },
  afterQuery: (res) => {
    console.log(res);
    return res;
  }
});

const crudTableModal = ref<InstanceType<typeof CrudTableModal>>();

async function handleDelete(record: CrudTableModel) {
  if (!record.id)
    return message.error('id 不能为空');
  try {
    const res = await deleteApi(record.id);
    if (res.code === 200)
      await query();
    message.success('删除成功');
  }
  catch (e) {
    console.log(e);
  }
  finally {
    close();
  }
}

function handleAdd() {
  crudTableModal.value?.open();
}

function handleEdit(record: CrudTableModel) {
  crudTableModal.value?.open(record);
}

/** 导出按钮操作 */
function handleExport() {

}
</script>

<style lang="less" scoped>
.system-crud-wrapper{
  .ant-form-item{
    margin: 0;
  }
}
</style>
