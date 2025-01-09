<template>
  <page-container :hide-in-breadcrumb="true" :hide-in-title="true">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="18">
          <SearchSelectList v-model="selectValue" :options="SearchSelectOptions" :filter="filterSelectValue">
            <template #end2>
              <a-range-picker v-model:value="rangeYear" size="small" picker="year" />
            </template>
            <template #end3>
              <a-select v-model:value="region" size="small" :options="praiseList" placeholder="不限" style="width: 100px" />
            </template>
          </SearchSelectList>
        </a-col>
        <a-col :span="6" style="text-align: right;position:relative;">
          <a-input v-model:value="searchValue" placeholder="请输入项目名称">
            <template #suffix>
              <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
            </template>
          </a-input>
          <a-button
            class="absolute bottom-[10px] right-0 color-[#00000073]"
            :icon="h(RedoOutlined)"
            @click="getList"
          />
        </a-col>
      </a-row>
    </a-card>

    <div class="mt-5 p-[20px] b-white box-border">
      <a-row :gutter="16">
        <a-col :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4">
          <a-button class="w-1/1 h-204px text-light-color" type="dashed" @click="handleAdd">
            <PlusOutlined style="font-size: 28px;" />
            <div>新增项目</div>
          </a-button>
        </a-col>
        <a-col v-for="(item, index) in data" :key="index" :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4 ">
          <a-card
            style="border-left: 3px solid #108ee9; border-radius: 0"
            class="cursor-pointer transition duration-300 h-204px b-r-2
            hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.35)]"
          >
            <template #default>
              <div class="relative">
                <h1 style="font-size: 14px;font-weight: 600;height:44px;margin-bottom:10px;">
                  {{ item.xmmc }}
                </h1>
                <div class="item-info">
                  <div><UserOutlined /><span class="text-span">{{ item.unit }}</span></div>
                  <div><CalendarOutlined /><span class="text-span">{{ item.signdata }}</span></div>
                  <div><ProfileOutlined /><span class="text-span">数据标准（{{ item.standard }}）</span></div>
                  <div><CloudOutlined /><span class="text-span">挂接服务（{{ item.service }}）</span></div>
                  <div><BranchesOutlined /><span class="text-span">附件（{{ item.attachment }}）</span></div>
                </div>
                <div class="rt-post">
                  <a-button type="text" style="margin-right:5px;" size="small" @click="handleDel(item)">
                    删除
                  </a-button>
                  <a-button type="primary" ghost size="small" @click="handleInfo(item)">
                    详情
                  </a-button>
                </div>
              </div>
            </template>
          </a-card>
        </a-col>
      </a-row>
      <a-pagination
        v-model:current="current"
        style="float:right"
        :total="total"
        :show-total="total => `共${total}条`"
        show-less-items
      />
    </div>
  </page-container>
</template>

<script setup lang="ts">
import {
  BranchesOutlined,
  CalendarOutlined,
  CloudOutlined,
  PlusOutlined,
  ProfileOutlined,
  RedoOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons-vue';
import { h } from 'vue';
import to from 'await-to-js';
import type { SeacrhSelectListOptions, SelectListType } from '../components/types';
import SearchSelectList from '../components/SearchSelectList.vue';
import { listXmxx } from '@/api/projectarchive/xmxx';
import type { XmxxQuery } from '@/api/projectarchive/xmxx/types';

defineOptions({
  name: 'XMXXList'
});
const router = useRouter();
// 分页
const current = ref<number>(1);
const rangeYear = ref<any>();
const region = ref<string>('');
const searchValue = ref<string>('');
const selectValue = ref<string[][]>([]);
const SearchSelectOptions = reactive<SeacrhSelectListOptions[]>([
  {
    label: '项目进度',
    options: [
      { name: '全部', value: 'all' },
      { name: '已开工', value: 1 },
      { name: '已竣工', value: 2 }
    ]
  },
  {
    label: '文档完备',
    options: [
      { name: '全部', value: 'all' },
      { name: '待完备', value: 1 },
      { name: '已完备', value: 2 }
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
function filterSelectValue(items: SelectListType[]): (string | number)[] {
  return items.map(e => e.value);
}

const data = ref<any[]>([]);
const total = ref<number>(0);

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
 * 获取项目列表
 */
async function getList() {
  const [isjg, isWb, signdata, region] = selectValue.value;

  const params: XmxxQuery = {
    pageSize: 10,
    pageNum: 1
  };
  if (isjg?.length === 1) {
    params.isjg = isjg[0];
  }
  if (signdata?.length === 1) {
    params.signdata = signdata[0];
  }
  if (region?.length === 1) {
    params.region = region[0];
  }

  const [error, res] = await to(listXmxx(params));
  if (error) {
    return;
  }
  console.log('getList', res);

  data.value = res.rows;
  total.value = res.total;
}

/**
 * 新增项目
 */
function handleAdd() {
  router.push({
    path: '/project/manage/add'
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

onMounted(() => {
  getList();
});
</script>

<style lang="less">
.item-btm{
  margin-bottom: 12px;
}

.text-light-color{
  color: var(--text-light-color);
}

.category-other-item{
  .ant-form-item{
    margin-bottom: 0;
  }
}
.item-info{
  div{
    color: var(--text-light-color);
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

.rt-post{
  position: absolute;
  bottom: 0;
  right: -5px;
}
</style>
