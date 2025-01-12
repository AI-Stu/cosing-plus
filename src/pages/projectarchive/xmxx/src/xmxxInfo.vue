<template>
  <page-container>
    <a-card :bordered="false">
      <a-descriptions title="基本信息">
        <a-descriptions-item label="项目编号">
          {{ formState.xmbh }}
        </a-descriptions-item>
        <a-descriptions-item label="项目名称">
          {{ formState.xmmc }}
        </a-descriptions-item>
        <a-descriptions-item label="委托单位">
          {{ formState.unit }}
        </a-descriptions-item>
        <a-descriptions-item label="项目地址">
          {{ formState.xmdz }}
        </a-descriptions-item>
        <a-descriptions-item label="所属区域">
          {{ formState.region }}
        </a-descriptions-item>
        <a-descriptions-item label="经纬度">
          {{ formState.latitude && formState.longitude && (`${formState.latitude}, ${formState.longitude}`) }}
        </a-descriptions-item>
        <a-descriptions-item label="签订时间">
          {{ formState.signdata }}
        </a-descriptions-item>
        <a-descriptions-item label="竣工时间">
          {{ formState.jgsj }}
        </a-descriptions-item>
        <a-descriptions-item label="是否竣工">
          {{ formState.isjg }}
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" style="margin: 10px 0;">
      <div class="flex justify-between" style="align-items: center;margin-bottom: 10px;">
        <div>项目附件</div>
        <a-button type="primary">
          添加
        </a-button>
      </div>
      <a-table :columns="columns" :data-source="data" :pagination="false" size="small">
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a @click="handle(scope?.record as ConsultTableModel)">
                详情
              </a>
            </div>
          </template>
        </template>
      </a-table>
      <a-breadcrumb style="margin: 10px 0;">
        <a-breadcrumb-item>施工图建筑面积预绘测</a-breadcrumb-item>
        <a-breadcrumb-item>商业及其他用房-附件列表</a-breadcrumb-item>
      </a-breadcrumb>
      <a-table :columns="columns" :data-source="data" :pagination="false" size="small">
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a @click="handle(scope?.record as ConsultTableModel)">
                详情
              </a>
            </div>
          </template>
        </template>
      </a-table>
      <div class="flex" style="align-items: center;margin-top: 10px;">
        <span>附件评分：</span><a-input v-model:value="searchValue" style="width: 158px;" placeholder="评分" />
      </div>
    </a-card>
    <a-card :bordered="false" style="margin: 10px 0;">
      <div class="flex justify-between" style="align-items: center;margin-bottom: 10px;">
        <div>挂接服务</div>
        <a-button type="primary">
          添加
        </a-button>
      </div>
      <a-table :columns="columns" :data-source="data" :pagination="false" size="small">
        <template #bodyCell="scope">
          <template v-if="scope?.column?.dataIndex === 'action'">
            <div flex gap-2>
              <a @click="handle(scope?.record as ConsultTableModel)">
                详情
              </a>
            </div>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-card :bordered="false" class="position-sticky bottom-0 border-rd-0  shadow">
      <a-flex>
        <a-col :span="18">
          <a-button type="primary" :icon="h(ArrowLeftOutlined)" @click="router.push('/project/manage')">
            返回
          </a-button>
        </a-col>
        <a-col :span="6" text-right>
          <a-button :icon="h(RedoOutlined)" mr-4 @click="handleReset()">
            恢复
          </a-button>
          <a-button type="primary" :icon="h(FileDoneOutlined)" @click="handleUpdate()">
            保存
          </a-button>
        </a-col>
      </a-flex>
    </a-card>
  </page-container>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { ArrowLeftOutlined, FileDoneOutlined, RedoOutlined } from '@ant-design/icons-vue';
import to from 'await-to-js';
import { getXmxx, updateXmxx } from '@/api/projectarchive/xmxx/index';
import type { XmxxVO } from '@/api/projectarchive/xmxx/types';

interface DataItem {
  key: number
  fj: string
  jsbz: string
  type: string
  num: number
  time: string
}

const route = useRoute();
const router = useRouter();
const xmxxid = route.params.id as string | undefined;

const formState = ref<XmxxVO>({});
const data: DataItem[] = [
  {
    key: 1,
    fj: 'John Brown sr.',
    jsbz: '5467878',
    type: 'New York No. 1 Lake Park',
    num: 111,
    time: '2025-1-2'
  }
];
const columns = [
  {
    title: '应收附件',
    dataIndex: 'fj',
    key: 'fj'
  },
  {
    title: '技术标准',
    dataIndex: 'jsbz',
    key: 'jsbz'
  },
  {
    title: '资料类型',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: '数量',
    dataIndex: 'num',
    key: 'num'
  },
  {
    title: '创建时间',
    dataIndex: 'time',
    key: 'time'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 80
  }
];
const searchValue = ref(95);

async function getInfo() {
  if (xmxxid) {
    const [err, res] = await to(getXmxx(xmxxid));
    if (res) {
      formState.value = res.data;
    }
  }
}

function handle(record: ConsultTableModel) {
}

/**
 * 保存
 */
async function handleUpdate() {
  const params = {

  };
  const [err, res] = await to(updateXmxx(params));
  if (res) {
    console.log(res);
  }
}

/**
 * 重置
 */
function handleReset() {
  getInfo();
}

onBeforeMount(() => {
  getInfo();
});
</script>

<style lang="less" scoped>
.title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
