<template>
  <template v-if="slides.length">
    <Screen v-if="screening" />
    <Editor v-else-if="_isPC" />
    <Mobile v-else />
  </template>
  <FullscreenSpin tip="数据初始化中，请稍等 ..." v-else  loading :mask="false" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { nanoid } from 'nanoid'
import { useScreenStore, useMainStore, useSnapshotStore, useSlidesStore } from '@/store'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { deleteDiscardedDB } from '@/utils/database'
import { isPC } from '@/utils/common'
import { convertWiseDeckSlidesToPPTist } from '@/utils/wiseDeckToPPTist'
import { normalizeSlidesFromPptxBridge } from '@/utils/pptxtojsonElementNormalize'
import useImport from '@/hooks/useImport'
import api from '@/services'

import Editor from './views/Editor/index.vue'
import Screen from './views/Screen/index.vue'
import Mobile from './views/Mobile/index.vue'
import FullscreenSpin from '@/components/FullscreenSpin.vue'

const PPTIST_STORAGE_KEY = 'wisedeck_pptist_slides';

const _isPC = isPC()

const mainStore = useMainStore()
const slidesStore = useSlidesStore()
const snapshotStore = useSnapshotStore()
const screenStore = useScreenStore()
const { databaseId } = storeToRefs(mainStore)
const { slides } = storeToRefs(slidesStore)
const { screening } = storeToRefs(screenStore)

const isAudienceMode = new URLSearchParams(window.location.search).get('mode') === 'audience'
const isEmbedMode = window.self !== window.top
const initialized = ref(false)
/** 直连 importPPTXFile 成功后忽略父页 JSON SYNC，避免劣质 seed 覆写画布 */
const pptxImportLocked = ref(false)
let pptxImportInFlight = false

const { importPPTXFile } = useImport()

/** 父页检测直连导入能力（原外链 bridge；现由 App 内 importPPTXFile 处理） */
if (isEmbedMode) {
  (window as unknown as { __WISEDECK_PPTX_IMPORT_BRIDGE__?: boolean }).__WISEDECK_PPTX_IMPORT_BRIDGE__ = true
}

async function handleWiseDeckPptxImport(event: MessageEvent) {
  const data = event.data
  if (!data || data.type !== 'WISEDECK_IMPORT_PPTX_FROM_PARENT') return

  if (pptxImportLocked.value) {
    console.info('[PPTist] Ignoring duplicate WISEDECK_IMPORT_PPTX_FROM_PARENT (import already locked)')
    return
  }
  if (pptxImportInFlight) {
    console.info('[PPTist] Ignoring concurrent WISEDECK_IMPORT_PPTX_FROM_PARENT')
    return
  }

  const projectId = data.projectId as string | undefined
  pptxImportInFlight = true
  console.info('[PPTist] WISEDECK_IMPORT_PPTX_FROM_PARENT start', { projectId })
  try {
    let buffer: ArrayBuffer
    if (data.arrayBuffer instanceof ArrayBuffer) {
      buffer = data.arrayBuffer
    } else if (typeof data.fetchUrl === 'string' && data.fetchUrl) {
      const resp = await fetch(data.fetchUrl, { credentials: 'include' })
      if (!resp.ok) throw new Error(`staging fetch HTTP ${resp.status}`)
      buffer = await resp.arrayBuffer()
    } else {
      throw new Error('no pptx bytes in import message')
    }

    const file = new File([buffer], 'wisedeck-import.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    })
    await importPPTXFile([file], { cover: true, fixedViewport: true, awaitResult: true })

    if (data.slideIndex !== undefined && typeof data.slideIndex === 'number') {
      slidesStore.slideIndex = data.slideIndex
    }
    if (!initialized.value) {
      initialized.value = true
      deleteDiscardedDB()
      snapshotStore.initSnapshotDatabase()
    }

    pptxImportLocked.value = true
    console.info('[PPTist] WISEDECK_IMPORT_PPTX_FROM_PARENT done', { projectId })
    window.parent.postMessage({ type: 'WISEDECK_IMPORT_PPTX_DONE', projectId }, '*')
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    console.error('[PPTist] WISEDECK_IMPORT_PPTX_FROM_PARENT failed:', err)
    window.parent.postMessage({ type: 'WISEDECK_IMPORT_PPTX_ERROR', projectId, error }, '*')
  } finally {
    pptxImportInFlight = false
  }
}

if (isEmbedMode) {
  window.addEventListener('message', (event: MessageEvent) => {
    void handleWiseDeckPptxImport(event)
  })
}

if (import.meta.env.MODE !== 'development') {
  window.onbeforeunload = () => false
}

function detectSlideFormat(slides: any[]): 'pptist' | 'wisedeck' {
  if (!slides || slides.length === 0) return 'wisedeck'
  
  const firstSlide = slides[0]
  
  // PPTist格式：elements存在且有内容（elements.length > 0）
  if (firstSlide.elements && Array.isArray(firstSlide.elements) && firstSlide.elements.length > 0) {
    console.log('[PPTist] PPTist format detected: elements count =', firstSlide.elements.length)
    return 'pptist'
  }
  
  // WiseDeck格式：有html_content字段
  if (firstSlide.html_content !== undefined || firstSlide.title !== undefined) {
    console.log('[PPTist] WiseDeck format detected: has html_content or title')
    return 'wisedeck'
  }
  
  // 默认视为PPTist格式
  console.log('[PPTist] Unknown format, defaulting to PPTist')
  return 'pptist'
}

function loadSlidesFromLocalStorage(): any | null {
  try {
    const storedData = localStorage.getItem(PPTIST_STORAGE_KEY);
    if (storedData) {
      console.log('[PPTist] Found data in localStorage');
      const data = JSON.parse(storedData);
      localStorage.removeItem(PPTIST_STORAGE_KEY);
      return data;
    }
  } catch (e) {
    console.error('[PPTist] Failed to load from localStorage:', e);
  }
  return null;
}

function handleExternalSlides(event: MessageEvent) {
  if (!event.data || event.data.type !== 'SYNC_SLIDES_TO_PPTIST') {
    return
  }

  if (pptxImportLocked.value) {
    console.info('[PPTist] Ignoring SYNC_SLIDES_TO_PPTIST (PPTX import locked)')
    return
  }
  
  console.log('[PPTist] Received SYNC_SLIDES_TO_PPTIST message')
  console.log('[PPTist] Slides count:', event.data.slides?.length || 0)
  
  if (event.data.slides && Array.isArray(event.data.slides)) {
    const format = detectSlideFormat(event.data.slides)
    console.log('[PPTist] Detected slide format:', format)
    
    if (format === 'pptist') {
      console.log('[PPTist] Using PPTist format elements directly')
      
      // 直接使用 slides 中的 elements 字段
      const themeFromMeta = Array.isArray(event.data.meta?.themeColors)
        ? event.data.meta.themeColors as string[]
        : undefined

      const pptistSlides = event.data.slides.map((slide: any, index: number) => {
        console.log(`[PPTist] Slide ${index + 1}: elements count = ${slide.elements?.length || 0}, background = ${JSON.stringify(slide.background)}`)
        return {
          id: slide.id || slide.page_number?.toString() || nanoid(10),
          elements: slide.elements || [],
          notes: slide.notes || [],
          remark: slide.remark || '',
          background: slide.background || { type: 'solid', color: '#ffffff' },
          animations: slide.animations || [],
          turningMode: slide.turningMode,
          sectionTag: slide.sectionTag,
          type: slide.type
        }
      })

      const normalizedSlides = normalizeSlidesFromPptxBridge(pptistSlides, themeFromMeta)
      if (themeFromMeta?.length) {
        slidesStore.setTheme({ themeColors: themeFromMeta })
      }

      console.log('[PPTist] Setting', normalizedSlides.length, 'slides directly')
      slidesStore.setSlides(normalizedSlides)
    } else {
      console.log('[PPTist] Converting WiseDeck slides to PPTist format...')
      const convertedSlides = convertWiseDeckSlidesToPPTist(event.data.slides)
      console.log('[PPTist] Converted', convertedSlides.length, 'slides')
      slidesStore.setSlides(convertedSlides)
    }
    console.log('[PPTist] Slides synced, current slides in store:', slidesStore.slides.length)
  }
  
  if (event.data.slideIndex !== undefined) {
    slidesStore.slideIndex = event.data.slideIndex
  }
  
  if (!initialized.value) {
    initialized.value = true
    deleteDiscardedDB()
    snapshotStore.initSnapshotDatabase()
  }
}

function tryLoadSlides() {
  const data = loadSlidesFromLocalStorage()
  if (data && data.slides) {
    console.log('[PPTist] Loaded', data.slides.length, 'slides from localStorage')
    const format = detectSlideFormat(data.slides)
    
    if (format === 'wisedeck') {
      console.log('[PPTist] Converting WiseDeck slides to PPTist format...')
      const convertedSlides = convertWiseDeckSlidesToPPTist(data.slides)
      slidesStore.setSlides(convertedSlides)
    } else {
      slidesStore.setSlides(data.slides as any)
    }
    
    initialized.value = true
    deleteDiscardedDB()
    snapshotStore.initSnapshotDatabase()
    return true
  }
  return false
}

onMounted(async () => {
  console.log('[PPTist] App mounted, isEmbedMode:', isEmbedMode);

  if (isEmbedMode) {
    window.parent.postMessage({ type: 'PPTIST_EMBED_READY' }, '*')
    console.info('[PPTist] Sent PPTIST_EMBED_READY to parent')
  }

  window.addEventListener('message', (event: MessageEvent) => {
    if (!event.data || typeof event.data !== 'object') return;
    console.log('[PPTist] Received message:', event.data)
    
    if (event.data.type === 'SYNC_SLIDES_TO_PPTIST') {
      handleExternalSlides(event)
    }
    
    if (event.data.type === 'REQUEST_SAVE_FROM_PPTIST') {
      console.log('[PPTist] Save requested from WiseDeck')
      window.parent.postMessage({
        type: 'SAVE_SLIDES_FROM_PPTIST',
        slides: JSON.parse(JSON.stringify(slidesStore.slides)),
        projectId: event.data.projectId
      }, '*')
    }
  })

  if (isAudienceMode) {
    slidesStore.setSlides([{
      id: nanoid(10),
      elements: [],
    }])
    screenStore.setScreening(true)
    initialized.value = true
  } else if (isEmbedMode) {
    console.log('[PPTist] Running in embed mode, waiting for postMessage data...')
  } else {
    const slidesData = await api.getMockData('slides')
    slidesStore.setSlides(slidesData)

    await deleteDiscardedDB()
    snapshotStore.initSnapshotDatabase()
    initialized.value = true
  }
})

window.addEventListener('beforeunload', () => {
  const discardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  const discardedDBList: string[] = discardedDB ? JSON.parse(discardedDB) : []

  discardedDBList.push(databaseId.value)

  const newDiscardedDB = JSON.stringify(discardedDBList)
  localStorage.setItem(LOCALSTORAGE_KEY_DISCARDED_DB, newDiscardedDB)
})
</script>

<style lang="scss">
#app {
  height: 100%;
}
</style>