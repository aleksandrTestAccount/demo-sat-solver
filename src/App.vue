<script setup>
import { ref, computed, nextTick } from 'vue'
import ContentView from './views/ContentView.vue'
import CodeEditor from './components/CodeEditor.vue'
import SolverResults from './components/SolverResults.vue'
import { useSplitPane } from './composables/useSplitPane.js'
import {
  APP_PAGES,
  PAGE_CONTENT_MAP,
  DEFAULT_PAGE_ID,
  DEFAULT_SOURCE_CODE,
  EXTERNAL_DOCS
} from './config/appConfig.js'

const currentTabId = ref(DEFAULT_PAGE_ID)
const sourceCode = ref(DEFAULT_SOURCE_CODE)
const solverData = ref(null)

const resultsRef = ref(null)
const editorPaneRef = ref(null)

const currentChunks = computed(() => PAGE_CONTENT_MAP[currentTabId.value] || [])

const {
  containerRef: workspaceRef,
  leftWidthPercent,
  isResizing,
  startResize,
  resetSplit
} = useSplitPane({ initialPercent: 60, minPercent: 20, maxPercent: 80 })

function handleSolvingStart() {
  resultsRef.value?.setExpanded(false)
}

async function handleSolverResult(result) {
  solverData.value = result
  await nextTick()

  setTimeout(() => {
    const targetEl = resultsRef.value?.$el?.nodeType === 1
      ? resultsRef.value.$el
      : document.getElementById('results')

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, 120)
}

function handleCopyCode(newCode) {
  sourceCode.value = newCode
  if (editorPaneRef.value) {
    editorPaneRef.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="app-shell">
    <!-- Top Bar -->
    <header class="topbar">
      <div class="topbar-left">
        <span class="brand-badge">3-SAT</span>
        <span class="brand-title">Proto Equation Language</span>
        <span class="brand-version">v0.1</span>
      </div>

      <div class="topbar-right">
        <a :href="EXTERNAL_DOCS.source.url" target="_blank" rel="noopener noreferrer" class="top-link">
          {{ EXTERNAL_DOCS.source.title }}
        </a>
        <a :href="EXTERNAL_DOCS.docs.url" target="_blank" rel="noopener noreferrer" class="top-link">
          {{ EXTERNAL_DOCS.docs.title }}
        </a>
      </div>
    </header>

    <!-- Main Split-Screen Workspace -->
    <div
      ref="workspaceRef"
      class="split-workspace"
      :style="{ '--left-pane-width': `${leftWidthPercent}%` }"
    >
      <!-- Left Pane: Navigation + Documentation -->
      <div class="pane-docs">
        <ContentView
          v-model:activeTab="currentTabId"
          :tabs="APP_PAGES"
          :chunks="currentChunks"
          @copy-code="handleCopyCode"
        />
      </div>

      <!-- Draggable Divider -->
      <div
        :class="['split-resizer', { 'is-active': isResizing }]"
        title="Drag to resize (double-click to reset 60/40)"
        @mousedown.prevent="startResize"
        @dblclick="resetSplit"
      >
        <div class="resizer-handle" aria-hidden="true">
          <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
            <circle cx="3" cy="3" r="1.1" />
            <circle cx="7" cy="3" r="1.1" />
            <circle cx="3" cy="7" r="1.1" />
            <circle cx="7" cy="7" r="1.1" />
            <circle cx="3" cy="11" r="1.1" />
            <circle cx="7" cy="11" r="1.1" />
          </svg>
        </div>
      </div>

      <!-- Right Pane: Editor + Solver Results -->
      <div ref="editorPaneRef" class="pane-editor">
        <CodeEditor
          v-model:code="sourceCode"
          file-name=""
          @solving="handleSolvingStart"
          @solved="handleSolverResult"
        />

        <SolverResults v-if="solverData" ref="resultsRef" :data="solverData" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.topbar {
  height: var(--topbar-height);
  background-color: var(--bg-toolbar);
  border-bottom: 1px solid var(--border-color);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-badge {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: #ffffff;
  background-color: #334155;
  padding: 2px 7px;
  letter-spacing: 0.04em;
}

.brand-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-main);
}

.brand-version {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-muted);
  background: rgba(0, 0, 0, 0.05);
  padding: 1px 6px;
  border: 1px solid var(--border-color);
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-link {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-decoration: none;
  padding: 5px 12px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  transition: all 0.15s ease;
}

.top-link:hover {
  color: var(--text-main);
  border-color: var(--border-strong);
}

.split-workspace {
  flex: 1;
  display: grid;
  grid-template-columns: var(--left-pane-width, 60%) 1px minmax(0, 1fr);
  min-height: 0;
}

.pane-docs {
  display: flex;
  background-color: var(--bg-secondary);
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.split-resizer {
  width: 1px;
  background-color: var(--border-color);
  cursor: col-resize;
  position: relative;
  transition: background-color 0.15s ease;
  z-index: 20;
}

/* Extended invisible hit area for easier mouse grabbing */
.split-resizer::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -4px;
  right: -4px;
}

.split-resizer:hover,
.split-resizer.is-active {
  background-color: var(--border-strong);
}

.resizer-handle {
  position: absolute;
  top: calc(var(--subbar-height) / 2);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 14px;
  height: 24px;
  border-radius: 3px;
  background-color: var(--bg-editor);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.15s ease;
}

.split-resizer:hover .resizer-handle,
.split-resizer.is-active .resizer-handle {
  border-color: var(--border-strong);
  color: var(--text-main);
  background-color: var(--bg-secondary);
}

.pane-editor {
  display: flex;
  flex-direction: column;
  background-color: var(--bg-editor);
  overflow-y: auto;
  scrollbar-gutter: stable;
  min-width: 0;
  min-height: 0;
}

@media (max-width: 960px) {
  .app-shell {
    height: auto;
    overflow: auto;
  }
  .split-workspace {
    grid-template-columns: 1fr;
  }
  .split-resizer {
    display: none;
  }
  .pane-docs {
    border-bottom: 1px solid var(--border-strong);
  }
}
</style>