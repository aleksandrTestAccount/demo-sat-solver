<script setup>
defineProps({
  tabs: { type: Array, default: () => [] },
  activeTab: { type: String, default: '' },
  isMobileMenuOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['update:activeTab', 'toggle-mobile-menu'])
</script>

<template>
  <nav class="docs-topnav" aria-label="Documentation sections">
    <!-- Mobile Hamburger Button (visible only on screens <= 960px) -->
    <button
      type="button"
      class="mobile-menu-btn"
      :aria-expanded="isMobileMenuOpen"
      :aria-label="isMobileMenuOpen ? 'Close chapters menu' : 'Open chapters menu'"
      :title="isMobileMenuOpen ? 'Close chapters' : 'Open chapters'"
      @click="emit('toggle-mobile-menu')"
    >
      <svg v-if="!isMobileMenuOpen" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <line x1="2.5" y1="4.5" x2="13.5" y2="4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="2.5" y1="8" x2="13.5" y2="8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        <line x1="2.5" y1="11.5" x2="13.5" y2="11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>

    <div class="mobile-divider" aria-hidden="true"></div>

    <div class="nav-tabs-list" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :class="['nav-tab-btn', { active: activeTab === tab.id }]"
        @click="emit('update:activeTab', tab.id)"
      >
        {{ tab.title }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.docs-topnav {
  height: var(--subbar-height);
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  overflow-x: auto;
}

.mobile-menu-btn,
.mobile-divider {
  display: none;
}

.nav-tabs-list {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-tab-btn {
  height: 30px;
  padding: 0 14px;
  font-family: var(--font-sans);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.nav-tab-btn:hover {
  color: var(--text-main);
  background-color: rgba(0, 0, 0, 0.04);
}

.nav-tab-btn.active {
  color: var(--accent-primary);
  background-color: var(--bg-editor);
  border-color: var(--border-color);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

@media (max-width: 960px) {
  .docs-topnav {
    padding: 0 12px;
  }

  .mobile-menu-btn {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-editor);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    cursor: pointer;
    flex-shrink: 0;
  }

  .mobile-divider {
    display: block;
    width: 1px;
    height: 18px;
    background-color: var(--border-color);
    margin: 0 4px;
    flex-shrink: 0;
  }
}
</style>