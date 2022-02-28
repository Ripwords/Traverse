<script lang="ts" setup>
const props = defineProps<{ color: string }>()
const color = props.color
</script>

<template>
  <div id="triangle-bottomright"></div>
</template>

<style scoped>
#triangle-bottomright {
  width: 35px;
  height: 35px;
  -webkit-clip-path: polygon(100% 0, 0% 100%, 100% 100%);
  clip-path: polygon(100% 0, 0% 100%, 100% 100%);
  background: v-bind(color);
  opacity: 0.4;
}
</style>