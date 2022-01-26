<script lang="ts" setup>
import { appWindow } from '@tauri-apps/api/window'

appWindow.setDecorations(true)

const alwaysTop = ref(false)
const opacity = ref(50)
const fontSize = ref(26)
const text = ref<any>(null)
const settings = ref(false)
const theme = ref('dark')
const themeColor = ref(0)

const themeOverrides = {
  common: {
    primaryColor: '#8a8a8a'
  }
}

const changeTheme = () => {
  themeColor.value = theme.value === 'dark' ? 255 : 0
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

const changeAlwaysTop = () => {
  alwaysTop.value = !alwaysTop.value
  appWindow.setAlwaysOnTop(alwaysTop.value)
}

onMounted(() => {
  text.value.style.backgroundColor = `rgba(0, 0, 0, ${opacity.value / 100})`
  text.value.style.fontSize = `${fontSize.value}px`
})

watch([opacity, theme], () => {
  text.value.style.backgroundColor = `rgba(${themeColor.value}, ${themeColor.value}, ${themeColor.value}, ${opacity.value / 100})`
})

watch(fontSize, () => {
  text.value.style.fontSize = `${fontSize.value}px`
})
</script>

<template>
  <div :class="{
    'dark': theme === 'dark',
  }">
    <div v-show="settings" class="absolute w-8/10 h-20px bottom-175px transform translate-x-5vh">
      <n-h2 class="text-dark-900 dark:text-light-50">Opacity</n-h2>
      <n-slider :theme-overrides="themeOverrides" v-model:value="opacity" :step="1"></n-slider>
    </div>
    <div v-show="settings" class="absolute w-8/10 h-20px bottom-80px transform translate-x-5vh">
      <n-h2 class="text-dark-900 dark:text-light-50">Font Size</n-h2>
      <n-slider :theme-overrides="themeOverrides" v-model:value="fontSize" :step="1"></n-slider>
    </div>
    <n-tooltip placement="top-start" trigger="hover">
      <template #trigger>
        <i-ri:settings-3-line class="absolute right-10px bottom-15px text-size-35px text-dark-900 dark:text-light-50" @click="settings = !settings" />
      </template>
      Settings
    </n-tooltip>
    <n-tooltip placement="top-start" trigger="hover">
      <template #trigger>
        <i-mdi:theme-light-dark class="absolute right-10px bottom-75px text-size-35px text-dark-900 dark:text-light-50" @click="changeTheme()" />
      </template>
      Theme
    </n-tooltip>
    <n-tooltip placement="top-start" trigger="hover">
      <template #trigger>
        <i-mdi:arrow-top-left-thin-circle-outline class="absolute right-10px bottom-135px text-size-35px text-dark-900 dark:text-light-50" @click="changeAlwaysTop()" />
      </template>
      Always-on-top
    </n-tooltip>
    <div contenteditable="true" id="textarea" class="text-dark-900 dark:text-light-50 w-100vw h-100vh p-5" ref="text" spellcheck="false" @click="settings = false"></div>
  </div>
</template>

<style>
html {
  overflow: auto;
  overflow-x: hidden;
}

#textarea {
    -moz-appearance: textfield-multiline;
    -webkit-appearance: textarea;
    overflow: auto;
    resize: both;
}

::-webkit-scrollbar {
  width: 0;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
</style>