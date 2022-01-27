import { defineStore } from 'pinia'
import { useSessionStorage } from '@vueuse/core'

export const mainStore = defineStore('mainStore', {
  state: () => ({
    content: useSessionStorage('content', '')
  })
})