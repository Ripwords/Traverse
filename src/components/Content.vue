<script lang="ts" setup>
import { saveAs } from 'file-saver'
import { mainStore } from '../store'
import { useMessage } from 'naive-ui'
import { pdfExporter } from 'quill-to-pdf'
import * as wordExporter from 'quill-to-word'
import { QuillEditor } from '@vueup/vue-quill'
import { appWindow } from '@tauri-apps/api/window'
import { isRegistered, register, unregister } from '@tauri-apps/api/globalShortcut'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const store = mainStore()
const text = ref<any>(null)
const settings = ref(false)
const themeColor = ref(0)
const shortcutModal = ref(false)
const exportModal_1 = ref(false)
const exportModal_2 = ref(false)
const exitModal = ref(false)
const showOptions = ref(false)
const message = useMessage()

const checkContent = () => {
  if (store.content.ops.ops) {
    if (store.content.ops.ops[0].insert !== ('\n' || '')) {
      return true
    }
  }
  return false
}

const shortcutRegister = async () => {
  if (!(await isRegistered('ctrl+shift+s'))) {
    await register('ctrl+shift+s', () => {
      shortcutModal.value = true
    })
  }
}

const shortcutUnregister = async () => {
  await unregister('ctrl+shift+s')
  shortcutModal.value = false
}

const changeTheme = () => {
  themeColor.value = store.theme === 'dark' ? 255 : 0
  store.theme = store.theme === 'dark' ? 'light' : 'dark'
}

const changeAlwaysTop = () => {
  store.alwaysTop = !store.alwaysTop
  appWindow.setAlwaysOnTop(store.alwaysTop)
}

const changeSpellcheck = () => {
  store.spellcheck = !store.spellcheck
  if (store.spellcheck) {
    message.success("Spellcheck is enabled")
  } else {
    message.warning("Spellcheck is disabled")
  }
}

const export2PDF = async () => {
  try {
    if (checkContent()) {
      const pdfBlob = await pdfExporter.generatePdf(store.content.ops)
      saveAs(pdfBlob, `${store.exportName}.pdf`)
    } else {
      message.error('PDF export failed, file is empty')
    }
  } catch (e) {
    message.error('PDF export failed, unknown error')
  }
}

const export2Word = async () => {
  try {
    if (checkContent()) {
      const wordBlob: any = await wordExporter.generateWord(store.content.ops, {exportAs: 'blob'})
      saveAs(wordBlob, `${store.exportName}.docx`)
    } else {
      message.error('Word export failed, file is empty')
    }
  } catch (e) {
    message.error('Word export failed, unknown error')
  }
}

onMounted(() => {
  text.value.style.backgroundColor = store.theme === 'dark' ? `rgba(0, 0, 0, ${store.opacity / 100})` : `rgba(255, 255, 255, ${store.opacity / 100})`
  appWindow.setAlwaysOnTop(store.alwaysTop)
})

watch([() => store.opacity, () => store.theme], () => {
  text.value.style.backgroundColor = `rgba(${themeColor.value}, ${themeColor.value}, ${themeColor.value}, ${store.opacity / 100})`
})

watch(() => store.content.ops.ops, () => {
  let arr: any = []
  let count = 0
  store.content.ops.ops.forEach((arrItem: any) => {
    if(typeof(arrItem.insert) === 'string') {
      if(!arrItem.insert.endsWith('\n')) {
        arr.push(arrItem.insert.split(' '))
      } else {
        arr.push(arrItem.insert.split('\n'))
      }
    }
  })
  const specialCharacters = ['`', '~', '<', '>', '+', '-', '=', '|', '\\', '/', '*', '@', '#', '$', '%', '^', '&', '!', '?', ';', ':', '.', ',', ' ']
  arr.forEach((arrItem: any) => {
    arrItem.forEach((item: any) => {
      const words = item.split(" ")
      words.forEach((word: any) => {
        if(word.split("\n").length > 1) {
          const subWords = word.split("\n")
          subWords.forEach((subWord: any) => {
            if(subWord.length > 0 && !specialCharacters.includes(subWord)) {
              count++
            }
          })
        } else if(word.length > 0 && !specialCharacters.includes(word)) {
          count++
        }
      })
    })
  })
  store.wordCount = count
})

appWindow.listen("tauri://blur", () => {
  shortcutUnregister()
})

appWindow.listen("tauri://focus", () => {
  shortcutRegister()
})

appWindow.listen("tauri://close-requested", async () => {
  if (checkContent()) {
    exitModal.value = true
  } else {
    await appWindow.close()
  }
})

await shortcutRegister()
</script>

<template>
  <div :class="{ 'dark': store.theme === 'dark' }">
    <div v-show="settings" class="absolute z-10 w-8/10 h-20px bottom-200px transform translate-x-5vh">
      <n-h2 class="text-dark-900 dark:text-light-50">Opacity</n-h2>
      <n-slider :theme-overrides="store.themeOverrides" v-model:value="store.opacity" :step="1"></n-slider>
      <n-h2 class="text-dark-900 dark:text-light-50">Toolbar</n-h2>
      <n-switch 
        size="large"
        v-model:value="store.toolbar"
      >
        <template #checked>
          Toolbar
        </template>
        <template #unchecked>
          Toolbar
        </template>
      </n-switch>
    </div>
    <TransitionGroup name="list" tag="div">
      <div v-show="store.toolbar" :key="'toolbar'">
        <Toolbar 
          @settingsClicked="settings = false"
          @exportPDF="exportModal_1 = true"
          @exportWord="exportModal_2 = true"
          @changeSpellcheck="changeSpellcheck()"
        />
      </div>
      <div ref="text" 
        :key="'editor'" 
        class="relative h-100vh text-dark-900 dark:text-light-50 transition-colors duration-150 ease-linear" 
        @click="settings = false"
      >
        <div class="absolute right-1 mt-1 z-20 text-size-[12px] opacity-70 text-dark-900 dark:text-light-500 transition-colors duration-150 ease-linear">
          {{ store.wordCount }}
        </div>
        <QuillEditor 
          name="content"
          id="content"
          toolbar="#toolbar" 
          :spellcheck="store.spellcheck"
          v-model:content="store.content.ops" 
        />
      </div>
    </TransitionGroup>
    <div
      class="fixed bottom-0 right-0 z-10 w-[64px] h-[185px]"
      @mouseleave="showOptions = false"
    >
      <Transition name="option">
        <Options
          v-if="showOptions"
          @change-settings="settings = !settings" 
          @change-theme="changeTheme()"
          @change-alwaystop="changeAlwaysTop()"  
        />
      </Transition>
    </div>
    <HoverCorner v-if="!showOptions" color="#10b981" class="fixed z-15 right-0 bottom-0" @mouseenter="showOptions = true" />
    <exportModal 
      type="pdf" 
      :func="export2PDF" 
      :show="exportModal_1"
      @close="exportModal_1 = false"  
    />
    <exportModal 
      type="word" 
      :func="export2Word" 
      :show="exportModal_2"
      @close="exportModal_2 = false"  
    />
    <n-modal
      class="mx-30vw"
      v-model:show="shortcutModal"
      :mask-closable="false"
      preset="card"
      title="Save as"
    >
      <n-input type="text" v-model:value="store.exportName"></n-input>
      <div class="text-size-[30px] flex justify-end p-2">
        <button :theme-overridess="store.themeOverrides"><i-mdi:file-pdf class="m-[0.7rem]" @click="export2PDF()"></i-mdi:file-pdf></button>
        <button :theme-overridess="store.themeOverrides"><i-mdi:file-word class="m-[0.7rem]" @click="export2Word()"></i-mdi:file-word></button>
      </div>
    </n-modal>
    <n-modal
      class="mx-30vw"
      v-model:show="exitModal"
      :mask-closable="false"
      preset="dialog"
      title="Unsaved changes"
      content="Are you sure?"
      positive-text="Yes"
      negative-text="Cancel"
      @positive-click="appWindow.close()"
      @negative-click="exitModal = false"
    >
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

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}

.option-enter-active,
.option-leave-active {
  transition: all .3s ease;
}

.option-enter-from,
.option-leave-to {
  opacity: 0;
}
</style>