<template>
  <div>
    <template v-for="(item, index) in options">
      <template v-if="values.includes(item.value)">
        <span
          v-if="(item.tagType === 'default' || !item.tagType) && !item.tagClass"
          :key="item.value"
          :index="index"
          :class="item.tagClass"
        >
          {{ `${item.label} ` }}
        </span>
        <a-tag
          v-else
          :key="`${item.value}`"
          :index="index"
          :color="item.tagType"
        >
          {{ `${item.label} ` }}
        </a-tag>
      </template>
    </template>
    <template v-if="unmatch && showValue">
      {{ unmatchArray }}
    </template>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'DictTag'
});
const props = withDefaults(defineProps<Props>(), {
  showValue: true,
  separator: ','
});
interface Props {
  options: Array<DictDataOption>
  value: number | string | Array<number | string>
  showValue?: boolean
  separator?: string
}
const values = computed(() => {
  if (!props.value)
    return [];
  return Array.isArray(props.value)
    ? props.value.map(item => `${item}`)
    : String(props.value).split(props.separator);
});

const unmatch = computed(() => {
  if (props.options?.length === 0 || (props.value ?? '') === '')
    return false;
  // 传入值为非数组
  let unmatch = false; // 添加一个标志来判断是否有未匹配项
  values.value.forEach((item) => {
    if (!props.options.some(v => v.value === item)) {
      unmatch = true; // 如果有未匹配项，将标志设置为true
    }
  });
  return unmatch; // 返回标志的值
});

const unmatchArray = computed(() => {
  // 记录未匹配的项
  const itemUnmatchArray: Array<string | number> = [];
  if ((props.value ?? '') !== '') {
    values.value.forEach((item) => {
      if (!props.options.some(v => v.value === item)) {
        itemUnmatchArray.push(item);
      }
    });
  }
  // 没有value不显示
  return handleArray(itemUnmatchArray);
});

function handleArray(array: Array<string | number>) {
  if (array.length === 0)
    return '';
  return array.reduce((pre, cur) => {
    return `${pre} ${cur}`;
  });
}
</script>

<style scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
</style>
