<script setup>
import { ref, watch, computed, nextTick } from 'vue'
import { useCodeHighlighter } from '../composables/useCodeHighlighter.js'
import { useSolver } from '../composables/useSolver.js'
import DimacsModal from './DimacsModal.vue'
import { SOLVER_TYPES } from '../domain/solverTypes.js'

const props = defineProps({
  code: { type: String, required: true },
  fileName: { type: String, default: 'playground.eproto' }
})

const emit = defineEmits(['update:code', 'solved', 'solving'])

const sourceCode = computed({
  get: () => props.code,
  set: (val) => emit('update:code', val)
})

const numbersColumn = ref(null)
const preRef = ref(null)
const textareaRef = ref(null)

const totalLines = computed(() => sourceCode.value.split('\n').length || 1)
const { highlightedCode } = useCodeHighlighter(sourceCode)

const { isCalculating, progressMsg, solve, stop, compileToDimacs, applyExternalAssignment } = useSolver({
  onStart: () => emit('solving'),
  onFinish: (payload) => emit('solved', payload)
})

const isDimacsOpen = ref(false)
const isExportingDimacs = ref(false)
const dimacsData = ref({ dimacs: '', varMap: {}, varsCount: 0, clausesCount: 0 })
const dimacsCompileError = ref('')

const handleOpenDimacs = async () => {
  dimacsCompileError.value = ''
  isExportingDimacs.value = true
  try {
    dimacsData.value = await compileToDimacs(sourceCode.value)
  } catch (err) {
    dimacsCompileError.value = err?.msg || err?.message || 'Compilation error'
  } finally {
    isExportingDimacs.value = false
    isDimacsOpen.value = true
  }
}

const handleApplyDimacs = (assignment) => {
  isDimacsOpen.value = false
  applyExternalAssignment(sourceCode.value, assignment)
}

const selectedSolver = ref(SOLVER_TYPES.MINISAT)

const handleSolve = () => {
  solve(sourceCode.value, { solverType: selectedSolver.value })
}

const handleStop = () => stop()

const syncScroll = () => {
  const textarea = textareaRef.value
  if (!textarea) return

  if (preRef.value) {
    preRef.value.scrollTop = textarea.scrollTop
    preRef.value.scrollLeft = textarea.scrollLeft
  }
  if (numbersColumn.value) {
    numbersColumn.value.scrollTop = textarea.scrollTop
  }
}

const handleInput = () => {
  nextTick(syncScroll)
}

watch(sourceCode, () => {
  nextTick(() => {
    if (textareaRef.value && textareaRef.value.scrollTop === 0) {
      syncScroll()
    }
  })
})

watch(highlightedCode, () => {
  nextTick(syncScroll)
})


</script>

<template>
  <div id="editor" class="editor-section">
    <div class="editor-toolbar">
      <span class="file-name">{{ fileName }}</span>

      <div class="toolbar-actions">
        <button
          type="button"
          class="dimacs-btn"
          :disabled="isCalculating || isExportingDimacs"
          @click="handleOpenDimacs"
        >
          {{ isExportingDimacs ? 'Compiling...' : 'To DIMACS' }}
        </button>

        <div class="solver-switch" role="group" aria-label="Select SAT solver">
          <button
            type="button"
            :class="['switch-option', { 'is-active': selectedSolver === SOLVER_TYPES.MINISAT }]"
            :aria-pressed="selectedSolver === SOLVER_TYPES.MINISAT"
            :disabled="isCalculating"
            title="Fast C++ MiniSat compiled to WebAssembly"
            @click="selectedSolver = SOLVER_TYPES.MINISAT"
          >
            MiniSat (WASM)
          </button>
          <button
            type="button"
            :class="['switch-option', { 'is-active': selectedSolver === SOLVER_TYPES.BUILTIN }]"
            :aria-pressed="selectedSolver === SOLVER_TYPES.BUILTIN"
            :disabled="isCalculating"
            title="Custom pure JavaScript 3-SAT solver"
            @click="selectedSolver = SOLVER_TYPES.BUILTIN"
          >
            Built-in JS
          </button>
        </div>

        <button type="button" v-if="isCalculating" class="stop-btn" @click="handleStop">
          Stop
        </button>
        <button type="button" class="solve-btn" :disabled="isCalculating" @click="handleSolve">
          {{ isCalculating ? 'Solving...' : 'Solve' }}
        </button>
      </div>
    </div>

    <div class="editor-container">
      <div class="line-numbers-sidebar" ref="numbersColumn">
        <div v-for="n in totalLines" :key="n" class="line-num">{{ n - 1 }}</div>
      </div>

      <div class="editor-workspace">
        <pre class="highlight-layer" ref="preRef"><code v-html="highlightedCode"></code></pre>

        <textarea
          ref="textareaRef"
          class="input-layer"
          v-model="sourceCode"
          placeholder="// Enter .eproto constraints here..."
          spellcheck="false"
          @input="handleInput"
          @scroll="syncScroll"
          @click="syncScroll"
        ></textarea>
      </div>
    </div>

    <div class="worker-progress-panel" :class="{ 'panel-visible': isCalculating && progressMsg }">
      <div class="progress-line-wrapper">
        <div v-if="progressMsg" class="progress-line">{{ progressMsg }}</div>
      </div>
    </div>
  </div>

  <DimacsModal
      :visible="isDimacsOpen"
      :dimacs="dimacsData.dimacs"
      :var-map="dimacsData.varMap"
      :stats="{ varsCount: dimacsData.varsCount, clausesCount: dimacsData.clausesCount }"
      :compile-error="dimacsCompileError"
      @close="isDimacsOpen = false"
      @apply="handleApplyDimacs"
    />
</template>

<style scoped>
.editor-section {
  --editor-font-size: 0.92rem;
  --editor-line-height: 22px;

  display: flex;
  flex-direction: column;
  background-color: var(--bg-editor);
}

.editor-toolbar {
  position: sticky;
  top: 0;
  z-index: 5;
  height: var(--subbar-height);
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.file-name {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.toolbar-actions {
  display: flex;
  gap: 8px;
}

.solve-btn {
  padding: 6px 24px;
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 600;
  color: #ffffff;
  background-color: var(--accent-primary);
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.solve-btn:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.solve-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.stop-btn {
  padding: 6px 16px;
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 600;
  color: #ffffff;
  background-color: var(--status-error);
  border: none;
  border-radius: 0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.stop-btn:hover {
  background-color: var(--status-error-hover);
}

.editor-container {
  display: flex;
  position: relative;
  width: 100%;
  height: 440px;
  background-color: var(--bg-editor);
  border-bottom: 1px solid var(--border-color);
  overflow: hidden;
}

.line-numbers-sidebar {
  width: 44px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: 14px 0 36px 0;
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
  flex-shrink: 0;
}

.line-num {
  font-family: var(--font-mono);
  font-size: var(--editor-font-size);
  line-height: var(--editor-line-height) !important;
  color: var(--text-muted);
  text-align: right;
  padding-right: 12px;
}

.editor-workspace {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 100%;
}

.highlight-layer,
.input-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 14px 14px 36px 14px;
  font-family: var(--font-mono) !important;
  font-size: var(--editor-font-size) !important;
  line-height: var(--editor-line-height) !important;
  letter-spacing: 0 !important;
  word-spacing: 0 !important;
  tab-size: 4 !important;
  white-space: pre-wrap !important;
  overflow-wrap: break-word !important;
  word-break: break-all !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
  overflow-y: scroll !important;
  border: none !important;
  outline: none !important;
}

.highlight-layer :deep(code),
.highlight-layer :deep(span) {
  font-family: inherit !important;
  font-size: inherit !important;
  line-height: inherit !important;
  letter-spacing: inherit !important;
  white-space: pre-wrap !important;
  overflow-wrap: break-word !important;
  word-break: break-all !important;
  margin: 0 !important;
  padding: 0 !important;
}

.input-layer {
  background: transparent;
  color: transparent !important;
  -webkit-text-fill-color: transparent;
  caret-color: var(--accent-primary);
  resize: none;
  z-index: 2;
}

.highlight-layer {
  color: var(--text-main);
  z-index: 1;
  pointer-events: none;
}

.worker-progress-panel {
  background-color: var(--bg-secondary);
  border-bottom: 1px solid transparent;
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  transition: max-height 0.25s ease, opacity 0.15s ease;
}

.worker-progress-panel.panel-visible {
  max-height: 500px;
  opacity: 1;
  border-bottom-color: var(--border-color);
}

.progress-line-wrapper {
  padding: 10px 16px;
}

.progress-line {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
  font-style: italic;
  white-space: pre-wrap;
  word-break: break-all;
}

.dimacs-btn {
  padding: 6px 14px;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-main);
  background-color: var(--bg-editor);
  border: 1px solid var(--border-color);
  border-radius: 0;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dimacs-btn:hover:not(:disabled) {
  border-color: var(--border-strong);
  background-color: var(--bg-tertiary);
}

.dimacs-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.solver-switch {
  display: inline-flex;
  align-items: center;
  padding: 2px;
  gap: 2px;
  border: 1px solid var(--border-color);
  background-color: #f1f5f9;
}

.switch-option {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.switch-option:hover:not(:disabled):not(.is-active) {
  color: var(--text-main);
  background-color: rgba(255, 255, 255, 0.6);
}

.switch-option.is-active {
  background-color: #ffffff;
  color: #1d4ed8;
  border-color: #cbd5e1;
  box-shadow: inset 0 -1px 0 #2563eb;
}

.switch-option:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

</style>