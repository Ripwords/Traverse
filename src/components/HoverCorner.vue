<script lang="ts" setup>
const props = defineProps<{ color: string }>()
const color = props.color
</script>

<template>
  <div id="triangle-bottomright"></div>
</template>

<style scoped>
#triangle-bottomright {
  width: 0;
  height: 0;
  opacity: 0.4;
  border-bottom: 35px solid v-bind(color);
  border-left: 35px solid transparent;
}
</style>