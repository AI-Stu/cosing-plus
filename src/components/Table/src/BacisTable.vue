<template>
  <a-table
    :loading="state.loading"
    :data-source="state.dataSource"
    :pagination="state.pagination"
    :row-selection="state.rowSelections"
    :row-key="props.rowKey"
    :row-class-name="props.rowClassName"
    :bordered="props.bordered"
    :columns="props.columns"
    :size="props.tableSize"
    :scroll="props.scroll"
    @resize-column="props.handleResizeColumn"
  >
    <template v-for="(item, index) in Object.keys(slots)" #[item]="data" :key="index">
      <slot :name="item" v-bind="data || {}" />
    </template>
    <!-- <template #bodyCell="{ record, index, column }">
      <template v-if="column?.columnType === 'tag'">
        <component :is="column?.component" v-if="column?.component" v-bind="column?.componentProps" :key="`${column.columnType + index}`" />
        <dict-tag v-else :options="sys_normal_disable" :value="record[column.dataIndex as keyof typeof record]" />
      </template>

      <template v-if="column?.dataIndex === 'action'">
        <TableAction :actions="props.actions(record)" />
      </template>
    </template> -->
  </a-table>
</template>

<script lang="ts" setup>
import type { ATableColumnType } from './types';
// import TableAction from './components/TableAction.vue';
import type { TableQueryOptions } from '@/composables/table-query';

defineOptions({
  name: 'BasicTable'
});

const props = withDefaults(defineProps<{
  state: TableQueryOptions
  columns: ATableColumnType[]
  tableSize?: 'small' | 'middle' | 'large'
  rowClassName?: string
  rowKey?: string
  height?: number
  scroll?: { x: number | true, y: number }
  bordered?: boolean
  handleResizeColumn?: (w: number, col: any) => void
}>(), {
  rowKey: 'id',
  tableSize: 'middle',
  handleResizeColumn: (w: number, col: any) => {
    col.width = w || 10;
  }
});

const emits = defineEmits(['rowDelete']);

// 插槽
const slots = defineSlots<{
  title?: (props: any) => any
  headerCell?: (props: any) => any
  bodyCell?: (props: any) => any
  footer?: (props: any) => any
  customFilterDropdown?: (props: any) => any
  customFilterIcon?: (props: any) => any
  emptyText?: (props: any) => any
  expandColumnTitle?: (props: any) => any
  summary?: (props: any) => any
  [key: string]: any
}>();

onMounted(() => {
});
</script>

<style lang='less' scoped>
</style>
