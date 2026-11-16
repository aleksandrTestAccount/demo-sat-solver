<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { highlightCode } from '../utils/highlight.js'

const COPY_FEEDBACK_MS = 1500

const props = defineProps({
  htmlContent: { type: String, required: true },
  fileName: { type: String, default: 'example' }
})

const chunkRoot = ref(null)
const activeTimers = new Set()

const decodeHtmlEntities = (text) => {
  return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
}

const clearAllTimers = () => {
  for (const id of activeTimers) {
    clearTimeout(id)
  }
  activeTimers.clear()
}

const transformDOM = () => {
  if (!chunkRoot.value) return
  clearAllTimers()

  // Enhance .e0 / .eproto code blocks with syntax highlighting and editor copy action
  const preElements = chunkRoot.value.querySelectorAll('pre[data-lang="e0"], pre[data-lang="eproto"]')

  preElements.forEach((pre, index) => {
    const rawCode = decodeHtmlEntities(pre.textContent || '')
    const highlightedHtml = highlightCode(rawCode)
    const fileIndex = index + 1

    const cardWrapper = document.createElement('div')
    cardWrapper.className = 'code-block-wrapper'
    cardWrapper.innerHTML = `
      <div class="code-header">
        <span class="code-lang">// ${props.fileName}_src_${fileIndex}.eproto</span>
        <button type="button" class="copy-to-editor-btn" data-action="copy">Copy To Editor →</button>
      </div>
      <pre><code>${highlightedHtml}</code></pre>
    `

    pre.parentNode.replaceChild(cardWrapper, pre)
  })

  // Wrap tables in a horizontal scroll container so full-width tables never break layout
  const tables = chunkRoot.value.querySelectorAll('table')
  
  tables.forEach((table) => {
    if (table.parentElement?.classList.contains('table-scroll-wrapper')) return
    const scrollWrapper = document.createElement('div')
    scrollWrapper.className = 'table-scroll-wrapper'
    table.parentNode.insertBefore(scrollWrapper, table)
    scrollWrapper.appendChild(table)
  })
}

const handleLocalClick = (event) => {
  const copyBtn = event.target.closest('[data-action="copy"]')
  if (!copyBtn) return

  copyBtn.textContent = 'Copied ✓'
  copyBtn.classList.add('is-copied')

  const timerId = setTimeout(() => {
    copyBtn.textContent = 'Copy To Editor →'
    copyBtn.classList.remove('is-copied')
    activeTimers.delete(timerId)
  }, COPY_FEEDBACK_MS)

  activeTimers.add(timerId)
}

onMounted(transformDOM)

watch(
  () => props.htmlContent,
  () => {
    nextTick(transformDOM)
  }
)

onBeforeUnmount(clearAllTimers)
</script>

<template>
  <div class="chunk-wrapper" ref="chunkRoot" v-html="htmlContent" @click="handleLocalClick"></div>
</template>

<style scoped>
.chunk-wrapper {
  width: 100%;
  font-family: var(--font-sans);
  color: var(--text-secondary);
}

/* Hide duplicate H1 inside contentHtml since chapter title is rendered in header */
:deep(> h1:first-child) {
  display: none;
}

/* Headings */
:deep(h2) {
  font-family: var(--font-sans);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-main);
  margin-top: 34px;
  margin-bottom: 14px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border-color);
}

:deep(h3) {
  font-family: var(--font-sans);
  font-size: 1.12rem;
  font-weight: 700;
  color: var(--text-main);
  margin-top: 26px;
  margin-bottom: 10px;
}

:deep(h4) {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-top: 20px;
  margin-bottom: 8px;
}

/* Paragraphs */
:deep(p),
:deep(.chunk-paragraph) {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 18px;
}

:deep(p strong),
:deep(.chunk-paragraph strong),
:deep(li strong) {
  color: var(--text-main);
  font-weight: 600;
}

/* Lists */
:deep(ul),
:deep(ol) {
  margin-top: 4px;
  margin-bottom: 20px;
  padding-left: 26px;
}

:deep(li) {
  font-family: var(--font-sans);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

:deep(li::marker) {
  color: var(--accent-primary);
  font-weight: 600;
}

/* Inline Code */
:deep(:not(pre) > code) {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--accent-primary);
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  padding: 2px 6px;
  white-space: nowrap;
}

/* Links */
:deep(a) {
  color: var(--accent-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s ease;
}

:deep(a:hover) {
  border-bottom-color: var(--accent-primary);
}

/* Callouts & Blockquotes */
:deep(blockquote) {
  margin: 20px 0;
  padding: 14px 18px;
  background-color: var(--bg-tertiary);
  border-left: 3px solid var(--accent-primary);
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.65;
}

:deep(blockquote p:last-child) {
  margin-bottom: 0;
}

/* Divider */
:deep(hr) {
  border: none;
  border-top: 1px solid var(--border-color);
  margin: 30px 0;
}

/* Tables */
:deep(.table-scroll-wrapper) {
  width: 100%;
  overflow-x: auto;
  margin: 20px 0 26px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-editor);
}

:deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

:deep(thead) {
  background-color: var(--bg-tertiary);
}

:deep(th),
:deep(td) {
  padding: 11px 14px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  line-height: 1.55;
}

:deep(th:last-child),
:deep(td:last-child) {
  border-right: none;
}

:deep(tbody tr:last-child td) {
  border-bottom: none;
}

:deep(th) {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--text-main);
  white-space: nowrap;
}

:deep(td) {
  color: var(--text-secondary);
}

:deep(tbody tr:hover) {
  background-color: var(--bg-secondary);
}

/* Interactive Code Blocks */
:deep(.code-block-wrapper) {
  background-color: var(--bg-editor);
  border: 1px solid var(--border-color);
  border-radius: 0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-top: 18px;
  margin-bottom: 26px;
}

:deep(.code-header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 14px;
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
}

:deep(pre) {
  padding: 16px 18px;
  overflow-x: auto;
  margin: 0;
  background: transparent;
}

:deep(pre code) {
  font-family: var(--font-mono);
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--text-main);
  background: transparent;
  border: none;
  padding: 0;
  white-space: pre;
}

:deep(.copy-to-editor-btn) {
  background-color: var(--bg-editor);
  border: 1px solid var(--border-color);
  color: var(--accent-primary);
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.15s ease;
}

:deep(.copy-to-editor-btn:hover) {
  background-color: var(--accent-soft);
  border-color: var(--accent-primary);
  color: var(--accent-hover);
}

:deep(.copy-to-editor-btn.is-copied) {
  background-color: var(--status-success-bg);
  border-color: var(--status-success-border);
  color: var(--status-success);
}

:deep(.copy-to-editor-btn:active) {
  transform: scale(0.97);
}
</style>