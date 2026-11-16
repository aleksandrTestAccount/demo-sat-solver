<script setup>
import { ref, computed, watch } from 'vue'
import DocsTopNav from '../components/DocsTopNav.vue'
import Sidebar from '../components/Sidebar.vue'
import BaseChunk from '../components/BaseChunk.vue'
import ChapterPager from '../components/ChapterPager.vue'

const props = defineProps({
  tabs: { type: Array, default: () => [] },
  activeTab: { type: String, default: '' },
  chunks: { type: Array, required: true }
})

const emit = defineEmits(['copy-code', 'update:activeTab'])

const activeSectionId = ref(props.chunks[0]?.id || '')
const contentAreaRef = ref(null)
const isDesktopCollapsed = ref(false)
const isMobileMenuOpen = ref(false)

watch(
  () => props.chunks,
  (newChunks) => {
    if (newChunks?.length > 0) {
      activeSectionId.value = newChunks[0].id
    }
    isMobileMenuOpen.value = false
  }
)

function onAfterChapterLeave() {
  if (!contentAreaRef.value) return

  // 1. Desktop: reset internal scroll of .content-area
  contentAreaRef.value.scrollTop = 0

  // 2. Mobile: smoothly scroll window back to the top of the chapter container
  const rect = contentAreaRef.value.getBoundingClientRect()
  if (rect.top < 0) {
    contentAreaRef.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const activeIndex = computed(() => {
  const idx = props.chunks.findIndex((item) => item.id === activeSectionId.value)
  return idx >= 0 ? idx : 0
})

const activeSection = computed(() => {
  return props.chunks[activeIndex.value] || null
})

const prevSection = computed(() => {
  return activeIndex.value > 0 ? props.chunks[activeIndex.value - 1] : null
})

const nextSection = computed(() => {
  return activeIndex.value < props.chunks.length - 1 ? props.chunks[activeIndex.value + 1] : null
})

function handleSelectChapter(id) {
  activeSectionId.value = id
  isMobileMenuOpen.value = false
}

const handleContentClick = (event) => {
  const copyBtn = event.target.closest('[data-action="copy"]')
  if (!copyBtn) return

  const wrapper = copyBtn.closest('.code-block-wrapper')
  const codeElement = wrapper?.querySelector('pre code')

  if (codeElement) {
    emit('copy-code', codeElement.innerText)
  }
}
</script>

<template>
  <div class="docs-shell">
    <DocsTopNav
      :tabs="tabs"
      :active-tab="activeTab"
      :is-mobile-menu-open="isMobileMenuOpen"
      @update:active-tab="emit('update:activeTab', $event)"
      @toggle-mobile-menu="isMobileMenuOpen = !isMobileMenuOpen"
    />

    <div class="page-with-sidebar">
      <Sidebar
        :items="chunks"
        :active-id="activeSectionId"
        :collapsed="isDesktopCollapsed"
        :mobile-open="isMobileMenuOpen"
        @select="handleSelectChapter"
      />

      <!-- Vertical Divider with Collapse Pill (Desktop only) -->
      <div class="sidebar-divider-line">
        <button
          type="button"
          :aria-expanded="!isDesktopCollapsed"
          :aria-label="isDesktopCollapsed ? 'Expand chapters sidebar' : 'Collapse chapters sidebar'"
          :class="['edge-pill', { 'is-collapsed': isDesktopCollapsed }]"
          :title="isDesktopCollapsed ? 'Expand chapters' : 'Collapse chapters'"
          @click="isDesktopCollapsed = !isDesktopCollapsed"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              v-if="!isDesktopCollapsed"
              d="M7.5 2.5L4 6L7.5 9.5"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              v-else
              d="M4.5 2.5L8 6L4.5 9.5"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>

      <section ref="contentAreaRef" class="content-area" @click="handleContentClick">
        <Transition name="content-slide" mode="out-in" @after-leave="onAfterChapterLeave">
          <div v-if="activeSection" :key="activeSection.id" class="chapter-container">
            <!-- Top Chapter Pagination -->
            <div class="pager-top">
              <ChapterPager
                :prev="prevSection"
                :next="nextSection"
                @select="handleSelectChapter"
              />
            </div>

            <header class="chapter-header">
              <div class="chapter-meta">
                Section {{ activeIndex + 1 }} of {{ chunks.length }}
              </div>
              <h1 class="chapter-main-title">
                {{ activeSection.title || activeSection.name }}
              </h1>
            </header>

            <!-- Chapter Body -->
            <BaseChunk :html-content="activeSection.contentHtml" :file-name="activeSection.id" />

            <!-- Bottom Chapter Pagination -->
            <div class="pager-bottom">
              <ChapterPager
                :prev="prevSection"
                :next="nextSection"
                @select="handleSelectChapter"
              />
            </div>

            <div class="content-spacer"></div>
          </div>
        </Transition>
      </section>
    </div>
  </div>
</template>

<style scoped>
.docs-shell {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.page-with-sidebar {
  display: flex;
  flex: 1;
  min-height: 0;
  width: 100%;
}

.sidebar-divider-line {
  position: relative;
  width: 1px;
  background-color: var(--border-color);
  flex-shrink: 0;
  z-index: 15;
}

.edge-pill {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  width: 14px;
  height: 84px;
  padding: 0;
  border-radius: 0 4px 4px 0;
  background-color: var(--bg-editor);
  border: 1px solid var(--border-color);
  border-left: none;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;
}

.edge-pill:hover,
.edge-pill.is-collapsed {
  border-color: var(--border-strong);
  color: var(--text-main);
  background-color: var(--bg-tertiary);
}

.content-area {
  flex: 1;
  min-width: 0;
  padding: 24px 36px;
  background-color: var(--bg-secondary);
  overflow-y: auto;
  scrollbar-gutter: stable;
}

.chapter-container {
  max-width: 820px;
}

.pager-top {
  margin-bottom: 20px;
}

.chapter-header {
  margin-bottom: 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-color);
}

.chapter-meta {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--accent-primary);
  margin-bottom: 6px;
}

.chapter-main-title {
  margin: 0;
  font-family: var(--font-sans);
  font-size: 1.65rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--text-main);
}

.pager-bottom {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.content-spacer {
  height: 80px;
  width: 100%;
}

.content-slide-enter-active,
.content-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.content-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.content-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

@media (max-width: 960px) {
  .page-with-sidebar {
    flex-direction: column;
  }
  .sidebar-divider-line {
    display: none;
  }
  .content-area {
    padding: 20px 16px;
  }
}
</style>