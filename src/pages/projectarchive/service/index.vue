<template>
  <page-container :loading="true">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="18">
          <SearchSelectList v-model="selectValue" :options="SearchSelectOptions" :filter="filterSelectValue">
            <template #end2>
              <a-range-picker v-model:value="rangeYear" size="small" picker="year" />
            </template>
            <template #end3>
              <a-select
                v-model:value="region" :options="praiseList" size="small" placeholder="不限"
                style="width: 100px"
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
          <a-button class="absolute bottom-[10px] right-0 color-[#00000073]" :icon="h(RedoOutlined)" @click="getList" />
        </a-col>
      </a-row>
    </a-card>

    <div class="mt-5 box-border">
      <a-row :gutter="16">
        <a-col :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4">
          <a-button class="w-1/1 h-204px text-light-color" type="dashed" @click="handleAdd">
            <PlusOutlined style="font-size: 28px;" />
            <div>新增服务</div>
          </a-button>
        </a-col>
        <a-col v-for="(item, index) in data" :key="index" :xs="16" :sm="8" :md="6" :lg="6" :xl="6" class="mb-4">
          <a-card
            class="cursor-pointer transition duration-300 h-204px b-r-2 success
            hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.35)]"
          >
            <template #default>
              <div class="relative ">
                <h1 style="font-size: 14px;font-weight: 600;height:44px;margin-bottom:10px;">
                  {{ item.serviceName }}
                </h1>
                <div class="item-info">
                  <div>
                    <ProfileOutlined /><span class="text-span">{{ item.region }}</span>
                  </div>
                  <div>
                    <CloudOutlined /><span class="text-span">{{ item.serviceType }}</span>
                  </div>
                  <div>
                    <BranchesOutlined /><span class="text-span">{{ item.serviceYear }}</span>
                  </div>
                </div>
                <div class="absolute bottom-0 right-0">
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
        v-model:current="current" style="float:right" :total="total" :show-total="total => `共${total}条`"
        show-less-items
      />
    </div>
  </page-container>
</template>

<script setup lang="ts">
import { h } from 'vue';
import to from 'await-to-js';
import { PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { SeacrhSelectListOptions, SelectListType } from '../components/types';
import SearchSelectList from '../components/SearchSelectList.vue';
import { listService } from '@/api/projectarchive/service';
import type { ServiceQuery } from '@/api/projectarchive/service/types';

defineOptions({
  name: 'SportsEvtent'
});

const router = useRouter();
// 分页
const current = ref<number>(1);
const rangeYear = ref<any>();
const region = ref<string>('');
const searchValue = ref();
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

const data = ref<any[]>([]);
const total = ref<number>(0);

/**
 * 获取项目列表
 */
async function getList() {
  const [dataType, serviceType, serviceYear, region] = selectValue.value;

  const params: ServiceQuery = {
    pageSize: 10,
    pageNum: 1
  };
  if (serviceType?.length === 1) {
    params.serviceType = serviceType[0];
  }
  if (serviceYear?.length === 1) {
    params.serviceYear = serviceYear[0];
  }
  if (region?.length === 1) {
    params.region = region[0];
  }

  const [error, res] = await to(listService(params));
  if (error) {
    return;
  }
  console.log('getList', res);

  data.value = res.rows;
  total.value = res.total;
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
.text-light-color {
  color: var(--text-light-color);
}

.item-info {
  div {
    color: var(--text-light-color);
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    margin-bottom: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .text-span {
      margin-left: 6px;
      font-weight: 500;
    }
  }
}

.error,
.success {
  &::before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
  }
}

.success {
  &::before {
    background: #18c418;
  }
}

.error {
  &::before {
    background: #b42d15;
  }
}
</style>
