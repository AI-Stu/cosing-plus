<template>
  <div class="h-full">
    <a-spin :spinning="loading">
      <a-space mb-16px w-full style="border: 1px solid #f00;">
        <a-input
          v-model:value="searchValue" size="small" enter-button
          :placeholder="props.searchPlaceholder" w-calc-(100%-60px)
          @change="getList"
        >
          <template #suffix>
            <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
          </template>
        </a-input>
        <a-tooltip title="新增">
          <a-button size="small" :icon="h(PlusOutlined)" type="primary" @click="emits('add')" />
        </a-tooltip>
      </a-space>
      <a-tree
        :show-line="true"
        :show-icon="false"
        :default-expanded-keys="['0-0-0']"
        :tree-data="treeData"
        :height="height"
        @select="onSelect"
      >
        <template #icon>
          <CarryOutOutlined />
        </template>
        <template #title="{ dataRef }">
          <template v-if="dataRef.key === '0-0-0-1'">
            <div>multiple line title</div>
            <div>multiple line title</div>
          </template>
          <template v-else>
            {{ dataRef.title }}
          </template>
        </template>
        <template #switcherIcon="{ dataRef, defaultIcon }">
          <SmileTwoTone v-if="dataRef.key === '0-0-2'" />
          <component :is="defaultIcon" v-else />
        </template>
      </a-tree>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { CarryOutOutlined, PlusOutlined, SearchOutlined, SmileTwoTone } from '@ant-design/icons-vue';
import type { TreeProps } from 'ant-design-vue';
import to from 'await-to-js';

defineOptions({
  name: 'SearchTree'
});

const props = withDefaults(defineProps<{
  loading: boolean
  modelValue?: string
  searchPlaceholder?: string
  height?: number
  queryApi?: (T: any) => Promise<any>
  filter?: (item: []) => any
}>(), {
  searchPlaceholder: '搜索',
  loading: false,
  height: 0
});

const emits = defineEmits(['update:modelValue', 'update:loading', 'add', 'select']);
const searchValue = useVModel(props, 'modelValue', emits);
const height = computed(() => {
  const _h = props.height - 48 - 20;
  return _h > 0 ? _h : null;
});
const loading = useVModel(props, 'loading', emits);

const rormRef = ref<FormInstance>();
const treeData = ref<TreeProps['treeData']>([
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          { title: 'leaf', key: '0-0-0-0' },
          { key: '0-0-0-1' },
          { title: 'leaf', key: '0-0-0-2' }
        ]
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ title: 'leaf', key: '0-0-1-0' }]
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        children: [
          { title: 'leaf 1', key: '0-0-2-0' },
          {
            title: 'leaf 2',
            key: '0-0-2-1'
          }
        ]
      },
      {
        title: 'parent 1-3',
        key: '0-0-3',
        children: [
          { title: 'leaf 1', key: '0-0-3-0' },
          {
            title: 'leaf 3',
            key: '0-0-3-1'
          }
        ]
      },
      {
        title: 'parent 1-4',
        key: '0-0-4',
        children: [
          { title: 'leaf 1', key: '0-0-4-0' },
          {
            title: 'leaf 4',
            key: '0-0-4-1'
          }
        ]
      },
      {
        title: 'parent 1-5',
        key: '0-0-5',
        children: [
          { title: 'leaf 1', key: '0-0-5-0' },
          {
            title: 'leaf 5',
            key: '0-0-5-1'
          }
        ]
      }
    ]
  },
  {
    title: 'parent 2',
    key: '0-1',
    children: [
      {
        title: 'parent 2-0',
        key: '0-1-0',
        children: [
          { title: 'leaf', key: '0-1-0-0' },
          { title: 'leaf', key: '0-1-0-1' }
        ]
      }
    ]
  }
]);

async function getList() {
  return await to(props.queryApi({ params }));
}

// 树节点选中事件
const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
  emits('select', { selectedKeys, info });
  console.log('selected', selectedKeys, info);
};
</script>
