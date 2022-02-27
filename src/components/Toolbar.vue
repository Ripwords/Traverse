<script lang="ts" setup>
import { Quill } from '@vueup/vue-quill'

const sizes: any = {
  "Normal": '16px',
  "Medium": '18.667px',
  "Large": '21.333px',
  "Huge": '24px'
}

let Size = Quill.import('attributors/style/size')
Size.whitelist = Object.values(sizes)
Quill.register(Size, true)

const spellcheck = ref(true)
const toolbar = ref<any>(null)
const emit = defineEmits([
  "settingsClicked",
  "exportPDF",
  "exportWord",
  "changeSpellcheck"
])

onMounted(() => {
  toolbar.value.style.backgroundColor = `rgba(255, 255, 255, 0.95)`
})
</script>

<template>
  <div id="toolbar" ref="toolbar" @click="emit('settingsClicked')">
    <select class="ql-font"></select>
    <select class="ql-size">
      <option :value="Object.values(sizes)[0]" selected>Normal</option>
      <option 
        v-for="size in Object.keys(sizes).slice(1)" 
        :key="size" :value="sizes[size]"
      >
        {{ size }}
      </option>
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
    <button><i-mdi:spellcheck @click="emit('changeSpellcheck'); spellcheck = !spellcheck" :class="{ 'text-red-600': !spellcheck, 'text-green-700': spellcheck }"></i-mdi:spellcheck></button>
    <button><i-mdi:file-pdf @click="emit('exportPDF')"></i-mdi:file-pdf></button>
    <button><i-grommet-icons:document-word @click="emit('exportWord')"></i-grommet-icons:document-word></button>
  </div>
</template>

<style>
.ql-container {
  font-size: 16px !important;
}
</style>