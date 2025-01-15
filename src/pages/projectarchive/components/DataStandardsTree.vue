<!-- 数据标准目录树 -->
<template>
  <div class="h-full">
    <a-spin :spinning="state.loading">
      <a-space mb-16px>
        <a-input
          v-model:value="searchValue"
          :placeholder="props.searchPlaceholder"
          w-full allow-clear
          @change="onSearch"
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
        v-model:expanded-keys="state.expandedKeys"
        :show-line="true"
        :show-icon="false"
        :tree-data="state.dataSource"
        :height="height"
        :load-data="state.loadData"
        :loaded-keys="state.loadedKeys"
        @select="onSelect"
      >
        <template #icon="{ children, key }">
          <ReadOutlined v-if="!children" :style="{ color: selectNode.node?.id === key ? 'var(--pro-ant-color-primary)' : '' }" />
        </template>
        <template #title="{ title, key }">
          <a-dropdown :trigger="['contextmenu']">
            <span v-if="title.indexOf(searchValue) > -1" :style="{ color: selectNode.node?.id === key ? 'var(--pro-ant-color-primary)' : '' }">
              {{ title.substring(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substring(title.indexOf(searchValue) + searchValue?.length) }}
            </span>
            <span v-else :style="{ color: selectNode.node?.id === key ? 'var(--pro-ant-color-primary)' : '' }">{{ title }}</span>
            <template v-if="rightMenu" #overlay>
              <a-menu @click="({ key: menuKey }) => onContextMenuClick(key, menuKey)">
                <a-popconfirm
                  title="确定删除该条数据？" ok-text="确定" cancel-text="取消"
                  @confirm="handleDelete(key)"
                >
                  <a-menu-item key="del">
                    删除
                  </a-menu-item>
                </a-popconfirm>
                <a-popconfirm
                  title="重命名" ok-text="确定" cancel-text="取消"
                  @confirm="handleUpdate(key)"
                >
                  <template #description>
                    <a-input
                      v-model:value="rename"
                      class="mr-20px w-200px"
                      placeholder="请输入新名称"
                      allow-clear
                    />
                  </template>
                  <a-menu-item key="rename">
                    重命名
                  </a-menu-item>
                </a-popconfirm>
                <a-menu-item key="add">
                  新增子目录
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
        <template #switcherIcon="{ defaultIcon }">
          <component :is="defaultIcon" />
        </template>
        <template #leafIcon="{ leafIcon }">
          <component :is="leafIcon" />
        </template>
      </a-tree>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { PlusOutlined, ReadOutlined, SearchOutlined } from '@ant-design/icons-vue';
import type { TreeProps } from 'ant-design-vue';
import { debounce } from 'lodash-es';
import { useTreeQuery } from '@/composables/tree-query';
import { delDataStandardsCatalogApi, listDataStandardsCatalogApi, updateDataStandardsCatalogApi } from '@/api/projectarchive/dataStandardsCatalog';

defineOptions({
  name: 'DataStandardsTree'
});

const props = withDefaults(defineProps<{
  modelValue: any
  searchPlaceholder?: string
  height?: number
  add?: boolean
  rightMenu?: boolean
}>(), {
  modelValue: {},
  searchPlaceholder: '搜索',
  add: true,
  rightMenu: true,
  height: 0
});
const emits = defineEmits(['update:modelValue', 'add', 'select']);
const selectNode = useVModel(props, 'modelValue', emits);
const searchValue = ref<string>();

// 启用搜索时右键拓展不可同
const rightMenu = computed<boolean>(() => props.rightMenu && !searchValue.value);
const rename = ref<string>('');
const height = computed(() => {
  const _h = props.height - 48 - 34;
  return _h > 0 ? _h : null;
});
const { state, initQuery } = useTreeQuery({
  queryApi: listDataStandardsCatalogApi,
  queryParams: {
    pid: 0
  },
  beforeQueryNode: (data) => {
    return {
      pid: data.id
    };
  },
  beforeQuery: () => {
    state.queryParams = {
      [searchValue.value ? 'name' : 'pid']: searchValue.value || 0
    };
  },
  afterQuery: (rows) => {
    return rows.map((item: any) => ({
      key: item.id,
      title: item.name,
      ...item
    }));
  }
});

const onSearch = debounce(() => {
  searchValue.value = searchValue.value?.trim();
  initQuery();
}, 500);

// 右键
function onContextMenuClick(key: string, menuKey: string | number) {
  switch (menuKey) {
    case 'del':
      handleDelete(key);
      break;
    case 'rename':
      handleUpdate(key);
      break;
    case 'add':
      emits('add', key);
      break;
  }
}

// 删除
function handleDelete(key: string | number) {
  delDataStandardsCatalogApi(key).then(() => {
    initQuery();
  });
}

// 重命名
function handleUpdate(key: string | number) {
  updateDataStandardsCatalogApi({
    id: key,
    name: rename.value
  }).then(() => {
    initQuery();
  });
}

// 树节点选中事件
const onSelect: TreeProps['onSelect'] = (key, info) => {
  emits('select', { key, info });
  // const item = {
  //   id: info.node.id,
  //   name: info.node.name,
  //   dataStandardsPath: info.node.dataStandardsPath,
  //   pid: info.node.pid,
  //   orderindex: info.node.orderindex
  // };

  selectNode.value = info;
};

onBeforeMount(() => {
  initQuery();
});
</script>
