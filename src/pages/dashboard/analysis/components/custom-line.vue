<template>
  <div ref="container" />
</template>

<script setup lang="ts">
import { Line } from '@antv/g2plot';

const props = defineProps({
  offlineChartData: {
    type: Array
  }
});

const container = ref();

onMounted(() => {
  new Line(container.value, {
    data: props.offlineChartData as any,
    padding: 'auto',
    xField: 'date',
    yField: 'value',
    xAxis: {
      tickCount: 5
    },
    seriesField: 'type',
    legend: {
      position: 'top'
    },
    slider: {
      start: 0.1,
      end: 0.5
    }
  }).render();
});
</script>

<style scoped lang="less">

</style>
