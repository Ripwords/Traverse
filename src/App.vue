<script lang="ts" setup>
import { invoke } from '@tauri-apps/api/tauri'
import { appWindow } from '@tauri-apps/api/window'


onMounted(() => {
  invoke('close_splashscreen')
  appWindow.setDecorations(true)
  appWindow.setSkipTaskbar(false)
})

</script>

<template>
  <n-message-provider>
    <Suspense>
      <template #default>
        <Content />
      </template>
      <template #fallback>
        ...
      </template>
    </Suspense>
  </n-message-provider>
</template>