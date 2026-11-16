<script setup>
defineProps({
  prev: { type: Object, default: null },
  next: { type: Object, default: null }
})

const emit = defineEmits(['select'])
</script>

<template>
  <nav v-if="prev || next" class="chapter-pager" aria-label="Section navigation">
    <button
      v-if="prev"
      type="button"
      class="pager-btn pager-prev"
      @click="emit('select', prev.id)"
    >
      <span class="pager-label">← Previous</span>
      <span class="pager-title">{{ prev.title || prev.name }}</span>
    </button>
    <div v-else class="pager-btn pager-prev is-disabled" aria-hidden="true">
      <span class="pager-label">← Previous</span>
      <span class="pager-title">Start of Section</span>
    </div>

    <button
      v-if="next"
      type="button"
      class="pager-btn pager-next"
      @click="emit('select', next.id)"
    >
      <span class="pager-label">Next →</span>
      <span class="pager-title">{{ next.title || next.name }}</span>
    </button>
    <div v-else class="pager-btn pager-next is-disabled" aria-hidden="true">
      <span class="pager-label">Next →</span>
      <span class="pager-title">End of Section</span>
    </div>
  </nav>
</template>

<style scoped>
.chapter-pager {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.pager-btn {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  padding: 10px 14px;
  line-height: 1.35;
  background-color: var(--bg-editor);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.15s ease;
  min-width: 0;
}

.pager-prev {
  text-align: left;
  align-items: flex-start;
}

.pager-next {
  text-align: right;
  align-items: flex-end;
}

.pager-btn:not(.is-disabled):hover {
  border-color: var(--accent-primary);
  background-color: var(--bg-tertiary);
}

.pager-btn.is-disabled {
  opacity: 0.45;
  cursor: default;
  background-color: var(--bg-tertiary);
}

.pager-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--text-muted);
}

.pager-btn:not(.is-disabled):hover .pager-label {
  color: var(--accent-primary);
}

.pager-title {
  font-family: var(--font-sans);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.pager-btn.is-disabled .pager-title {
  color: var(--text-muted);
  font-weight: 500;
}

@media (max-width: 600px) {
  .chapter-pager {
    grid-template-columns: 1fr;
  }
  .pager-btn.is-disabled {
    display: none;
  }
}
</style>