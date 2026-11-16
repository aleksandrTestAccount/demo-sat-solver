import { ref, onBeforeUnmount } from 'vue'

export function useSplitPane({ initialPercent = 60, minPercent = 20, maxPercent = 80 } = {}) {
  const leftWidthPercent = ref(initialPercent)
  const isResizing = ref(false)
  const containerRef = ref(null)

  const onResize = (event) => {
    if (!isResizing.value || !containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const rawPercent = (offsetX / rect.width) * 100
    leftWidthPercent.value = Math.min(maxPercent, Math.max(minPercent, Math.round(rawPercent * 10) / 10))
  }

  const stopResize = () => {
    if (!isResizing.value) return
    isResizing.value = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    window.removeEventListener('mousemove', onResize)
    window.removeEventListener('mouseup', stopResize)
  }

  const startResize = () => {
    isResizing.value = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onResize)
    window.addEventListener('mouseup', stopResize)
  }

  const resetSplit = () => {
    leftWidthPercent.value = initialPercent
  }

  onBeforeUnmount(stopResize)

  return {
    containerRef,
    leftWidthPercent,
    isResizing,
    startResize,
    resetSplit
  }
}