<script lang="ts" setup>
import { mainStore } from '../store'

const store = mainStore()
const emit = defineEmits([
  "change-alwaystop",
  "change-theme",
  "change-settings"
])
</script>

<template>
  <div>
    <n-tooltip placement="left" trigger="hover">
      <template #trigger>
        <i-mdi:arrow-top-left-thin-circle-outline 
          class="fixed z-10 right-10px bottom-135px text-size-35px transition-colors duration-150 ease-linear" 
          :class="{ 
            'text-green-500': store.alwaysTop, 
            'text-dark-900': !store.alwaysTop, 
            'dark:text-light-50': !store.alwaysTop, 
            'dark:text-green-500': store.alwaysTop 
          }" 
          @click="emit('change-alwaystop')"
        />
      </template>
      Always-on-top
    </n-tooltip>
    <n-tooltip placement="left" trigger="hover">
      <template #trigger>
        <i-mdi:theme-light-dark class="fixed z-10 right-10px bottom-75px text-size-35px text-dark-900 dark:text-light-50 transition-colors duration-150 ease-linear" @click="emit('change-theme')" />
      </template>
      Theme
    </n-tooltip>
    <n-tooltip placement="left" trigger="hover">
      <template #trigger>
        <i-ri:settings-3-line class="fixed z-10 right-10px bottom-15px text-size-35px text-dark-900 dark:text-light-50 transition-colors duration-150 ease-linear" @click="emit('change-settings')" />
      </template>
      Settings
    </n-tooltip>
  </div>
</template>