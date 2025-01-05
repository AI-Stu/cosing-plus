<template>
  <page-container :hide-in-breadcrumb="true" :hide-in-title="true">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="18">
          <a-form :label-col="{ style: { width: '100px', textAlign: 'left' } }">
            <a-form-item class="item-btm" label="项目进度">
              <div class="flex flex-wrap gap-2">
                <a-tag
                  v-for="item in list1"
                  :key="item.key"
                  cursor-pointer
                  :color="activeList1.includes(item.key) ? '#108ee9' : ''"
                  @click="handleClick(item)"
                >
                  {{ item.name }}
                </a-tag>
              </div>
            </a-form-item>
            <a-form-item class="item-btm" label="文档完备">
              <div class="flex flex-wrap gap-2">
                <a-tag
                  v-for="item in list2"
                  :key="item.key"
                  cursor-pointer
                  :color="activeList2.includes(item.key) ? '#108ee9' : ''"
                  @click="handleClick(item)"
                >
                  {{ item.name }}
                </a-tag>
              </div>
            </a-form-item>
            <a-form-item class="item-btm" label="年份">
              <div class="flex flex-wrap gap-2">
                <a-tag
                  v-for="item in list3"
                  :key="item.key"
                  cursor-pointer
                  :color="activeList3.includes(item.key) ? '#108ee9' : ''"
                  @click="handleClick(item)"
                >
                  {{ item.name }}
                </a-tag>
                <a-range-picker v-model:value="value5" size="small" picker="year" />
              </div>
            </a-form-item>
            <a-form-item class="item-btm" label="区域">
              <div class="flex flex-wrap gap-2">
                <a-tag
                  v-for="item in list4"
                  :key="item.key"
                  cursor-pointer
                  :color="activeList4.includes(item.key) ? '#108ee9' : ''"
                  @click="handleClick(item)"
                >
                  {{ item.name }}
                </a-tag>
                <a-select size="small" placeholder="不限" style="width: 100px" :options="praiseList" />
              </div>
            </a-form-item>
          </a-form>
        </a-col>
        <a-col :span="6" style="text-align: right;position:relative;">
          <a-input v-model:value="searchValue" placeholder="搜索項目">
            <template #suffix>
              <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
            </template>
          </a-input>
          <a-button style="position: absolute;bottom: 10px;right: 0;color: rgba(0, 0, 0, 0.45)" :icon="h(RedoOutlined)" />
        </a-col>
      </a-row>
    </a-card>

    <div class="mt-5" style="background: #fff;padding: 20px;box-sizing: border-box;">
      <a-row :gutter="16">
        <a-col :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4">
          <a-button class="w-1/1 h-204px" type="dashed" @click="addProject">
            +点击新增项目
          </a-button>
        </a-col>
        <a-col v-for="(item, index) in data" :key="index" :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4 ">
          <a-card
            style="border-left: 3px solid #108ee9; border-radius: 0"
            class="cursor-pointer
            hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.35)]
            transition
            duration-300 h-204px"
          >
            <template #default>
              <div class="box">
                <h1 style="font-size: 14px;font-weight: 600;height:44px;margin-bottom:10px;">
                  {{ item.title }}
                </h1>
                <div class="item-info">
                  <div><UserOutlined /><span class="text-span">{{ item.name }}</span></div>
                  <div><CalendarOutlined /><span class="text-span">{{ item.time }}</span></div>
                  <div><ProfileOutlined /><span class="text-span">{{ item.standard }}</span></div>
                  <div><CloudOutlined /><span class="text-span">{{ item.service }}</span></div>
                  <div><BranchesOutlined /><span class="text-span">{{ item.attachment }}</span></div>
                </div>
                <div class="rt-post">
                  <a-button type="text" style="margin-right:5px;" size="small">
                    删除
                  </a-button>
                  <a-button type="primary" ghost size="small">
                    详情
                  </a-button>
                </div>
              </div>
            </template>
          </a-card>
        </a-col>
      </a-row>
      <a-pagination v-model:current="current" style="float:right" :total="50" :show-total="total => `共${total}条`" show-less-items />
    </div>
  </page-container>
</template>

<script setup lang="ts">
import {
  BranchesOutlined,
  CalendarOutlined,
  CloudOutlined,
  ProfileOutlined,
  RedoOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons-vue';
import { h } from 'vue';

defineOptions({
  name: 'SportsEvtent'
});
const router = useRouter();
// 分页
const current = ref<number>(1);
const value5 = ref<any>();
const searchValue = ref<string>('');
const data = ref([
  {
    title: '中台产品的研发过程中，会出现不同的设计规范和实现方式',
    name: '丽水湖房地产公司',
    time: '2024-03-17',
    standard: '数据标准',
    service: '挂接服务',
    attachment: '附件'
  },
  {
    title: '中台产品的研发过程中，会出现不同的设计规范和实现方式',
    name: '丽水湖房地产公司',
    time: '2024-03-17',
    standard: '数据标准',
    service: '挂接服务',
    attachment: '附件'
  },
  {
    title: '中台产品的研发过程中，会出现不同的设计规范和实现方式',
    name: '丽水湖房地产公司',
    time: '2024-03-17',
    standard: '数据标准',
    service: '挂接服务',
    attachment: '附件'
  },
  {
    title: '中台产品的研发过程中，会出现不同的设计规范和实现方式',
    name: '丽水湖房地产公司',
    time: '2024-03-17',
    standard: '数据标准',
    service: '挂接服务',
    attachment: '附件'
  },
  {
    title: '中台产品的研发过程中，会出现不同的设计规范和实现方式',
    name: '丽水湖房地产公司',
    time: '2024-03-17',
    standard: '数据标准',
    service: '挂接服务',
    attachment: '附件'
  }
]);
const number1 = ['已开工', '已竣工'];
const number2 = ['已完备', '待完备'];
const number3 = ['2024', '2023', '2022', '2021', '2020'];
const number4 = ['市本级', '莲都区', '龙泉市'];

interface ListType {
  name: string
  key: string
}
const list1 = shallowRef<ListType[]>([
  {
    name: '全部',
    key: 'all'
  },
  ...number1.map((v, index) => ({
    name: `${v}`,
    key: `category${index + 1}`
  }))
]);
const list2 = shallowRef<ListType[]>([
  {
    name: '全部',
    key: 'all'
  },
  ...number2.map((v, index) => ({
    name: `${v}`,
    key: `category${index + 1}`
  }))
]);
const list3 = shallowRef<ListType[]>([
  {
    name: '全部',
    key: 'all'
  },
  ...number3.map((v, index) => ({
    name: `${v}`,
    key: `category${index + 1}`
  }))
]);
const list4 = shallowRef<ListType[]>([
  {
    name: '全部',
    key: 'all'
  },
  ...number4.map((v, index) => ({
    name: `${v}`,
    key: `category${index + 1}`
  }))
]);
const activeList1 = ref<string[]>([]);
const activeList2 = ref<string[]>([]);
const activeList3 = ref<string[]>([]);
const activeList4 = ref<string[]>([]);

// 好评度
const praiseList = shallowRef([
  {
    label: '优秀',
    value: 1
  },
  {
    label: '普通',
    value: 2
  }
]);

function addProject() {
  router.push({
    path: '/projectManagement/addSportsEvtent'
  });
}

function handleClick(item: ListType) {
  if (item.key === 'all') {
    if (activeList1.value.includes('all')) {
      // 删除全部选中
      activeList1.value = [];
      return;
    }
    else {
      // 全部选中
      activeList1.value = list1.value.map(v => v.key);
    }
    return;
  }
  if (activeList1.value.includes(item.key)) {
    // 删除当前选中
    activeList1.value = activeList1.value.filter(v => v !== item.key);
    if (activeList1.value.includes('all')) {
      // 删除全部选中
      activeList1.value = activeList1.value.filter(v => v !== 'all');
    }
  }
  else {
    // 添加当前选中
    activeList1.value = [...activeList1.value, item.key];
    if (activeList1.value.length === list1.value.length - 1) {
      // 全部选中
      activeList1.value = [...activeList1.value, 'all'];
    }
  }
}
</script>

<style lang="less">
.item-btm{
  margin-bottom: 12px;
}
.category-other-item{
  .ant-form-item{
    margin-bottom: 0;
  }
}
.item-info{
  div{
    color: #88929e;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    margin-bottom: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .text-span{
      margin-left: 6px;
      font-weight: 500;
    }
  }
}
.box{
  position: relative;
}
.rt-post{
  position: absolute;
  bottom: 0;
  right: -5px;
}
</style>
