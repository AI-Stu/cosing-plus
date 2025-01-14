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
              <a-select
                v-model:value="region" :options="regionList" mode="tags" size="small" placeholder="不限" :max-tag-count="1" :max-tag-text-length="60"
                style="width: 200px;"
              />
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

    <div class="mt-5 box-border">
      <a-row :gutter="16">
        <a-col :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4">
          <a-button class="w-1/1 h-204px text-light-color" type="dashed" @click="handleAdd">
            <PlusOutlined style="font-size: 28px;" />
            <div>新增项目</div>
          </a-button>
        </a-col>
        <a-col v-for="(item, index) in data" :key="index" :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4 ">
          <a-card
            class="cursor-pointer transition duration-300 h-full b-r-2 success
            hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.35)]"
            :body-style="{ height: '100%', padding: '14px 20px' }"
          >
            <template #default>
              <div class="flex flex-col h-full">
                <h1 font-bold h-48px mb-2>
                  {{ item.xmmc }}
                </h1>
                <div>
                  <div class="item-info">
                    <UserOutlined /><span class="text-span">{{ item.unit }}</span>
                  </div>
                  <div class="item-info">
                    <CalendarOutlined /><span class="text-span">{{ item.signdata }}</span>
                  </div>
                  <div class="item-info">
                    <ProfileOutlined /><span class="text-span">数据标准（{{ item.standard || 0 }}）</span>
                  </div>
                  <div class="item-info">
                    <CloudOutlined /><span class="text-span">挂接服务（{{ item.service || 0 }}）</span>
                  </div>
                </div>
                <div flex items-center justify-between>
                  <div class="item-info">
                    <BranchesOutlined /><span class="text-span">附件（{{ item.attachment || 0 }}）</span>
                  </div>
                  <div flex items-center>
                    <a-popconfirm
                      title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                      @confirm="handleDelete(item)"
                    >
                      <a-button type="text" mr-3 size="small">
                        删除
                      </a-button>
                    </a-popconfirm>
                    <a-button type="primary" ghost size="small" @click="handleInfo(item)">
                      详情
                    </a-button>
                  </div>
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
import { delXmxxApi, listXmxxApi } from '@/api/projectarchive/xmxx';
import type { XmxxQuery } from '@/api/projectarchive/xmxx/types';

defineOptions({
  name: 'XMXXList'
});
const router = useRouter();
const message = useMessage();
// 分页
const current = ref<number>(1);
const rangeYear = ref<any>();
const region = ref<string>();
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

// 区划
const regionList = shallowRef([
  {
    label: '青田县',
    value: '青田县'
  },
  {
    label: '缙云县',
    value: '缙云县'
  },
  {
    label: '遂昌县',
    value: '遂昌县'
  },
  {
    label: '松阳县',
    value: '松阳县'
  },
  {
    label: '云和县',
    value: '云和县'
  },
  {
    label: '庆元县',
    value: '庆元县'
  },
  {
    label: '景宁畲族自治县',
    value: '景宁畲族自治县'
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
  // if (isjg?.length === 1) {
  //   params.isjg = isjg[0];
  // }
  if (signdata?.length === 1) {
    params.signdata = signdata[0];
  }
  if (region?.length === 1) {
    params.region = region[0];
  }

  const [error, res] = await to(listXmxxApi(params));
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
  console.log(item);

  // 如果步骤没走完，继续新建流程
  if (item.step !== 3) {
    router.push({
      path: `/project/manage/add`,
      query: {
        xmxxid: item.xmxxid,
        step: item.step || 0
      }
    });
    return;
  }

  router.push({
    path: `/project/manage/${item.xmxxid}`
  });
}

/**
 * 删除项目
 * @param item
 */
function handleDelete(item: any) {
  console.log(item);
  delXmxxApi(item.xmxxid).then(() => {
    message.success('删除成功');
    getList();
  });
}

onMounted(() => {
  getList();
});
</script>

<style lang="less">
.text-light-color{
  color: var(--text-light-color);
}

.item-info{
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
</style>
