import { ref, watch, onBeforeUnmount } from 'vue'
import { highlightCode } from '../utils/highlight.js'

export function useCodeHighlighter(sourceCode) {
  const highlightedCode = ref('')
  let rafId = null

  const renderHighlightedHtml = (text) => {
    const rawText = text ?? ''
    const html = highlightCode(rawText)
    
    highlightedCode.value = rawText.endsWith('\n') ? html + ' ' : html
  }

  
  renderHighlightedHtml(sourceCode.value)

  watch(sourceCode, (newVal) => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
    rafId = requestAnimationFrame(() => {
      renderHighlightedHtml(newVal)
      rafId = null
    })
  })

  onBeforeUnmount(() => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
  })

  return {
    highlightedCode
  }
}