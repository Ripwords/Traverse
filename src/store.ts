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
    toolbar: useLocalStorage('toolbar', true),
    wordCount: useSessionStorage('wordCount', 0),
    opacity: useLocalStorage('opacity', 50),
    theme: useLocalStorage('theme', 'dark'),
    exportName: useLocalStorage('exportName', 'export'),
    alwaysTop: useLocalStorage('alwaysTop', false),
    spellcheck: useLocalStorage('spellcheck', true)
  })
})