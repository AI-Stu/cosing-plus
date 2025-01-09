<template>
  <div>
    <div style="width:700px;margin: 0 auto;">
      <a-alert
        v-if="visible"
        type="info"
        closable
        show-icon
        :after-close="handleClose"
      >
        <template #message>
          <div>共选择15项标准，共需提交45个文件</div>
        </template>
        <template #action>
          <a-button size="small" type="link">
            取消选择
          </a-button>
        </template>
      </a-alert>
      <a-button size="small" type="primary" style="margin: 10px 0;" @click="openClick">
        添加
      </a-button>
      <a-table style="margin-bottom: 10px;" :loading="loading" :columns="filterColumns" :pagination="false" :data-source="dataSource" size="small">
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a c-error @click="handleDelete(scope?.record as ConsultTableModel)">
                删除
              </a>
            </div>
          </template>
          <template v-if="scope?.column?.dataIndex === 'fj'">
            <div gap-2>
              <a-button type="link" block>
                {{ scope?.record?.fj || 1 }}
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
      <div style="clear: both;" />
      <div style="float:right; margin-bottom: 10px;">
        <a-button type="primary" @click="nextStep">
          下一步
        </a-button>
        <a-button style="margin-left: 8px" @click="prevStep">
          上一步
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

    <modal :open="open" @close="modalClose" />
  </div>
</template>

<script setup lang="ts">
import modal from './modal.vue';
import type { ConsultTableModel, ConsultTableParams } from '@/api/list/table-list';
import { deleteApi, getListApi } from '@/api/list/table-list';

const emit = defineEmits(['prevStep', 'nextStep']);
const columns = shallowRef([
  {
    title: '序号',
    dataIndex: 'id'
  },
  {
    title: '数据标准',
    dataIndex: 'name'
  },
  {
    title: '父级目录',
    dataIndex: 'desc',
    ellipsis: true
  },
  {
    title: '技术标准',
    dataIndex: 'callNo',
    ellipsis: true
  },
  {
    title: '附件',
    dataIndex: 'fj',
    width: 50
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80
  }
]);
const open = ref(false);
const visible = ref<boolean>(true);
const message = useMessage();
// 数据
const loading = shallowRef(false);

const dataSource = shallowRef<ConsultTableModel[]>([]);
const formModel = reactive<ConsultTableParams>({
  name: undefined,
  callNo: undefined,
  desc: undefined,
  status: undefined,
  updatedAt: undefined
});

const getCheckList = computed(() => columns.value.map(item => item.dataIndex));
function handleClose() {
  visible.value = false;
}

function openClick() {
  open.value = true;
}

/**
 * 过滤
 *
 */
function filterAction(value: string[]) {
  return columns.value.filter((item) => {
    if (value.includes(item.dataIndex)) {
      // 为true时，循环遍历的值会暴露出去
      return true;
    }
    return false;
  });
}
// 备份columns
const filterColumns = ref(filterAction(getCheckList.value));

function modalClose() {
  open.value = false;
}

async function init() {
  if (loading.value)
    return;
  loading.value = true;
  try {
    const { data } = await getListApi({
      ...formModel
    });
    dataSource.value = data ?? [];
  }
  catch (e) {
    console.log(e);
  }
  finally {
    loading.value = false;
  }
}

/**
 * 删除功能
 *  @param record
 *
 */
async function handleDelete(record: ConsultTableModel) {
  const close = message.loading('删除中......');
  try {
    const res = await deleteApi(record!.id);
    if (res.code === 200)
      await init();
    message.success('删除成功');
  }
  catch (e) {
    console.log(e);
  }
  finally {
    close();
  }
}

function prevStep() {
  emit('prevStep');
}
async function nextStep() {
  emit('nextStep');
}

onMounted(() => {
  init();
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
