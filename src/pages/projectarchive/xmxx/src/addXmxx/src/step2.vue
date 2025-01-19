<template>
  <div>
    <div style="width:700px;margin: 0 auto;">
      <a-alert
        v-if="visible.alert"
        type="info"
        closable
        show-icon
        :after-close="() => visible.alert = false"
      >
        <template #message>
          <div>共选择 {{ total.dataStandards }} 项标准，共需提交 {{ total.file }} 个文件</div>
        </template>
        <template #action>
          <a-popconfirm
            title="确定重置选择？" ok-text="确定" cancel-text="取消"
            @confirm="reset"
          >
            <a-button type="link" mr-3 size="small">
              重置选择
            </a-button>
          </a-popconfirm>
        </template>
      </a-alert>
      <a-button type="primary" my-3 @click="visible.madel = true">
        添加
      </a-button>
      <a-table
        style="margin-bottom: 10px;"
        :loading="state.loading"
        :columns="filterColumns"
        :pagination="false"
        :data-source="state.dataSource"
        size="small"
      >
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'action'">
            <a-popconfirm
              title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
              @confirm="handleDelete(scope.index, scope.record)"
            >
              <a-button type="text" mr-3 size="small">
                删除
              </a-button>
            </a-popconfirm>
          </template>
          <template v-if="scope?.column?.dataIndex === 'sl'">
            <div gap-2>
              <a-button type="link" block>
                {{ scope?.record?.sl || 0 }}
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
      <div style="clear: both;" />
      <div float-right mb-4>
        <a-button mr-4 @click="prevStep">
          上一步
        </a-button>
        <a-button type="primary" @click="nextStep">
          下一步
        </a-button>
      </div>
    </div>
    <a-divider />
    <div class="step-form-style-desc ant-steps-item-title">
      <h3>
        说明
      </h3>
      <h4>数据标注来自数据标准管理，有补充请联系管理员。</h4>
      <h4>附件除数据标准内已有选项，缺失项可以自行添加。</h4>
    </div>

    <DataModal v-model:open="visible.madel" @close="visible.madel = false" @ok="handleOk" />
  </div>
</template>

<script setup lang="ts">
import { cloneDeep, isEqual } from 'lodash-es';
import { Api, columns } from './data';
import DataModal from '@/pages/projectarchive/components/DataStandardsModal/index.vue';
import type { XmxxDataStandardsRelVO } from '@/api/projectarchive/xmxxDataStandardsRel/types';

const emit = defineEmits(['prevStep', 'nextStep']);
const xmxxid = inject('xmxxid') as string;
const message = useMessage();

let resetData: XmxxDataStandardsRelVO[] = []; // 优化提交
const filterColumns = shallowRef(columns.filter((e: any) => !e.hide));
const visible = ref({
  alert: true,
  madel: false
});
const dataSource = shallowRef<XmxxDataStandardsRelVO[]>([]);
const { state, initQuery } = useTableQuery({
  queryApi: Api.LIST_API,
  queryOnMounted: false,
  queryParams: {
    xmid: null,
    pageNum: 1,
    pageSize: 5000
  },
  afterQuery: (res) => {
    res.forEach((e: any) => {
      e.parentPath = e.dataStandards.split('/').slice(0, -1).join('/') || '/';
    });

    resetData = cloneDeep(res) as unknown as any[];
    return res;
  }
});

const total = reactive({
  dataStandards: 0,
  file: 0
});

watch(() => state.dataSource, (value) => {
  total.dataStandards = value.length;
  total.file = value.reduce((a, b) => a + (b.sl || 0), 0);
});

// 获取列表
function getList() {
  state.queryParams.xmid = xmxxid;
  initQuery();
}

/**
 * 删除功能
 * @param index
 * @param record
 */
async function handleDelete(index: number, record: XmxxDataStandardsRelVO) {
  if (record.xmid && record.id) {
    await Api.DEL_API(record.id);
  }
  state.dataSource.splice(index, 1);
  message.success('删除成功');
}

function handleOk(rows: []) {
  console.log('handleOk', rows);

  // const values = groupBy(rows, 'class');
  state.dataSource = cloneDeep([...toRaw(state.dataSource), ...rows]);
}

// 上一步
function prevStep() {
  emit('prevStep');
}

// 下一步
async function nextStep() {
  if (xmxxid) {
    if (!isEqual(resetData, state.dataSource)) {
      await Api.SAVE_API(xmxxid, state.dataSource);
      resetData = cloneDeep(dataSource.value);
      message.success('保存成功');
    }
  }
  emit('nextStep');
}

// 重置
function reset() {
  dataSource.value = cloneDeep(resetData);
}

onBeforeMount(async () => {
  if (xmxxid) {
    getList();
  }
});

onMounted(() => {

});
</script>

  <style lang="less" scoped>
  .step-form-style-desc {
    padding: 0 56px;

    h3 {
      margin: 0 0 12px;
      font-size: 16px;
      line-height: 32px;
    }

    h4 {
      margin: 0 0 4px;
      font-size: 14px;
      line-height: 22px;
    }

    p {
      margin-top: 0;
      margin-bottom: 12px;
      line-height: 22px;
    }
  }
  </style>
