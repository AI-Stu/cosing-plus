<template>
  <page-container>
    <a-card :bordered="false">
      <a-descriptions title="基本信息">
        <a-descriptions-item label="项目编号">
          1000000000
        </a-descriptions-item>
        <a-descriptions-item label="项目名称">
          1234123421
        </a-descriptions-item>
        <a-descriptions-item label="委托单位">
          1234123421
        </a-descriptions-item>
        <a-descriptions-item label="项目地址">
          3214321432
        </a-descriptions-item>
        <a-descriptions-item label="所属区域">
          1000000000
        </a-descriptions-item>
        <a-descriptions-item label="经纬度">
          111
        </a-descriptions-item>
        <a-descriptions-item label="签订时间">
          1234123421
        </a-descriptions-item>
        <a-descriptions-item label="竣工时间">
          1234123421
        </a-descriptions-item>
        <a-descriptions-item label="是否竣工">
          1234123421
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" style="margin: 10px 0;">
      <div class="flex justify-between" style="align-items: center;margin-bottom: 10px;">
        <div>项目附件</div>
        <a-button size="small" type="primary">
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
        <a-button size="small" type="primary">
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
    <a-card :bordered="false" style="margin: 10px 0;">
      <a-row>
        <a-col :span="18">
          <a-button type="primary" size="small">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
            返回
          </a-button>
        </a-col>
        <a-col :span="6" style="text-align: right;">
          <a-button size="small">
            <template #icon>
              <RedoOutlined />
            </template>
            恢复
          </a-button>
          <a-button style="margin-left: 10px;" type="primary" size="small">
            <template #icon>
              <FileDoneOutlined />
            </template>
            保存
          </a-button>
        </a-col>
      </a-row>
    </a-card>
  </page-container>
</template>

<script setup lang="ts">
import { ArrowLeftOutlined, FileDoneOutlined, RedoOutlined } from '@ant-design/icons-vue';
import type { ConsultTableModel } from '@/api/list/table-list';

interface DataItem {
  key: number
  fj: string
  jsbz: string
  type: string
  num: number
  time: string
}

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

function handle(record: ConsultTableModel) {
}
</script>

    <style lang="less" scoped>
    .title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 16px;
    }
    </style>
