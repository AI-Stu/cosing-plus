<template>
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
                @click="handleClick(item, activeList1, list1)"
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
                @click="handleClick(item, activeList2, list2)"
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
                @click="handleClick(item, activeList3, list3)"
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
                @click="handleClick(item, activeList4, list4)"
              >
                {{ item.name }}
              </a-tag>
              <a-select size="small" placeholder="不限" style="width: 100px" :options="praiseList" />
            </div>
          </a-form-item>
        </a-form>
      </a-col>
      <a-col :span="6" style="text-align: right;position:relative;">
        <a-input v-model:value="userName" placeholder="Basic usage">
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
        <a-button class="w-1/1 h-204px" type="dashed">
          +新增产品
        </a-button>
      </a-col>
      <a-col v-for="(item, index) in data" :key="index" :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4">
        <a-card
          :bordered="false"
          style="border-color: 0"
          class="cursor-pointer
            hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.35)]
            transition
            duration-300"
        >
          <template #default>
            <div class="flex h-27">
              <div class="w-10 h-10 bg-gray-300 rounded-full">
                <img class="w-10 h-10 rounded-full" :src="item.link">
              </div>
              <div class="ml">
                <div style="font-size: 18px; font-weight: 500;">
                  {{ item.title }}
                </div>
                <div class="h-17 overflow-hidden overflow">
                  {{ content }}
                </div>
              </div>
            </div>
          </template>
          <template #actions>
            <li>操作一</li>
            <li>操作二</li>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { h, ref, shallowRef } from 'vue';
import { RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';

defineOptions({
  name: 'SportsEvtent'
});

const value5 = ref<any>();
const content = '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。';

const data = ref([
  {
    title: 'Aipay',
    link: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png'
  },
  {
    title: 'Ant Design Vue',
    link: 'https://www.antdv.com/assets/logo.1ef800a8.svg'
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
function handleClick(item: ListType, list: string[], arr) {
  if (item.key === 'all') {
    if (list.includes('all')) {
      // 删除全部选中
      list = [];
      return;
    }
    else {
      // 全部选中
      list = arr.map(v => v.key);
    }
    return;
  }
  if (list.includes(item.key)) {
    // 删除当前选中
    list = list.filter(v => v !== item.key);
    if (list.includes('all')) {
      // 删除全部选中
      list = list.filter(v => v !== 'all');
    }
  }
  else {
    // 添加当前选中
    list = [...list, item.key];
    if (list.length === arr.length - 1) {
      // 全部选中
      list = [...list, 'all'];
    }
  }
}
const authorList = shallowRef([
  {
    label: '付晓晓',
    value: '付晓晓'
  },
  {
    label: '周毛毛',
    value: '周毛毛'
  }
]);
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
.overflow {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>
