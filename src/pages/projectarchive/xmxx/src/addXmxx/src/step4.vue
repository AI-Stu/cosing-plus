<template>
  <div>
    <a-form>
      <a-result title="操作成功" :is-success="true" sub-title="预计两小时内到账" style="max-width: 560px; margin: 40px auto 0;">
        <div class="information">
          <a-row>
            <a-col :sm="8" :xs="24">
              服务编号：
            </a-col>
            <a-col :sm="16" :xs="24">
              antdv@aibayanyu.com
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">
              服务名称：
            </a-col>
            <a-col :sm="16" :xs="24">
              test@example.com
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">
              所属区域：
            </a-col>
            <a-col :sm="16" :xs="24">
              <span class="money">1,000,000</span> 元
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">
              服务地址：
            </a-col>
            <a-col :sm="16" :xs="24">
              Kirk Lin
            </a-col>
          </a-row>
          <a-row>
            <a-col :sm="8" :xs="24">
              范围：
            </a-col>
            <a-col :sm="16" :xs="24">
              Kirk Lin
            </a-col>
          </a-row>

          <a-row>
            <a-col :sm="24" :xs="24">
              关联存储数据：
            </a-col>
            <a-col :sm="24" :xs="24">
              <a-table :columns="columns" :data-source="data" :pagination="false" size="small" />
            </a-col>
          </a-row>
        </div>
        <template #extra>
          <a-button type="primary" @click="finish">
            再录一条
          </a-button>
          <a-button style="margin-left: 8px" @click="toOrderList">
            返回台账
          </a-button>
        </template>
      </a-result>
    </a-form>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['finish']);
const router = useRouter();

const xmxxid = inject('xmxxid') as string;
// 数据
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

function finish() {
  emit('finish');
}
function toOrderList() {
  router.push('/project/manage');
}
</script>

<style lang="less" scoped>
.information {
  line-height: 22px;

  .ant-row:not(:last-child) {
    margin-bottom: 24px;
  }
}

.money {
  font-family: "Helvetica Neue", sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 14px;
}
</style>
