<template>
  <page-container :loading="true">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="18">
          <SearchSelectList v-model="selectValue" :options="SearchSelectOptions" :filter="filterSelectValue">
            <template #end2>
              <a-range-picker v-model:value="value5" size="small" picker="year" />
            </template>
            <template #end3>
              <a-select size="small" placeholder="不限" style="width: 100px" :options="praiseList" />
            </template>
          </SearchSelectList>
        </a-col>
        <a-col :span="6" style="text-align: right;position:relative;">
          <a-input v-model:value="searchValue" placeholder="请输入服务名称">
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
          <a-button class="w-1/1 h-204px text-light-color" type="dashed" @click="handleAdd">
            <PlusOutlined style="font-size: 28px;" />
            <div>新增服务</div>
          </a-button>
        </a-col>
        <a-col v-for="(item, index) in data" :key="index" :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4">
          <a-card
            :bordered="false" style="border-color: 0" class="cursor-pointer
            hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.35)]
            transition
            duration-300"
          >
            <template #default>
              <div class="flex h-27" :class=" index === 0 ? 'success' : 'error'">
                <div class="ml">
                  <div style="font-size: 18px; font-weight: 500;">
                    {{ item.title }}
                  </div>
                  <div class="h-17 overflow-hidden overflow text-light-color">
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
  </page-container>
</template>

<script setup lang="ts">
import { h } from 'vue';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { SeacrhSelectListOptions, SelectListType } from '../components/types';
import SearchSelectList from '../components/SearchSelectList.vue';
import router from '@/router';

defineOptions({
  name: 'SportsEvtent'
});

const value5 = ref<any>();
const searchValue = ref();
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
const selectValue = ref<string[][]>([]);
const SearchSelectOptions = reactive<SeacrhSelectListOptions[]>([
  {
    label: '数据类别',
    options: [
      { name: '全部', value: 'all' },
      { name: '三维数据', value: '3d' },
      { name: '二维数据', value: '2d' },
      { name: '物联设备', value: 'iot' },
      { name: '物联设备', value: 'vr' }
    ]
  },
  {
    label: '服务类型',
    options: [
      { name: '全部', value: 'all' },
      { name: '倾斜摄影', value: 'mesh' },
      { name: '激光点云', value: 'lidar' },
      { name: '基础地形', value: 'terrain' },
      { name: 'BIM模型', value: 'bim' }
    ]
  },
  {
    label: '年份',
    options: [
      { name: '全部', value: 'all' },
      { name: '2024', value: '2024' },
      { name: '2023', value: '2023' },
      { name: '2022', value: '2022' },
      { name: '2021', value: '2021' },
      { name: '2020', value: '2020' }
    ],
    isMultiple: true
  },
  {
    label: '区域',
    options: [
      { name: '全部', value: 'all' },
      { name: '市本级', value: '市本级' },
      { name: '莲都区', value: '莲都区' },
      { name: '龙泉市', value: '龙泉市' }
    ],
    isMultiple: true
  }
]);

function filterSelectValue(items: SelectListType[]): string[] {
  return items.map(e => e.value);
}

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
/**
 * 新增项目
 */
function handleAdd() {
  router.push({
    path: '/data/service/add'
  });
}

/**
 * 项目详情
 * @param item
 */
function handleInfo(item: any) {
  router.push({
    path: `/project/manage/${item.id}`
  });
  console.log(item);
}

/**
 * 删除项目
 * @param item
 */
function handleDel(item: any) {
  console.log(item);
}
</script>

<style land="less" scoped>
.item-btm {
  margin-bottom: 12px;
}
.text-light-color{
  color: var(--text-light-color);
}

.error,
.success{
  &::before{
    position: absolute;
    content:"";
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
  }
}
.success{
  &::before{
    background: #18c418;
  }
}

.error{
  &::before{
    background: #b42d15;
  }
}

.category-other-item {
  .ant-form-item {
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
