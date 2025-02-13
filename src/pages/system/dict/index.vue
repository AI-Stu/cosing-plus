<template>
  <PageContainer class="h-full" :is-full="true">
    <a-card mb-4>
      <a-form :label-col="{ span: 7 }" :model="state.queryParams">
        <a-row :gutter="[15, 0]">
          <a-col :span="8">
            <a-form-item label="字典名称" name="dictName">
              <a-input v-model:value="state.queryParams.dictName" placeholder="请输入字典名称" allow-clear @press-enter="initQuery" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="字典类型" name="dictType">
              <a-input v-model:value="state.queryParams.dictType" placeholder="请输入字典类型" allow-clear @press-enter="initQuery" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item name="dateRange" label="创建时间">
              <a-range-picker v-model:value="dateRange" value-format="YYYY-MM-DD" class="w-full" @change="initQuery" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :span="24" style="text-align: right">
          <a-col :span="24">
            <a-space flex justify-end w-full>
              <a-button :loading="loading" type="primary" @click="initQuery">
                查询
              </a-button>
              <a-button :loading="loading" @click="() => { dateRange = []; resetQuery(); }">
                重置
              </a-button>
              <a-button v-if="false" type="link" @click="expand = !expand">
                {{ expand ? '收起' : '展开' }}
                <UpOutlined v-if="expand" />
                <DownOutlined v-else />
              </a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </a-card>

    <a-card>
      <template #title>
        <a-space>
          <a-button v-if="hasAccess(['system:dict:add'])" type="primary" :icon="h(PlusOutlined)" @click="() => modal.open = true">
            新增
          </a-button>
          <!-- <a-button v-if="hasAccess(['system:dict:edit'])" type="primary" :icon="h(PlusOutlined)" :disabled="single" @click="handleUpdate()">
            修改
          </a-button>
          <a-button v-if="hasAccess(['system:dict:remove'])" :icon="h(PlusOutlined)" :disabled="multiple" danger @click="handleDelete()">
            删除
          </a-button>
          <a-button v-if="hasAccess(['system:dict:export'])" :icon="h(PlusOutlined)" @click="handleExport">
            导出
          </a-button>
          <a-button v-if="hasAccess(['system:dict:remove'])" :icon="h(PlusOutlined)" @click="handleRefreshCache">
            刷新缓存
          </a-button> -->
        </a-space>
      </template>
      <template #extra>
        <TableRightToolbar
          v-model:filter-columns="filterColumns"
          v-model:table-size="tableSize"
          v-model:loading="state.loading"
          :columns="columns"
          @reset-query="initQuery"
        />
      </template>
      <BacisTable row-key="dictId" :state="state" :columns="filterColumns" :table-size="tableSize">
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'dictType'">
            <router-link :to="`/system/dict-data/index/${scope?.record.dictId}`">
              <span>{{ scope?.record.dictType }}</span>
            </router-link>
          </template>

          <template v-if="scope?.column?.dataIndex === 'status'">
            <div gap-2>
              <DictTag :options="sys_service_type" :value="scope?.record?.status" />
            </div>
          </template>

          <template v-if="scope?.column?.dataIndex === 'action'">
            <TableAction :actions="getTableAction(scope?.record)" />
          </template>
        </template>
      </BacisTable>
    </a-card>

    <!-- 添加或修改参数配置对话框 -->
    <a-modal v-bind="modal">
      <a-form :model="form" :rules="rules" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="字典名称" name="dictName" :rules="[{ required: true, message: '字典名称不能为空' }]">
          <a-input v-model="form.dictName" placeholder="请输入字典名称" />
        </a-form-item>
        <a-form-item label="字典类型" name="dictType" :rules="[{ required: true, message: '字典类型不能为空' }]">
          <a-input v-model="form.dictType" placeholder="请输入字典类型" />
        </a-form-item>
        <a-form-item label="备注" name="remark">
          <a-textarea v-model="form.remark" placeholder="请输入内容" />
        </a-form-item>
      </a-form>
    </a-modal>
  </PageContainer>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { DownOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { delTypeApi, listTypeApi } from '@/api/system/dict/type';
import type { DictTypeForm, DictTypeVO } from '@/api/system/dict/type/types';
import type { ActionItem } from '@/components/Table';
import { BacisTable, TableAction, TableRightToolbar } from '@/components/Table';
import { addDateRange } from '@/utils/tools';

const dictStore = useDictStore();
const { sys_service_type } = toRefs<any>(dictStore.getDict('sys_service_type'));
const { hasAccess } = useAccess();
const message = useMessage();
const columns = [
  {
    title: '序号',
    dataIndex: 'serialNumber',
    key: 'serialNumber',
    customRender: ({ index }: { index: number }) => {
      return index + 1;
    },
    width: 60,
    disabled: true
  },
  {
    title: '字典名称',
    dataIndex: 'dictName',
    key: 'dictName',
    width: 200,
    resizable: true
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    key: 'dictType',
    width: 200,
    resizable: true
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 200,
    minWidth: 200,
    maxWidth: 400,
    resizable: true,
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 180
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    width: 120
  }
];
const loading = shallowRef(false);
const dateRange = ref<any>([]);
const { state, initQuery, resetQuery, query } = useTableQuery({
  queryApi: listTypeApi,
  queryParams: {
    dictName: null,
    dictType: null
  },
  beforeQuery: () => {
    const queryParams = addDateRange(state.queryParams, dateRange.value);
    state.queryParams = queryParams;
  },
  afterQuery: (res) => {
    return res;
  }
});

const tableSize = ref<('small' | 'middle' | 'large')>('middle');

const modal = ref({
  open: false,
  title: '添加字典类型',
  width: 500,
  onOk: () => {
    modal.value.open = false;
    initQuery();
  },
  onCancel: () => {
    modal.value.open = false;
  }
});

const form = ref<DictTypeVO>({});
const rules: Record<string, Rule[]> = {
  dictName: [
    { required: true, message: '字典名称不能为空', trigger: 'change' }
  ],
  dictType: [
    { required: true, message: '字典类型不能为空', trigger: 'change' }
  ]
};

const dropdownVisible = ref(false);
// 备份columns
const filterColumns = shallowRef(columns.filter((e: any) => !e.hide));

function getTableAction(record: DictTypeForm): ActionItem[] {
  return [
    {
      label: '编辑',
      onClick: handleEdit.bind(null, record)
    },
    {
      label: '删除',
      color: '#ff4d4f',
      popConfirm: {
        title: '是否确认删除',
        onConfirm: handleDelete.bind(null, record)
      }
    }
  ];
}

/**
 * 删除功能
 *  @param record
 *
 */
async function handleDelete(record: DictTypeForm) {
  const close = message.loading('删除中......');
  try {
    const res = await delTypeApi(record.dictId);
    if (res.code === 200) {
      initQuery().then(() => {
        message.success('删除成功');
      });
    }
  }
  catch (e) {
    console.log(e);
  }
  finally {
    close();
  }
}

function handleEdit(record: DictTypeForm) {
  modal.value.open = true;
}

onMounted(() => {
  initQuery();
});

const expand = ref(false);
</script>
