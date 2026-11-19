<script setup>
import { ref, watch } from 'vue'
import { parseDimacsSolution } from '../domain/dimacsCodec.js'
import { onBeforeUnmount } from 'vue'

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.visible) {
    emit('close')
  }
}

window.addEventListener('keydown', handleKeydown)

onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))

const props = defineProps({
  visible: { type: Boolean, default: false },
  dimacs: { type: String, default: '' },
  varMap: { type: Object, default: () => ({}) },
  stats: { type: Object, default: () => ({ varsCount: 0, clausesCount: 0 }) },
  compileError: { type: String, default: '' }
})

const emit = defineEmits(['close', 'apply'])

const solverOutputText = ref('')
const parseError = ref('')
const copied = ref(false)

const OUTPUT_PLACEHOLDER = `Paste the output from any local or online SAT solver here.

Supported formats:

1) Online / MiniSat solver:
CPU time: 1.682s
SAT -1 -2 -3 4 -5 -6 -7 -8 -9 0

2) SAT Competition (CaDiCaL / Kissat / CryptoMiniSat):
s SATISFIABLE
v 1 -2 3 -4 0

3) Z3 (-dimacs):
sat
1 -2 3 -4`

watch(
  () => props.visible,
  (isOpen) => {
    if (isOpen) {
      solverOutputText.value = ''
      parseError.value = ''
      copied.value = false
    }
  }
)

async function handleCopyDimacs() {
  if (!props.dimacs) return
  await navigator.clipboard.writeText(props.dimacs)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

function handleDownloadDimacs() {
  if (!props.dimacs) return
  const blob = new Blob([props.dimacs], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'problem.cnf'
  link.click()
  URL.revokeObjectURL(url)
}

function handleApplyResult() {
  parseError.value = ''

  if (!solverOutputText.value.trim()) {
    parseError.value = 'Paste the solver output into the right panel first.'
    return
  }

  const assignment = parseDimacsSolution(solverOutputText.value, props.varMap)
  emit('apply', assignment)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dimacs-backdrop" @click.self="emit('close')">
      <div class="dimacs-dialog" role="dialog" aria-modal="true">
        <div class="dimacs-header">
          <div class="dimacs-title-group">
            <span class="dimacs-title">DIMACS CNF Export &amp; Solver Import</span>
            <span v-if="!compileError" class="dimacs-meta">
              {{ stats.varsCount }} vars · {{ stats.clausesCount }} clauses
            </span>
          </div>

          <button type="button" class="close-btn" @click="emit('close')">Close</button>
        </div>

        <div class="dimacs-guide">
          <p class="guide-lead">
            <strong>What is DIMACS CNF?</strong> It is the universal plain-text format understood by almost all SAT solvers (Z3, CaDiCaL, MiniSat, and web-based online SAT solvers). Variable names are stored in memory automatically so your results can be decoded back.
          </p>
          <div class="guide-steps">
            <span><strong>Step 1:</strong> Copy or download the generated CNF from the left panel.</span>
            <span><strong>Step 2:</strong> Run it in any local or online SAT solver.</span>
            <span><strong>Step 3:</strong> Paste the solver's output into the right panel and click <strong>Show Result</strong>.</span>
          </div>
        </div>

        <div v-if="compileError" class="dimacs-error-banner">
          {{ compileError }}
        </div>

        <div v-else class="dimacs-grid">
          <!-- Left Pane: DIMACS Output -->
          <div class="dimacs-pane">
            <div class="pane-head">
              <span>1. Generated DIMACS CNF (Copy from here)</span>
              <div class="pane-actions">
                <button type="button" class="mini-btn" @click="handleCopyDimacs">
                  {{ copied ? 'Copied!' : 'Copy' }}
                </button>
                <button type="button" class="mini-btn" @click="handleDownloadDimacs">
                  Download .cnf
                </button>
              </div>
            </div>
            <textarea
              class="code-box"
              :value="dimacs"
              readonly
              spellcheck="false"
            ></textarea>
          </div>

          <!-- Right Pane: External Solver Output -->
          <div class="dimacs-pane">
            <div class="pane-head">
              <span>2. External Solver Output (Paste here)</span>
            </div>
            <textarea
              v-model="solverOutputText"
              class="code-box"
              :placeholder="OUTPUT_PLACEHOLDER"
              spellcheck="false"
            ></textarea>
          </div>
        </div>

        <div class="dimacs-footer">
          <span v-if="parseError" class="parse-error">{{ parseError }}</span>
          <span v-else class="footer-hint">
            
          </span>

          <div class="footer-actions">
            <button type="button" class="secondary-btn" @click="emit('close')">Cancel</button>
            <button
              type="button"
              class="primary-btn"
              :disabled="Boolean(compileError)"
              @click="handleApplyResult"
            >
              Show Result
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dimacs-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background-color: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.dimacs-dialog {
  width: 92vw;
  height: 90vh;
  background-color: var(--bg-editor);
  border: 1px solid var(--border-strong);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.25);
}

.dimacs-header {
  height: 48px;
  padding: 0 20px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.dimacs-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dimacs-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-main);
}

.dimacs-meta {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--text-secondary);
  background-color: var(--bg-tertiary);
  padding: 2px 8px;
  border: 1px solid var(--border-color);
}

.dimacs-guide {
  padding: 12px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.guide-lead {
  margin: 0;
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.guide-lead strong {
  color: var(--text-main);
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.84rem;
  line-height: 1.45;
  color: var(--text-main);
}

.close-btn,
.mini-btn,
.secondary-btn {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  padding: 4px 10px;
  background-color: var(--bg-editor);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  cursor: pointer;
}

.close-btn:hover,
.mini-btn:hover,
.secondary-btn:hover {
  border-color: var(--border-strong);
  background-color: var(--bg-tertiary);
}

.dimacs-error-banner {
  margin: 20px;
  padding: 16px;
  font-family: var(--font-mono);
  font-size: 0.88rem;
  color: var(--status-error);
  background-color: #fef2f2;
  border: 1px solid #fecaca;
}

.dimacs-grid {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background-color: var(--border-color);
}

.dimacs-pane {
  background-color: var(--bg-editor);
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.pane-head {
  height: 38px;
  padding: 0 14px;
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.pane-actions {
  display: flex;
  gap: 6px;
}

.code-box {
  flex: 1;
  width: 100%;
  resize: none;
  border: none;
  outline: none;
  padding: 14px;
  font-family: var(--font-mono);
  font-size: 0.84rem;
  line-height: 1.55;
  color: var(--text-main);
  background-color: var(--bg-editor);
  box-sizing: border-box;
}

.dimacs-footer {
  height: 54px;
  padding: 0 20px;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-shrink: 0;
}

.footer-hint {
  font-size: 0.83rem;
  color: var(--text-secondary);
}

.parse-error {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--status-error);
  font-weight: 600;
}

.footer-actions {
  display: flex;
  gap: 10px;
}

.primary-btn {
  padding: 7px 20px;
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 600;
  color: #ffffff;
  background-color: var(--accent-primary);
  border: none;
  cursor: pointer;
}

.primary-btn:hover:not(:disabled) {
  background-color: var(--accent-hover);
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 820px) {
  .dimacs-grid {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
}
</style>