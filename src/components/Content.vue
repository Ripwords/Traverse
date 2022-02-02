<script lang="ts" setup>
import { QuillEditor } from '@vueup/vue-quill'
import { appWindow } from '@tauri-apps/api/window'
import { isRegistered, register, unregister } from '@tauri-apps/api/globalShortcut'
import { mainStore } from '../store'
import { pdfExporter } from 'quill-to-pdf'
import * as wordExporter from 'quill-to-word'
import { saveAs } from 'file-saver'
import { useMessage } from 'naive-ui'
import '@vueup/vue-quill/dist/vue-quill.snow.css'


const store = mainStore()
const alwaysTop = ref(false)
const opacity = ref(50)
const text = ref<any>(null)
const settings = ref(false)
const theme = ref('dark')
const themeColor = ref(0)
const toolbar = ref<any>(null)
const showModal = ref(false)
const message = useMessage()

const shortcutRegister = async () => {
  if (!(await isRegistered('ctrl+shift+s'))) {
    await register('ctrl+shift+s', () => {
      showModal.value = true
    })
  }
}

const shortcutUnregister = async () => {
  await unregister('ctrl+shift+s')
  showModal.value = false
}

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

const export2PDF = async () => {
  try {
    const pdfBlob = await pdfExporter.generatePdf(store.content.ops)
    saveAs(pdfBlob, 'export.pdf')
  } catch (e) {
    message.error('PDF export failed, file is empty')
  }
}

const export2Word = async () => {
  try {
    const wordBlob: any = await wordExporter.generateWord(store.content.ops, {exportAs: 'blob'})
    saveAs(wordBlob, 'export.docx')
  } catch (e) {
    message.error('Word export failed, file is empty')
  }
} 

onMounted(() => {
  toolbar.value.style.backgroundColor = `rgba(255, 255, 255, 0.95)`
  text.value.style.backgroundColor = `rgba(0, 0, 0, ${opacity.value / 100})`
})

watch([opacity, theme], () => {
  text.value.style.backgroundColor = `rgba(${themeColor.value}, ${themeColor.value}, ${themeColor.value}, ${opacity.value / 100})`
})

appWindow.listen("tauri://blur", () => {
  shortcutUnregister()
})

appWindow.listen("tauri://focus", () => {
  shortcutRegister()
})

shortcutRegister()
</script>

<template>
  <div id="toolbar" ref="toolbar" @click="settings = false">
    <select class="ql-font"></select>
    <select class="ql-size">
      <option value="small"></option>
      <option selected></option>
      <option value="large"></option>
      <option value="huge"></option>
    </select>
    <button class="ql-bold"></button>
    <button class="ql-italic"></button>
    <button class="ql-underline"></button>
    <button class="ql-strike"></button>
    <button class="ql-blockquote"></button>
    <select class="ql-color"></select>
    <select class="ql-background"></select>
    <button class="ql-code-block"></button>
    <select class="ql-header">
      <option value="1"></option>
      <option value="2"></option>
      <option value="3"></option>
      <option value="4"></option>
      <option value="5"></option>
    </select>
    <button class="ql-list" value="ordered"></button>
    <button class="ql-list" value="bullet"></button>
    <button class="ql-script" value="sub"></button>
    <button class="ql-script" value="super"></button>
    <button class="ql-indent" value="-1"></button>
    <button class="ql-indent" value="+1"></button>
    <button class="ql-direction" value="rtl"></button>
    <select class="ql-align">
      <option selected></option>
      <option value="center"></option>
      <option value="right"></option>
      <option value="justify"></option>
    </select>
    <button class="ql-image"></button>
    <button class="ql-video"></button>
    <button class="ql-link"></button>
    <button class="ql-clean"></button>
    <button><i-mdi:file-pdf @click="export2PDF()"></i-mdi:file-pdf></button>
    <button><i-grommet-icons:document-word @click="export2Word()"></i-grommet-icons:document-word></button>
  </div>
  <div 
    :class="{
      'dark': theme === 'dark',
    }"
  >
    <div v-show="settings" class="absolute z-10 w-8/10 h-20px bottom-100px transform translate-x-5vh">
      <n-h2 class="text-dark-900 dark:text-light-50">Opacity</n-h2>
      <n-slider :theme-overrides="themeOverrides" v-model:value="opacity" :step="1"></n-slider>
    </div>
    <n-tooltip placement="top-start" trigger="hover">
      <template #trigger>
        <i-mdi:arrow-top-left-thin-circle-outline 
          class="fixed z-10 right-10px bottom-135px text-size-35px transition-colors duration-150 ease-linear" 
          :class="{ 
            'text-green-500': alwaysTop, 
            'text-dark-900': !alwaysTop, 
            'dark:text-light-50': !alwaysTop, 
            'dark:text-green-500': alwaysTop 
          }" 
          @click="changeAlwaysTop()"
        />
      </template>
      Always-on-top
    </n-tooltip>
    <n-tooltip placement="top-start" trigger="hover">
      <template #trigger>
        <i-mdi:theme-light-dark class="fixed z-10 right-10px bottom-75px text-size-35px text-dark-900 dark:text-light-50 transition-colors duration-150 ease-linear" @click="changeTheme()" />
      </template>
      Theme
    </n-tooltip>
    <n-tooltip placement="top-start" trigger="hover">
      <template #trigger>
        <i-ri:settings-3-line class="fixed z-10 right-10px bottom-15px text-size-35px text-dark-900 dark:text-light-50 transition-colors duration-150 ease-linear" @click="settings = !settings" />
      </template>
      Settings
    </n-tooltip>
    <div ref="text" class="relative h-100vh text-dark-900 dark:text-light-50 transition-colors duration-150 ease-linear" @click="settings = false">
      <QuillEditor toolbar="#toolbar" spellcheck="false" v-model:content="store.content.ops"></QuillEditor>
    </div>
    <n-modal
      class="mx-30vw"
      v-model:show="showModal"
      :mask-closable="false"
      preset="card"
      title="Save as"
    >
      <div class="text-size-[30px] flex justify-end p-2">
        <button :theme-overridess="themeOverrides"><i-mdi:file-pdf class="m-[0.7rem]" @click="export2PDF()"></i-mdi:file-pdf></button>
        <button :theme-overridess="themeOverrides"><i-mdi:file-word class="m-[0.7rem]" @click="export2Word()"></i-mdi:file-word></button>
      </div>
    </n-modal>
  </div>
</template>

<style>
html {
  overflow: auto;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 0;  /* Remove scrollbar space */
  background: transparent;  /* Optional: just make scrollbar invisible */
}
</style>