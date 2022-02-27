import { defineStore } from 'pinia'
import { useLocalStorage, useSessionStorage } from '@vueuse/core'

export const mainStore = defineStore('mainStore', {
  state: () => ({
    themeOverrides: {
      common: {
        primaryColor: '#8a8a8a'
      }
    },
    content: useSessionStorage('content', { ops: [] }) as any,
    opacity: useLocalStorage('opacity', 50),
    theme: useLocalStorage('theme', 'dark'),
    exportName: useLocalStorage('exportName', 'export'),
    alwaysTop: useLocalStorage('alwaysTop', false),
  })
})