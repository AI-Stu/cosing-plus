<!-- 列表筛选组件 -->
<template>
  <a-form :label-col="{ style: { width: '100px', textAlign: 'left' } }">
    <a-form-item v-for="(item, index) in options" :key="index" :label="item.label" class="mb-2">
      <div class="flex flex-wrap gap-6">
        <slot :name="`start${index}`" :item="item" :index="index" />
        <span
          v-for="(sItem, sIndex) in item.options" :key="sIndex"
          :style="{
            color: isSelect(sItem, index) ? `${token?.colorPrimary}` : '',
            cursor: 'pointer',
          }"
          @click="handleClick(index, sItem, item)"
        >
          {{ sItem.name }}
        </span>
        <slot :name="`end${index}`" :item="item" :index="index" />
      </div>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import type { SeacrhSelectListOptions, SelectListType } from './types';

defineOptions({
  name: 'SearchSelectList'
});
const props = defineProps<{
  options: SeacrhSelectListOptions[]
  modelValue: SelectListType[][] | string[][]
  filter?: (item: SelectListType[]) => any
}>();
const emits = defineEmits(['update:modelValue', 'resetQuery', 'sizeChange']);
const { token } = useAntdToken();

const _values = reactive<SelectListType[][]>(Array.from({ length: props.options.length }, () => [])); // 用于存储选中的值
const values = computed({
  get: () => props.modelValue,
  set: val => emits('update:modelValue', val)
});

values.value = JSON.parse(JSON.stringify(_values));

function isSelect(item: SelectListType, index: number) {
  return (_values[index] || []).filter(e => e.value === item.value).length > 0;
}

function handleClick(index: number, item: SelectListType, items: SeacrhSelectListOptions) {
  let curValues = JSON.parse(JSON.stringify((toRaw(_values[index])))) as SelectListType[];
  if (!curValues) {
    curValues = [] as SelectListType[];
  }

  const keys = curValues.map(e => e.value) as string[];

  if (!toRaw(items.isMultiple)) {
    // 默认单选
    curValues = [toRaw(item)];
  }
  else {
    // 多选
    if (item.value === 'all') {
      // 全选
      curValues = [toRaw(item)];
    }
    const hasAll = keys.includes('all');
    if (keys.includes(item.value)) {
      // 删除当前选中
      curValues = curValues.filter(e =>
        hasAll ? e.value !== item.value : e.value !== item.value && e.value !== 'all'
      );
    }
    else {
      // 添加当前选中
      const notAll = hasAll ? curValues.filter(e => e.value !== 'all') : curValues;
      curValues = [...notAll, toRaw(item)];
    }
  }

  _values[index] = curValues;
  console.log(curValues);

  values.value[index] = define(curValues);
}

function define(items: SelectListType[]) {
  return props.filter ? [props.filter(items)] : items;
}
</script>
