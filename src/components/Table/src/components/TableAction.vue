<!--
  Table 操作列组件
  TODO: 暂时不支持ICON图标
-->
<template>
  <div flex>
    <template v-for="(action, index) in getActions" :key="`${index}-${action.label}`">
      <template v-if="$slots.content">
        <slot name="content" />
      </template>
      <template v-else>
        <a-tooltip v-if="action.tooltip" v-bind="action.tooltip">
          <a-popconfirm v-bind="action.popConfirm">
            <!-- <Icon v-if="action.icon" :icon="action.icon" :class="{ 'mr-1': !!action.label }" /> -->
            <a-button v-if="action.label" type="link" size="small">
              <span :style="{ color: action.color || '' }"> {{ action.label }}</span>
            </a-button>
          </a-popconfirm>
        </a-tooltip>
        <a-popconfirm v-else-if="action.popConfirm" v-bind="action.popConfirm">
          <!-- <Icon v-if="action.icon" :icon="action.icon" :class="{ 'mr-1': !!action.label }" /> -->
          <a-button v-if="action.label" type="link" size="small">
            <span :style="{ color: action.color || '' }"> {{ action.label }}</span>
          </a-button>
        </a-popconfirm>

        <a-button v-else-if="action.label" type="link" size="small">
          <span :style="{ color: action.color || '' }"> {{ action.label }}</span>
        </a-button>
      </template>
    </template>
    <a-dropdown v-if="dropDownActions && getDropdownList.length > 0" :trigger="['hover']">
      <template v-if="$slots.more">
        <slot name="more" />
      </template>

      <a-button v-if="!$slots.more" type="link" size="small">
        更多 <DownOutlined />
      </a-button>
      <template v-if="!$slots.more" #overlay>
        <a-menu v-model:selected-keys="selectedKeys" :items="getDropdownList" @click="handleClick" />
      </template>
    </a-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { DownOutlined } from '@ant-design/icons-vue';
import { isBoolean, isFunction } from 'lodash-es';
import type { ActionItem } from '../types';

// 定义 props
const props = withDefaults(defineProps<{
  actions: ActionItem[]
  dropDownActions?: ActionItem[]
  divider?: boolean
}>(), {
  divider: true
});

// 获取权限检查函数
const { hasAccess } = useAccess();
const selectedKeys = ref([]);
// 计算显示的操作项
const getActions = computed(() => {
  return (toRaw(props.actions) || [])
    .filter((action) => {
      return (action.auth ? hasAccess(action.auth) : true) && isIfShow(action);
    })
    .map((action) => {
      const { popConfirm } = action;
      return {
        type: 'link',
        size: 'small',
        ...action,
        ...(popConfirm || {}),
        enable: !!popConfirm
      };
    });
});
// 计算下拉菜单的操作项
const getDropdownList = computed(() => {
  const list = (toRaw(props.dropDownActions) || []).filter((action: ActionItem) => {
    return (action.auth && hasAccess(action.auth)) && isIfShow(action);
  });
  return list.map((action: ActionItem, index: number) => {
    const { label } = action;
    return {
      key: `${index}-${label}`,
      label,
      title: label,
      divider: index < list.length - 1 ? props.divider : false
    };
  });
});

function handleClick(row) {
  console.log(row);
}

// 判断操作项是否显示的函数
function isIfShow(action: ActionItem): boolean {
  const ifShow = action.ifShow;
  let result = true;
  if (isBoolean(ifShow)) {
    result = ifShow;
  }
  if (isFunction(ifShow)) {
    result = ifShow(action);
  }
  return result;
}
</script>

<style lang="less">

</style>
