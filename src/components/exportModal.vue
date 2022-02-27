<script lang="ts" setup>
import { mainStore } from '../store'

const store = mainStore()
const props = defineProps<{ 
  type: string, 
  show: boolean,
  func: Function
}>()
const emit = defineEmits(["close"])
const showModal = ref(props.show)

watch(props, () => {
  showModal.value = props.show
})
</script>

<template>
  <n-modal
    class="mx-30vw"
    v-model:show="showModal"
    :mask-closable="false"
    preset="card"
    title="Save as"
    @after-leave="emit('close')"
  >
    <n-input type="text" v-model:value="store.exportName"></n-input>
    <div class="text-size-[30px] flex justify-end p-2">
      <button :theme-overridess="store.themeOverrides">
        <i-mdi:file-pdf v-if="props.type == 'pdf'" class="m-[0.7rem]" @click="func"></i-mdi:file-pdf>
        <i-grommet-icons:document-word v-if="props.type == 'word'" class="m-[0.7rem]" @click="func"></i-grommet-icons:document-word>
      </button>
    </div>
  </n-modal>
</template>