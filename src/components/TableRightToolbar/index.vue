<template>
  <a-space size="middle">
    <a-tooltip title="刷新">
      <ReloadOutlined @click="handleResetQuery" />
    </a-tooltip>
    <a-tooltip title="密度">
      <a-dropdown trigger="click">
        <ColumnHeightOutlined />
        <template #overlay>
          <a-menu v-model:selected-keys="tableSize" :items="sizeItems" @click="handleSizeChange" />
        </template>
      </a-dropdown>
    </a-tooltip>
    <a-tooltip title="列设置">
      <a-dropdown v-model:open="dropdownVisible" trigger="click">
        <SettingOutlined />
        <template #overlay>
          <a-card>
            <template #title>
              <a-checkbox v-model:checked="state.checkAll" :indeterminate="state.indeterminate" @change="handleCheckAllChange">
                列选择
              </a-checkbox>
            </template>
            <template #extra>
              <a-button type="link" @click="handleResetChange">
                重置
              </a-button>
            </template>
            <a-checkbox-group
              v-model:value="state.checkList"
              :options="options"
              style="display: flex; flex-direction: column;"
              @change="handleCheckChange"
            />
          </a-card>
        </template>
      </a-dropdown>
    </a-tooltip>
  </a-space>
</template>

<script lang="ts" setup>
import type { MenuProps } from 'ant-design-vue';
import { ColumnHeightOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons-vue';
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface';

defineOptions({
  name: 'TableRightToolbar'
});
const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  filterColumns: {
    type: Array,
    default: () => []
  }
});

const emits = defineEmits(['update:filterColumns', 'resetQuery', 'sizeChange']);
const columnsValueKey = 'dataIndex';
const columnsLabelKey = 'title';
const dropdownVisible = ref(false);
const tableSize = ref<('small' | 'middle' | 'large')[]>(['large']);
const sizeItems = ref<MenuProps['items']>([
  {
    key: 'large',
    label: '默认',
    title: '默认'
  },
  {
    key: 'middle',
    label: '中等',
    title: '中等'
  },
  {
    key: 'small',
    label: '紧凑',
    title: '紧凑'
  }
]);
//
const getCheckList = computed(() => props.columns.map((item: any) => item[columnsValueKey]));
const checkList = computed(() => props.columns.filter((item: any) => !item.hide));

const state = reactive({
  indeterminate: false,
  checkAll: true,
  checkList: checkList.value.map((item: any) => item[columnsValueKey])
});

// 全部字段
const options = computed(() => {
  return props.columns.map((item: any) => ({
    label: item[columnsLabelKey],
    value: item[columnsValueKey],
    disabled: item[columnsValueKey] === 'action'
  }));
});

// 备份columns
const filterColumns = ref(filterAction(getCheckList.value));

/**
 * 密度切换
 *
 */
const handleSizeChange: MenuProps['onClick'] = (e) => {
  tableSize.value[0] = e.key as 'large' | 'middle' | 'small';
  console.log(tableSize.value);

  emits('sizeChange', toRaw(tableSize.value[0]));
};

/**
 * 刷新
 */
function handleResetQuery() {
  emits('resetQuery');
}

/**
 * 过滤
 *
 */
function filterAction(value: string[]) {
  return props.columns.filter((item: any) => {
    if (value.includes(item[columnsValueKey])) {
      // 为true时，循环遍历的值会暴露出去
      return true;
    }
    return false;
  });
}

/**
 * 重置事件
 *
 */
function handleResetChange() {
  state.checkList = getCheckList.value;
  filterColumns.value = filterAction(getCheckList.value);
  emits('update:filterColumns', toRaw(filterColumns.value));
}

/**
 * 列选择
 * @param e
 */
function handleCheckAllChange(e: CheckboxChangeEvent) {
  state.indeterminate = false;
  state.checkList = e.target.checked ? getCheckList.value : [];
  filterColumns.value = e.target.checked
    ? filterAction(getCheckList.value)
    : filterColumns.value.filter((item: any) => item[columnsValueKey] === 'action');
  emits('update:filterColumns', toRaw(filterColumns.value));
}

/**
 * checkbox点击事件
 *
 */
function handleCheckChange(value: any) {
  filterColumns.value = filterAction(value);
  emits('update:filterColumns', toRaw(filterColumns.value));
}
</script>
