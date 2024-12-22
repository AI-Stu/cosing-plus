<template>
  <slot v-if="hasAccess(access)" />
</template>

<script setup lang="ts">
import type { AccessEnum } from '@/utils/constant';

defineProps<{
  access: string | number | (string | number)[] | AccessEnum
}>();
const { hasAccess } = useAccess();
</script>
