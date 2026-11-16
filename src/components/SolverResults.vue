<script setup>
import { ref, watch, computed, toRaw } from 'vue'
import { highlightCode } from '../utils/highlight.js'

const MAX_DETAIL_LINES = 10000
const IGNORED_RESULT_KEYS = new Set([
  'code',
  'generatorCode',
  'format',
  'generatorFormat',
  '_timing'
])

const props = defineProps({
  data: { type: Object, default: null }
})

const highlight = (text) => highlightCode(String(text ?? ''))

const isExpanded = ref(true)
const showDetails = ref(false)
const expandedDetails = ref({})

watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      isExpanded.value = true
      showDetails.value = false
      expandedDetails.value = {}
    }
  }
)

function setExpanded(value) {
  isExpanded.value = Boolean(value)
}

function toggleDetailItem(key) {
  expandedDetails.value[key] = !expandedDetails.value[key]
}

defineExpose({ setExpanded })

function formatEquationLine(lineTokens, results) {
  let substitutedHtml = ''
  let rightSideText = ''

  for (const rawToken of lineTokens) {
    const token = String(rawToken)
    const computedValue = results[token]
    const leftTokenText = computedValue === undefined ? `${token} ` : ` ${computedValue} `

    rightSideText += `${token} `
    substitutedHtml += highlightCode(leftTokenText)
  }

  return {
    substitutedHtml,
    original: rightSideText.replace(/\s+/g, ' ').trim()
  }
}

const formattedEquations = computed(() => {
  const tokensLines = props.data?.tokensLines
  if (!Array.isArray(tokensLines) || tokensLines.length === 0) return []

  const rawLines = toRaw(tokensLines)
  const rawResults = toRaw(props.data.inputVarsResults) || {}

  return rawLines.map((line) => formatEquationLine(toRaw(line) || [], rawResults))
})

function normalizeDetailSection(key, val) {
  if (typeof val === 'string') {
    return {
      key,
      count: val.length === 0 ? 0 : 1,
      isPre: true,
      lines: val.length === 0 ? [] : [val]
    }
  }

  if (Array.isArray(val)) {
    const limit = Math.min(val.length, MAX_DETAIL_LINES)
    const lines = []
    for (let i = 0; i < limit; i++) {
      const item = val[i]
      if (Array.isArray(item)) {
        lines.push(item.join(' '))
      } else if (typeof item === 'object' && item !== null) {
        lines.push(JSON.stringify(item))
      } else {
        lines.push(String(item))
      }
    }
    if (val.length > MAX_DETAIL_LINES) lines.push('...')

    return { key, count: val.length, isPre: false, lines }
  }

  if (typeof val === 'object') {
    const entries = Object.entries(val)
    const limit = Math.min(entries.length, MAX_DETAIL_LINES)
    const lines = []
    for (let i = 0; i < limit; i++) {
      const [k, v] = entries[i]
      lines.push(`${k}: ${v}`)
    }
    if (entries.length > MAX_DETAIL_LINES) lines.push('...')

    return { key, count: entries.length, isPre: false, lines }
  }

  return null
}

const detailSections = computed(() => {
  if (!props.data || typeof props.data !== 'object') return []

  const rawData = toRaw(props.data)
  const sections = []

  for (const key of Object.keys(rawData)) {
    if (IGNORED_RESULT_KEYS.has(key)) continue
    const val = rawData[key]
    if (val === undefined || val === null) continue

    const section = normalizeDetailSection(key, val)
    if (section) sections.push(section)
  }

  return sections
})
</script>

<template>
  <div v-if="data" id="results" class="solver-card animate-fade">
    <div class="collapsible-wrapper" :class="{ 'is-open': isExpanded }">
      <div class="collapsible-inner">
        <!-- Execution Timing Bar -->
        <div
          v-if="data._timing"
          :class="['timing-bar', data.isCrashError ? 'timing-err' : 'timing-ok']"
        >
          Started at {{ data._timing.startedAt }}; ended at {{ data._timing.endedAt }};
          duration: {{ data._timing.duration }}ms
        </div>

        <!-- Compilation or Solver Error -->
        <div v-if="data.isCrashError" class="error-msg-section">
          <div class="status-row">
            <div class="badge badge-error">ERROR</div>
          </div>
          <div class="error-title">{{ data.message }}</div>
        </div>

        <!-- Standard Solver Output -->
        <div v-else class="results-body">
          <!-- Generator Mode -->
          <div v-if="data.generatorCode || data.code" class="generator-container">
            <template v-if="data.generatorFormat">
              <div class="generator-title">Result:</div>
              <pre class="format-result-box"><code>{{ data.generatorFormat }}</code></pre>
            </template>

            <template v-if="data.generatorCode || data.code">
              <div class="generator-title">Code:</div>
              <pre class="el-code-box"><code v-html="highlight(data.generatorCode || data.code)"></code></pre>
            </template>

            <div class="solver-result-title">Equation solver result:</div>
          </div>

          <!-- Execution Status Badge -->
          <div class="status-row">
            <div v-if="data.results === false" class="badge badge-false">Result: False</div>
            <div v-else-if="data.isSolve === false" class="badge badge-neutral">
              Result is not computed
            </div>
            <div v-else class="badge badge-true">Result: True</div>
          </div>

          <!-- 3-SAT Metrics -->
          <div v-if="data.sat3Stats" class="output-section">
            <div class="section-header">3-SAT</div>
            <div class="vars-list">
              <div class="var-item">
                <span class="var-key">vars:</span>
                <span class="var-val">{{ data.sat3Stats.varsCount ?? '(empty)' }}</span>
              </div>
              <div class="var-item">
                <span class="var-key">clauses:</span>
                <span class="var-val">{{ data.sat3Stats.clausesCount ?? '(empty)' }}</span>
              </div>
            </div>
          </div>

          <!-- Format Output -->
          <div v-if="Array.isArray(data.format) && data.format.length > 0" class="output-section">
            <div class="section-header">Format</div>
            <pre class="format-result-box"><code>{{ data.format.join('\n') }}</code></pre>
          </div>

          <!-- Binary Search Steps -->
          <div v-if="data.binarySearchSteps?.length > 0" class="output-section">
            <div class="section-header">binarySearchSteps</div>
            <div class="binary-steps-block">
              <div v-for="(step, idx) in data.binarySearchSteps" :key="idx" class="step-item">
                <code v-html="highlight(step)"></code>
              </div>
            </div>
          </div>

          <!-- Computed Variables (Results) -->
          <div v-if="data.results === false || data.inputVarsResults" class="output-section">
            <div class="section-header">Results</div>
            <div class="vars-list">
              <div v-if="data.results === false" class="var-item">False</div>
              <template v-else>
                <div v-if="Object.keys(data.inputVarsResults).length === 0" class="var-item">
                  (empty)
                </div>
                <div
                  v-for="(val, varName) in data.inputVarsResults"
                  :key="varName"
                  class="var-item"
                >
                  <span class="var-key">{{ varName }}:</span>
                  <span class="var-val" v-html="highlight(val)"></span>
                </div>
              </template>
            </div>
          </div>

          <!-- Substituted Equations -->
          <div
            v-if="data.inputVarsResults && formattedEquations.length > 0"
            class="output-section"
          >
            <div class="section-header">Equations</div>
            <div class="equations-block">
              <div v-for="(eq, idx) in formattedEquations" :key="idx" class="eq-item">
                <code class="eq-comment">// {{ eq.original }}</code>
                <code class="eq-result" v-html="eq.substitutedHtml"></code>
              </div>
            </div>
          </div>

          <!-- Diagnostic Details Accordion -->
          <div class="details-root">
            <button type="button" class="details-toggle-btn" @click="showDetails = !showDetails">
              <span>Details</span>
              <span class="details-arrow">{{ showDetails ? '▲' : '▼' }}</span>
            </button>

            <div v-if="showDetails" class="details-accordion">
              <div v-for="section in detailSections" :key="section.key" class="detail-group">
                <button
                  type="button"
                  class="detail-group-header"
                  @click="toggleDetailItem(section.key)"
                >
                  <span class="detail-key">{{ section.key }}({{ section.count }})</span>
                  <span class="detail-chevron">
                    {{ expandedDetails[section.key] ? '−' : '+' }}
                  </span>
                </button>

                <div v-if="expandedDetails[section.key]" class="detail-group-body">
                  <div v-if="section.lines.length === 0" class="detail-line muted">(empty)</div>
                  <pre v-else-if="section.isPre" class="detail-pre">{{ section.lines[0] }}</pre>
                  <div v-else v-for="(line, lIdx) in section.lines" :key="lIdx" class="detail-line">
                    {{ line }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.solver-card {
  margin: 16px 24px 36px;
  font-family: var(--font-sans);
  color: var(--text-main);
  scroll-margin-top: 56px;
}

.collapsible-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  transition:
    grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.25s ease;
}

.collapsible-wrapper.is-open {
  grid-template-rows: 1fr;
  opacity: 1;
}

.collapsible-inner {
  overflow: hidden;
  min-height: 0;
}

/* Timing bar */
.timing-bar {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  padding: 6px 12px;
  margin-bottom: 12px;
  border: 1px solid var(--border-color);
}

.timing-ok {
  color: var(--text-secondary);
  background-color: var(--bg-secondary);
}

.timing-err {
  color: var(--status-error-hover);
  background-color: var(--status-error-bg);
  border-color: var(--status-error-border);
}

.status-row {
  margin-bottom: 14px;
}

/* Status badges */
.badge {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.84rem;
  font-weight: 700;
  padding: 4px 12px;
  border: 1px solid transparent;
}

.badge-true {
  color: var(--status-success);
  background-color: var(--status-success-bg);
  border-color: var(--status-success-border);
}

.badge-false {
  color: var(--status-error-hover);
  background-color: #fee2e2;
  border-color: #fca5a5;
}

.badge-neutral {
  color: #1e40af;
  background-color: #dbeafe;
  border-color: #93c5fd;
}

.badge-error {
  color: #b45309;
  background-color: #fef3c7;
  border-color: #fcd34d;
}

/* Generator mode */
.generator-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 16px;
}

.generator-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}

.format-result-box {
  margin: 0;
  padding: 10px 14px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  overflow-x: auto;
}

.format-result-box code {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--accent-primary);
  font-weight: 700;
}

.el-code-box {
  margin: 0;
  padding: 14px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  overflow-x: auto;
}

.el-code-box code {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-main);
}

.solver-result-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-top: 12px;
  border-top: 1px solid var(--border-color);
  padding-top: 12px;
}

/* Error block */
.error-msg-section {
  padding: 4px 0;
}

.error-title {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--status-error-hover);
  margin-bottom: 8px;
  font-weight: 700;
}

/* Standard results body */
.results-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.output-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.section-header {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.vars-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 12px 14px;
}

.var-item {
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.var-key {
  color: var(--color-variable);
  font-weight: 700;
  margin-right: 8px;
}

.var-val {
  font-weight: 600;
}

.binary-steps-block,
.equations-block {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.step-item code {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.equations-block {
  gap: 10px;
  overflow-x: auto;
}

.eq-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.5;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.eq-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.eq-comment {
  color: var(--color-comment);
  font-style: italic;
  white-space: pre-wrap;
}

.eq-result {
  color: var(--text-main);
  white-space: pre-wrap;
}

/* Details Accordion */
.details-root {
  margin-top: 8px;
  border-top: 1px solid var(--border-color);
  padding-top: 14px;
}

.details-toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text-main);
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 6px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.details-toggle-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.details-accordion {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-group {
  border: 1px solid var(--border-color);
  background-color: var(--bg-editor);
}

.detail-group-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background-color: var(--bg-secondary);
  border: none;
  font-family: var(--font-mono);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--text-main);
  cursor: pointer;
  text-align: left;
}

.detail-group-header:hover {
  background-color: var(--bg-tertiary);
  color: var(--accent-primary);
}

.detail-group-body {
  padding: 10px 14px;
  border-top: 1px solid var(--border-color);
  max-height: 360px;
  overflow-y: auto;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.detail-line {
  white-space: pre-wrap;
  word-break: break-all;
}

.detail-line.muted {
  color: var(--text-muted);
  font-style: italic;
}

.detail-pre {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  white-space: pre-wrap;
}

.animate-fade {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>