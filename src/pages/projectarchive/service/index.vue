<template>
  <page-container :loading="true">
    <a-card :bordered="false">
      <a-row>
        <a-col :span="18">
          <SearchSelectList v-model="selectValue" :options="SearchSelectOptions" :filter="filterSelectValue">
            <template #end1>
              <a-range-picker v-model:value="rangeYear" size="small" picker="year" />
            </template>
            <template #end2>
              <a-select
                v-model:value="region" :options="regionList" mode="tags" size="small" placeholder="不限" :max-tag-count="1" :max-tag-text-length="60"
                style="width: 200px;"
              />
            </template>Cascader
          </SearchSelectList>
        </a-col>
        <a-col :span="6" style="text-align: right;position:relative;">
          <a-input v-model:value="searchValue" placeholder="请输入服务名称">
            <template #suffix>
              <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
            </template>
          </a-input>
          <a-button
            class="absolute bottom-[10px] right-0 color-[#00000073]"
            :icon="h(RedoOutlined)" :loading="spinning" @click="getList"
          />
        </a-col>
      </a-row>
    </a-card>

    <a-spin :spinning="spinning">
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
              class="cursor-pointer transition duration-300 h-full b-r-2 success
            hover:shadow-[0_4px_20px_-5px_rgba(0,0,0,0.35)]"
              :body-style="{ height: '100%', padding: '14px 20px' }"
            >
              <template #default>
                <div class="flex flex-col h-full">
                  <h1 font-bold h-48px mb-2>
                    {{ item.serviceName }}
                  </h1>
                  <div flex-1>
                    <a-flex wrap="wrap" gap="small">
                      <a-tag color="#769cf62e" :bordered="false">
                        <span class="color-[#769cf6]">{{ SYS_SERVICE_TYPE[item.serviceType] }}</span>
                      </a-tag>
                      <a-tag color="#769cf62e" :bordered="false">
                        <span class="color-[#769cf6]">{{ item.serviceYear }}</span>
                      </a-tag>
                      <a-tag color="#769cf62e" :bordered="false">
                        <span class="color-[#769cf6]">{{ item.region }}</span>
                      </a-tag>
                      <a-tag color="#769cf62e" :bordered="false">
                        <span class="color-[#769cf6]">{{ item.serviceType }}</span>
                      </a-tag>
                    </a-flex>
                  </div>

                  <div flex items-center justify-between>
                    <a-tag color="success" :bordered="false">
                      <template #icon>
                        <CheckCircleFilled />
                      </template>
                      在线
                    </a-tag>
                    <!-- <a-tag color="error" :bordered="false">
                      <template #icon>
                        <CloseCircleFilled />
                      </template>
                      注销
                    </a-tag> -->

                    <div flex items-center>
                      <a-button type="text" mr-3 size="small" @click="handleDel(item)">
                        删除
                      </a-button>
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
          v-model:current="current" style="float:right" :total="total" :show-total="total => `共${total}条`"
          show-less-items
        />
      </div>
    </a-spin>
  </page-container>
</template>

<script setup lang="ts">
import { h } from 'vue';
import to from 'await-to-js';
import { CheckCircleFilled, PlusOutlined, RedoOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { SelectListType } from '../components/types';
import SearchSelectList from '../components/SearchSelectList.vue';
import { delService, listService } from '@/api/projectarchive/service';
import type { ServiceQuery } from '@/api/projectarchive/service/types';

defineOptions({
  name: 'ServiceManage'
});

const message = useMessage();
const router = useRouter();
const dictStore = useDictStore();
const { sys_service_type } = toRefs<any>(dictStore.getDict('sys_service_type'));
const SYS_SERVICE_TYPE = computed(() => sys_service_type?.value.reduce((acc: any, cur: any) => {
  acc[cur.value] = cur.label;
  return acc;
}, {}));

// 分页
const spinning = ref<boolean>(false);
const current = ref<number>(1);
const rangeYear = ref<any>();
const region = ref<string>();
const searchValue = ref();
const selectValue = ref<string[][]>([]);

const SearchSelectOptions = computed(() => ([
  // {
  //   label: '数据类别',
  //   options: [
  //     { name: '全部', value: 'all' },
  //     { name: '三维数据', value: '3d' },
  //     { name: '二维数据', value: '2d' },
  //     { name: '物联设备', value: 'iot' },
  //     { name: '物联设备', value: 'vr' }
  //   ]
  // },
  {
    label: '服务类型',
    options: [
      { name: '全部', value: 'all' },
      ...sys_service_type?.value.map((e: DictDataOption) => ({ name: e.label, value: e.value }))
      // { name: '倾斜摄影', value: 'mesh' },
      // { name: '激光点云', value: 'lidar' },
      // { name: '基础地形', value: 'terrain' },
      // { name: 'BIM模型', value: 'bim' }
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
]));

function filterSelectValue(items: SelectListType[]): (string | number)[] {
  return items.map(e => e.value);
}

const data = ref<any[]>([]);
const total = ref<number>(0);

/**
 * 获取服务列表
 */
async function getList() {
  spinning.value = true;
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
    spinning.value = false;
    return;
  }
  console.log('getList', res);
  setTimeout(() => {
    spinning.value = false;
    data.value = res.rows;
    total.value = res.total;
  }, 200);
}

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
 * 新增服务
 */
function handleAdd() {
  router.push({
    path: '/data/service/add'
  });
}

/**
 * 服务详情
 * @param item
 */
function handleInfo(item: any) {
  router.push({
    path: `/data/service/${item.id}`
  });
  console.log(item);
}

/**
 * 删除服务
 * @param item
 */
async function handleDel(item: any) {
  await delService(item.id);
  getList();
  message.success('删除成功');
}

onBeforeMount(() => {
  getList();
});
</script>

<style land="less" scoped>
.text-light-color {
  color: var(--text-light-color);
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
