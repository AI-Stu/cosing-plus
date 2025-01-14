<template>
  <div class="h-full">
    <a-spin :spinning="loading">
      <a-space mb-16px>
        <a-input
          v-model:value="searchValue"
          :placeholder="props.searchPlaceholder" w-full
          @press-enter="onSearch"
        >
          <template #suffix>
            <SearchOutlined style="color: rgba(0, 0, 0, 0.45)" />
          </template>
        </a-input>
        <a-tooltip v-if="props.add" title="新增">
          <a-button :icon="h(PlusOutlined)" type="primary" @click="emits('add')" />
        </a-tooltip>
      </a-space>
      <a-tree
        :show-line="true"
        :show-icon="false"
        :auto-expand-parent="autoExpandParent"
        :expanded-keys="expandedKeys"
        :tree-data="treeData"
        :height="height"
        @expand="onExpand"
        @select="onSelect"
      >
        <template #icon="{ children }">
          <!-- <template v-if="children?.length">
            <UnorderedListOutlined />
          </template> -->

          <ReadOutlined v-if="!children" />
        </template>
        <template #title="{ dataRef }">
          <a-dropdown :trigger="['contextmenu']">
            <span v-if="dataRef.tilte.indexOf(searchValue) > -1">
              {{ dataRef.tilte.substring(0, dataRef.tilte.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ dataRef.tilte.substring(dataRef.tilte.indexOf(searchValue) + searchValue?.length) }}
            </span>
            <span v-else>{{ dataRef.tilte }}</span>
            <template v-if="props.rightMenu" #overlay>
              <a-menu @click="({ key: menuKey }) => onContextMenuClick(dataRef.key, menuKey)">
                <a-menu-item key="1">
                  删除
                </a-menu-item>
                <a-menu-item key="2">
                  重命名
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <template #switcherIcon="{ defaultIcon }">
          <!-- <UnorderedListOutlined v-if="" /> -->
          <component :is="defaultIcon" />
        </template>
        <template #leafIcon="{ leafIcon }">
          <component :is="leafIcon" v-if="false" />
        </template>
      </a-tree>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { PlusOutlined, ReadOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { TreeProps } from 'ant-design-vue';

defineOptions({
  name: 'SearchTree'
});
const props = withDefaults(defineProps<{
  loading: boolean
  modelValue?: string
  searchPlaceholder?: string
  height?: number
  add?: boolean
  rightMenu?: boolean
  queryApi?: (params?: any) => Promise<any>
  filter?: (item: any) => any
}>(), {
  searchPlaceholder: '搜索',
  loading: false,
  add: true,
  rightMenu: false,
  height: 0
});
const emits = defineEmits(['update:modelValue', 'update:loading', 'add', 'select']);

const loading = useVModel(props, 'loading', emits);
const expandedKeys = ref<(string | number)[]>([]);
const autoExpandParent = ref<boolean>(true);
const searchValue = ref<string>();
const height = computed(() => {
  const _h = props.height - 48 - 34;
  return _h > 0 ? _h : null;
});

const genData: TreeProps['treeData'] = [];
const gData = ref<TreeProps['treeData']>(genData);

const treeData = ref([
  {
    tilte: 'parent 1',
    key: '0-0',
    children: [
      {
        tilte: 'parent 1-0',
        key: '0-0-0',
        children: [
          { tilte: 'leaf', key: '0-0-0-0' },
          { tilte: 'leaf', key: '0-0-0-1' },
          { tilte: 'leaf', key: '0-0-0-2' }
        ]
      },
      {
        tilte: 'parent 1-1',
        key: '0-0-1',
        children: [{ tilte: 'leaf', key: '0-0-1-0' }]
      },
      {
        tilte: 'parent 1-2',
        key: '0-0-2',
        children: [
          { tilte: 'leaf 1', key: '0-0-2-0' },
          {
            tilte: 'leaf 2',
            key: '0-0-2-1'
          }
        ]
      },
      {
        tilte: 'parent 1-3',
        key: '0-0-3',
        children: [
          { tilte: 'leaf 1', key: '0-0-3-0' },
          {
            tilte: 'leaf 3',
            key: '0-0-3-1'
          }
        ]
      },
      {
        tilte: 'parent 1-4',
        key: '0-0-4',
        children: [
          { tilte: 'leaf 1', key: '0-0-4-0' },
          {
            tilte: 'leaf 4',
            key: '0-0-4-1'
          }
        ]
      },
      {
        tilte: 'parent 1-5',
        key: '0-0-5',
        children: [
          { tilte: 'leaf 1', key: '0-0-5-0' },
          {
            tilte: 'leaf 5',
            key: '0-0-5-1'
          }
        ]
      }
    ]
  },
  {
    tilte: 'parent 2',
    key: '0-1',
    children: [
      {
        tilte: 'parent 2-0',
        key: '0-1-0',
        children: [
          { tilte: 'leaf', key: '0-1-0-0' },
          { tilte: 'leaf', key: '0-1-0-1' }
        ]
      }
    ]
  }
]);
const treeData2 = buildList(treeData);

async function getList(key?: string | null) {
  props.queryApi && props.queryApi(key).then((res) => {
    treeData.value = res.data;
  });
}

function getParentKey(key: string | number, tree: any): string | number | undefined {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: { key: string | number }) => item.key === key)) {
        parentKey = node.key;
      }
      else if (getParentKey(key, node.children || [])) {
        parentKey = getParentKey(key, node.children || []);
      }
    }
  }
  return parentKey;
}

function onExpand(keys: string[]) {
  expandedKeys.value = keys;
  autoExpandParent.value = false;
}

function onSearch() {
  console.log(searchValue.value);

  searchValue.value = searchValue.value?.trim();
  const expanded = treeData.value
    .map((item) => {
      if (searchValue.value && item.tilte.includes(searchValue.value)) {
        return getParentKey(item.key, gData.value);
      }
      return null;
    })
    .filter((item, i, self) => item && self.indexOf(item) === i);
  expandedKeys.value = expanded;
  autoExpandParent.value = true;
}

function onContextMenuClick(treeKey: string, menuKey: string | number) {
  console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
}

// 树节点选中事件
const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
  emits('select', { selectedKeys, info });
  console.log('selected', selectedKeys, info);
};

onBeforeMount(() => {
  getList();
});
</script>
