<script lang="ts" setup>
import { appWindow } from '@tauri-apps/api/window'

appWindow.setDecorations(true)

const opacity = ref(50)
const fontSize = ref(26)
const text = ref<any>(null)
const settings = ref(false)
const theme = ref('dark')
const themeColor = ref(0)

const changeTheme = () => {
  themeColor.value = theme.value === 'dark' ? 255 : 0
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
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
      <n-slider v-model:value="opacity" :step="1"></n-slider>
    </div>
    <div v-show="settings" class="absolute w-8/10 h-20px bottom-80px transform translate-x-5vh">
      <n-h2 class="text-dark-900 dark:text-light-50">Font Size</n-h2>
      <n-slider v-model:value="fontSize" :step="1"></n-slider>
    </div>
    <i-ri:settings-3-line class="absolute right-10px bottom-15px text-size-35px text-dark-900 dark:text-light-50" @click="settings = !settings"></i-ri:settings-3-line>
    <i-mdi:theme-light-dark class="absolute right-10px bottom-75px text-size-35px text-dark-900 dark:text-light-50" @click="changeTheme()"></i-mdi:theme-light-dark>
    <textarea class="text-dark-900 dark:text-light-50 w-100vw h-100vh p-5" ref="text" spellcheck="false" @click="settings = false"></textarea>
  </div>
</template>

<style>
html {
  overflow: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 0;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
</style>