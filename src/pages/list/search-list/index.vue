<template>
  <SearchListContainer>
    <slot />
  </SearchListContainer>
</template>

<script setup lang="ts">
import SearchListContainer from './components/search-list-container.vue';

defineOptions({
  name: 'SearchList'
});
</script>

<style scoped lang="less">

</style>
