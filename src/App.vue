<script lang="ts" setup>
import { appWindow } from '@tauri-apps/api/window'

appWindow.setDecorations(true)
</script>

<template>
  <n-message-provider>
    <Content />
  </n-message-provider>
</template>