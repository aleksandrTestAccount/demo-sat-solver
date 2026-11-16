<script setup>
defineProps({
  items: { type: Array, required: true },
  activeId: { type: String, required: true },
  collapsed: { type: Boolean, default: false },
  mobileOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['select'])
</script>

<template>
  <aside
    aria-label="Chapters navigation"
    :class="['sidebar', { 'is-collapsed': collapsed, 'is-mobile-open': mobileOpen }]"
  >
    <div class="sidebar-inner">
      <ul class="sidebar-menu">
        <li v-for="item in items" :key="item.id">
          <button
            type="button"
            :aria-current="activeId === item.id ? 'page' : undefined"
            :class="['sidebar-item', { active: activeId === item.id }]"
            @click="emit('select', item.id)"
          >
            <span class="active-indicator" aria-hidden="true"></span>
            <span class="item-text">{{ item.title || item.name }}</span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background-color: var(--bg-tertiary);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar.is-collapsed {
  width: 0;
}

.sidebar-inner {
  width: var(--sidebar-width);
  box-sizing: border-box;
  padding: 14px 14px 32px 10px;
}

.sidebar-menu {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-item {
  width: 100%;
  background: transparent;
  border: none;
  text-align: left;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  transition: background-color 0.15s, color 0.15s;
}

.item-text {
  font-family: var(--font-sans);
  font-size: 0.86rem;
  line-height: 1.35;
  color: var(--text-secondary);
}

.sidebar-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.sidebar-item:hover .item-text {
  color: var(--text-main);
}

.sidebar-item.active {
  background-color: var(--accent-soft);
}

.sidebar-item.active .item-text {
  color: var(--accent-primary);
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: transparent;
}

.sidebar-item.active .active-indicator {
  background-color: var(--accent-primary);
}

@media (max-width: 960px) {
  .sidebar,
  .sidebar.is-collapsed {
    width: 100%;
    max-height: 0;
    border-bottom: 1px solid transparent;
    transition: max-height 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
  }

  .sidebar.is-mobile-open {
    max-height: 300px;
    border-bottom-color: var(--border-color);
  }

  .sidebar-inner {
    width: 100%;
  }
}
</style>